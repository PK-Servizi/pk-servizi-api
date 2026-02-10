/**
 * Complete Flow: Create Payment → Download Receipt & Invoice
 */

const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3000/api/v1';
let authToken = '';
let paymentId = '';

async function completeFlow() {
  console.log('🎯 Complete Flow: Payment → Receipt & Invoice Download');
  console.log('='.repeat(70));

  try {
    // Step 1: Login
    console.log('\n📝 Step 1: Login/Register...');
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
      console.log('❌ Login failed');
      return;
    }

    authToken = loginData.data.accessToken;
    console.log('✅ Logged in successfully');

    // Step 2: Get a service to request
    console.log('\n📋 Step 2: Getting available services...');
    const servicesResponse = await fetch(`${API_BASE}/services`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const servicesData = await servicesResponse.json();
    
    if (!servicesData.success || !servicesData.data.items.length) {
      console.log('❌ No services available');
      return;
    }

    const service = servicesData.data.items[0];
    console.log(`✅ Found service: ${service.name} (€${(service.price / 100).toFixed(2)})`);

    // Step 3: Initiate service request (creates payment)
    console.log('\n💳 Step 3: Initiating service request...');
    const initiateResponse = await fetch(`${API_BASE}/service-requests/initiate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        serviceId: service.id
      })
    });

    const initiateData = await initiateResponse.json();
    if (!initiateData.success) {
      console.log('❌ Failed to initiate:', initiateData.message);
      return;
    }

    paymentId = initiateData.data.paymentId;
    console.log(`✅ Service request created`);
    console.log(`   Payment ID: ${paymentId}`);
    console.log(`   Amount: €${(initiateData.data.amount / 100).toFixed(2)}`);

    // Step 4: Simulate payment completion (in real app, this happens via Stripe)
    console.log('\n⏳ Waiting for payment to be processed...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 5: Download Receipt
    console.log('\n📥 Step 5: Downloading Receipt...');
    const receiptResponse = await fetch(`${API_BASE}/payments/${paymentId}/receipt`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (receiptResponse.ok) {
      const receiptBuffer = await receiptResponse.arrayBuffer();
      const receiptPath = path.join(__dirname, `receipt-${paymentId}.html`);
      fs.writeFileSync(receiptPath, Buffer.from(receiptBuffer));
      console.log(`✅ Receipt downloaded successfully!`);
      console.log(`   📄 File: ${receiptPath}`);
      console.log(`   📊 Size: ${(receiptBuffer.byteLength / 1024).toFixed(2)} KB`);
    } else {
      const errorText = await receiptResponse.text();
      console.log(`❌ Receipt download failed: ${receiptResponse.status}`);
      console.log(`   Error: ${errorText.substring(0, 200)}`);
    }

    // Step 6: Download Invoice
    console.log('\n📥 Step 6: Downloading Invoice...');
    const invoiceResponse = await fetch(`${API_BASE}/payments/${paymentId}/invoice`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (invoiceResponse.ok) {
      const invoiceBuffer = await invoiceResponse.arrayBuffer();
      const invoicePath = path.join(__dirname, `invoice-${paymentId}.html`);
      fs.writeFileSync(invoicePath, Buffer.from(invoiceBuffer));
      console.log(`✅ Invoice downloaded successfully!`);
      console.log(`   📄 File: ${invoicePath}`);
      console.log(`   📊 Size: ${(invoiceBuffer.byteLength / 1024).toFixed(2)} KB`);
    } else {
      const errorText = await invoiceResponse.text();
      console.log(`❌ Invoice download failed: ${invoiceResponse.status}`);
      console.log(`   Error: ${errorText.substring(0, 200)}`);
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('✅ FLOW COMPLETED SUCCESSFULLY!');
    console.log('\n📋 Summary:');
    console.log(`   Payment ID: ${paymentId}`);
    console.log(`   Receipt: receipt-${paymentId}.html`);
    console.log(`   Invoice: invoice-${paymentId}.html`);
    console.log('\n📖 How to view PDFs:');
    console.log('   1. Open the HTML files in your browser');
    console.log('   2. Press Ctrl+P (or Cmd+P on Mac) to print');
    console.log('   3. Select "Save as PDF" as the printer');
    console.log('   4. Save the PDF file');
    console.log('\n🔗 Direct URLs (with authentication):');
    console.log(`   Receipt: ${API_BASE}/payments/${paymentId}/receipt`);
    console.log(`   Invoice: ${API_BASE}/payments/${paymentId}/invoice`);
    console.log('\n💡 Tip: You can also access these URLs directly in browser (after login)');

  } catch (error) {
    console.log('\n❌ Error:', error.message);
    console.error(error);
  }
}

completeFlow();
