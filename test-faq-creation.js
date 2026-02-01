const BASE_URL = 'http://localhost:3000/api/v1';

// Test FAQ creation with admin authentication
async function testFaqCreation() {
  try {
    console.log('=== Testing FAQ Creation ===\n');

    // Step 1: Admin Login
    console.log('Step 1: Logging in as admin...');
    const loginResponse = await fetch(`${BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@pkservizi.com',
        password: 'Admin@123',
      }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      throw new Error(`Login failed: ${JSON.stringify(errorData)}`);
    }

    const loginData = await loginResponse.json();
    const accessToken = loginData.data.accessToken;
    console.log('✓ Admin login successful');
    console.log('Access Token:', accessToken.substring(0, 50) + '...\n');

    // Step 2: Create FAQ
    console.log('Step 2: Creating FAQ...');
    const faqData = {
      serviceId: '1b7e244b-6092-4236-afc9-9d66fba5b2a7',
      question: 'What documents do I need for ISEE calculation?',
      answer: 'You will need: identity documents, fiscal code, income documents...',
      order: 1,
      category: 'Documents',
      isActive: true,
    };

    const createResponse = await fetch(`${BASE_URL}/faqs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(faqData),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(`Create FAQ failed: ${JSON.stringify(errorData, null, 2)}`);
    }

    const createData = await createResponse.json();
    console.log('✓ FAQ created successfully');
    console.log('Response:', JSON.stringify(createData, null, 2));

    // Step 3: Get all FAQs (Admin)
    console.log('\nStep 3: Fetching all FAQs...');
    const getAllResponse = await fetch(`${BASE_URL}/faqs`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!getAllResponse.ok) {
      const errorData = await getAllResponse.json();
      throw new Error(`Get FAQs failed: ${JSON.stringify(errorData)}`);
    }

    const getAllData = await getAllResponse.json();
    console.log('✓ FAQs fetched successfully');
    console.log(`Total FAQs: ${getAllData.data.length}`);

    // Step 4: Get public FAQs (No auth required)
    console.log('\nStep 4: Fetching public FAQs...');
    const publicResponse = await fetch(`${BASE_URL}/faqs/public`);

    if (!publicResponse.ok) {
      const errorData = await publicResponse.json();
      throw new Error(`Get public FAQs failed: ${JSON.stringify(errorData)}`);
    }

    const publicData = await publicResponse.json();
    console.log('✓ Public FAQs fetched successfully');
    console.log(`Total public FAQs: ${publicData.data.length}`);

    console.log('\n=== All tests passed! ===');
  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error(error.message);
  }
}

// Run the test
testFaqCreation();
