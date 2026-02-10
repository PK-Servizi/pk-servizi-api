/**
 * Test downloading Receipt and Invoice PDFs
 */

const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3000/api/v1';

async function downloadPDFs() {
  console.log('📄 Testing PDF Download - Receipt & Invoice');
  console.log('='.repeat(60));

  try {
    // Step 1: Login
    console.log('\n📝 Step 1: Login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.refund@example.com',
        password: 'Test123!'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      console.log('❌ Login failed:', loginData.message);
      return;
    }

    const token = loginData.data.accessToken;
    console.log('✅ Logged in successfully');

    // Payment ID from your previous request
    const paymentId = 'bda3b761-6b8e-4a53-824e-081c031fd659';
    
    // Step 2: Download Receipt
    console.log(`\n📥 Step 2: Downloading Receipt for payment: ${paymentId}...`);
    const receiptResponse = await fetch(`${API_BASE}/payments/${paymentId}/receipt`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (receiptResponse.ok) {
      const receiptBuffer = await receiptResponse.arrayBuffer();
      const receiptPath = path.join(__dirname, `receipt-${paymentId}.html`);
      fs.writeFileSync(receiptPath, Buffer.from(receiptBuffer));
      console.log(`✅ Receipt downloaded: ${receiptPath}`);
      console.log(`   Size: ${(receiptBuffer.byteLength / 1024).toFixed(2)} KB`);
    } else {
      console.log(`❌ Receipt download failed: ${receiptResponse.status} ${receiptResponse.statusText}`);
      const error = await receiptResponse.text();
      console.log('   Error:', error);
    }

    // Step 3: Download Invoice
    console.log(`\n📥 Step 3: Downloading Invoice for payment: ${paymentId}...`);
    const invoiceResponse = await fetch(`${API_BASE}/payments/${paymentId}/invoice`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (invoiceResponse.ok) {
      const invoiceBuffer = await invoiceResponse.arrayBuffer();
      const invoicePath = path.join(__dirname, `invoice-${paymentId}.html`);
      fs.writeFileSync(invoicePath, Buffer.from(invoiceBuffer));
      console.log(`✅ Invoice downloaded: ${invoicePath}`);
      console.log(`   Size: ${(invoiceBuffer.byteLength / 1024).toFixed(2)} KB`);
    } else {
      console.log(`❌ Invoice download failed: ${invoiceResponse.status} ${invoiceResponse.statusText}`);
      const error = await invoiceResponse.text();
      console.log('   Error:', error);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ DOWNLOAD COMPLETE!');
    console.log('\n📖 How to view:');
    console.log('   1. Open the HTML files in your browser');
    console.log('   2. Use browser\'s "Print to PDF" to save as actual PDF');
    console.log('\n📌 URLs you can use:');
    console.log(`   Receipt: ${API_BASE}/payments/${paymentId}/receipt`);
    console.log(`   Invoice: ${API_BASE}/payments/${paymentId}/invoice`);

  } catch (error) {
    console.log('\n❌ Error:', error.message);
  }
}

downloadPDFs();
