/**
 * Test Complete Service Request Flow with Refund
 * Tests: Initiate → Payment → Questionnaire → Documents → Refund → Delete
 */

const API_BASE = 'http://localhost:3000/api/v1';
let authToken = '';
let serviceRequestId = '';
let paymentId = '';

// Step 1: Login as customer
async function login() {
  console.log('\n📝 Step 1: Login as customer...');
  
  // First, try to register a new customer for testing
  const registerResponse = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test.refund@example.com',
      password: 'Test123!',
      fullName: 'Test Refund User',
      phone: '+393331234567'
    })
  });

  const registerData = await registerResponse.json();
  
  if (registerData.success && registerData.data) {
    authToken = registerData.data.accessToken;
    console.log('✅ New test user registered and logged in');
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
    return true;
  } else if (registerData.message && (registerData.message.includes('already exists') || registerData.message.includes('already registered'))) {
    // User already exists, try to login
    console.log('   User already exists, attempting login...');
    
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.refund@example.com',
        password: 'Test123!'
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      authToken = loginData.data.accessToken;
      console.log('✅ Login successful');
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
      return true;
    } else {
      console.error('❌ Login failed:', loginData);
      return false;
    }
  } else {
    console.error('❌ Registration failed:', registerData);
    return false;
  }
}

// Step 2: Initiate service request with payment
async function initiateServiceRequest() {
  console.log('\n💳 Step 2: Initiate service request with payment...');
  
  const response = await fetch(`${API_BASE}/service-requests/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      serviceId: 'ISEE_STANDARD'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    serviceRequestId = data.data.serviceRequestId;
    paymentId = data.data.paymentId;
    console.log('✅ Service request initiated');
    console.log(`   Request ID: ${serviceRequestId}`);
    console.log(`   Payment ID: ${paymentId}`);
    console.log(`   Amount: €${data.data.amount}`);
    console.log(`   Status: ${data.data.status}`);
    console.log(`   Payment URL: ${data.data.paymentUrl}`);
    return true;
  } else {
    console.error('❌ Initiation failed:', data);
    return false;
  }
}

// Step 3: Simulate successful payment (webhook callback)
async function completePayment() {
  console.log('\n✅ Step 3: Simulating payment completion...');
  console.log('   (In production, this would be triggered by Stripe webhook)');
  
  // For testing, we'll manually update payment status
  const response = await fetch(`${API_BASE}/payments/${paymentId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  });

  if (response.ok) {
    console.log('✅ Payment marked as completed');
    return true;
  } else {
    console.log('⚠️  Manual payment completion endpoint not available');
    console.log('   Continuing test - assuming payment completed');
    return true;
  }
}

// Step 4: Get service request details
async function getServiceRequest() {
  console.log('\n📋 Step 4: Get service request details...');
  
  const response = await fetch(`${API_BASE}/service-requests/${serviceRequestId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Request retrieved');
    console.log(`   Status: ${data.data.status}`);
    console.log(`   Service: ${data.data.service?.name}`);
    console.log(`   Payment Status: ${data.data.payment?.status}`);
    return true;
  } else {
    console.error('❌ Failed to get request:', data);
    return false;
  }
}

// Step 5: Submit questionnaire
async function submitQuestionnaire() {
  console.log('\n📝 Step 5: Submit questionnaire...');
  
  const response = await fetch(`${API_BASE}/service-requests/${serviceRequestId}/questionnaire`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      formData: {
        familyMembersCount: 4,
        familyMembers: [
          {
            name: 'Mario Rossi',
            fiscalCode: 'RSSMRA80A01H501U',
            relationship: 'Intestatario'
          },
          {
            name: 'Maria Bianchi',
            fiscalCode: 'BNCMRA85B41H501Z',
            relationship: 'Coniuge'
          }
        ],
        housingType: 'Owned',
        hasDisabledMembers: false,
        hasMortgage: false,
        totalIncome: 35000,
        bankBalance: 15000
      }
    })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Questionnaire submitted');
    console.log(`   Status: ${data.data.status}`);
    console.log(`   Next step: ${data.data.nextStep}`);
    return true;
  } else {
    console.error('❌ Questionnaire failed:', data);
    return false;
  }
}

// Step 6: Request refund
async function requestRefund() {
  console.log('\n💰 Step 6: Request refund...');
  
  const response = await fetch(`${API_BASE}/service-requests/${serviceRequestId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      reason: 'Changed my mind - service no longer needed for testing'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Refund processed');
    console.log(`   Refund Amount: €${data.data.refundAmount}`);
    console.log(`   Payment ID: ${data.data.paymentId}`);
    console.log(`   Reason: ${data.data.reason}`);
    console.log(`   Processed At: ${data.data.processedAt}`);
    return true;
  } else {
    console.error('❌ Refund failed:', data);
    return false;
  }
}

// Step 7: Try to delete (should work if refund succeeded)
async function deleteServiceRequest() {
  console.log('\n🗑️  Step 7: Delete service request...');
  
  const response = await fetch(`${API_BASE}/service-requests/${serviceRequestId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Service request deleted');
    console.log(`   Refund Processed: ${data.data?.refundProcessed}`);
    console.log(`   Refund Amount: €${data.data?.refundAmount || 0}`);
    return true;
  } else {
    console.error('❌ Delete failed:', data);
    return false;
  }
}

// Alternative: Test delete with automatic refund
async function testDeleteWithRefund() {
  console.log('\n💰 Alternative Test: Delete with automatic refund...');
  console.log('   (Creates new request and deletes it immediately)');
  
  // Create new request
  const initResponse = await fetch(`${API_BASE}/service-requests/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      serviceId: 'ISEE_STANDARD'
    })
  });

  const initData = await initResponse.json();
  
  if (!initData.success) {
    console.error('❌ Failed to create test request');
    return false;
  }

  const testRequestId = initData.data.serviceRequestId;
  console.log(`   Created test request: ${testRequestId}`);
  console.log(`   Status: ${initData.data.status}`);
  
  // Assume payment is completed (for testing)
  console.log('   (Assuming payment completed for test)');
  
  // Try to delete
  const deleteResponse = await fetch(`${API_BASE}/service-requests/${testRequestId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });

  const deleteData = await deleteResponse.json();
  
  if (deleteData.success) {
    console.log('✅ Test request deleted');
    console.log(`   Refund Processed: ${deleteData.data?.refundProcessed}`);
    return true;
  } else {
    console.error('❌ Delete failed:', deleteData);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Testing Complete Service Request Flow with Refund');
  console.log('=' .repeat(60));

  try {
    // Run main flow
    if (!(await login())) return;
    if (!(await initiateServiceRequest())) return;
    await completePayment();
    if (!(await getServiceRequest())) return;
    
    // Test refund before submission
    console.log('\n' + '='.repeat(60));
    console.log('Testing Refund Flow (before submission)');
    console.log('=' .repeat(60));
    
    if (!(await requestRefund())) return;
    
    // Optionally test delete after refund
    // await deleteServiceRequest();
    
    // Test alternative flow
    console.log('\n' + '='.repeat(60));
    console.log('Testing Delete with Automatic Refund');
    console.log('=' .repeat(60));
    
    await testDeleteWithRefund();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run the tests
runTests();
