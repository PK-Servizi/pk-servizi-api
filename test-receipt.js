/**
 * Quick test for receipt endpoint
 */

const API_BASE = 'http://localhost:3000/api/v1';

async function testReceipt() {
  console.log('🧪 Testing Receipt Endpoint');
  console.log('=' .repeat(50));

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

    // Step 2: Get payment ID (using the one from the error)
    const paymentId = 'bda3b761-6b8e-4a53-824e-081c031fd659';
    console.log(`\n📄 Step 2: Fetching receipt for payment: ${paymentId}`);

    // Step 3: Test receipt endpoint
    const receiptResponse = await fetch(`${API_BASE}/payments/${paymentId}/receipt`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`\n📊 Response Status: ${receiptResponse.status}`);
    
    const receiptData = await receiptResponse.json();
    console.log('\n📋 Receipt Response:');
    console.log(JSON.stringify(receiptData, null, 2));

    if (receiptData.success) {
      console.log('\n✅ SUCCESS! Receipt endpoint is working');
      console.log(`📎 Receipt URL: ${receiptData.data.receiptUrl}`);
    } else {
      console.log('\n❌ FAILED:', receiptData.message);
    }

  } catch (error) {
    console.log('\n❌ Error:', error.message);
  }
}

testReceipt();
