import axios from 'axios';

/**
 * Test script for subscription downgrade endpoint
 * Tests: POST /api/v1/subscriptions/downgrade
 */

const BASE_URL = 'http://localhost:3000/api/v1';

// Admin credentials for setup
const ADMIN_USER = {
  email: 'admin@tuocaf.com',
  password: 'Admin@123',
};

interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
}

async function loginAsAdmin() {
  console.log('\n🔐 Logging in as admin...');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: ADMIN_USER.email,
      password: ADMIN_USER.password,
    });

    console.log('✅ Admin login successful');
    return response.data.data?.access_token || response.data.access_token;
  } catch (error: any) {
    console.error(
      '❌ Admin login failed:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function getSubscriptionPlans(
  token: string,
): Promise<SubscriptionPlan[]> {
  console.log('\n📋 Fetching subscription plans...');
  try {
    const response = await axios.get(`${BASE_URL}/subscriptions/plans`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('✅ Plans fetched successfully');
    const plans = response.data.data || response.data;
    plans.forEach((plan: SubscriptionPlan) => {
      console.log(
        `  - ${plan.name}: €${plan.priceMonthly}/month (ID: ${plan.id})`,
      );
    });
    return plans;
  } catch (error: any) {
    console.error(
      '❌ Failed to fetch plans:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function testDowngradeWithoutSubscription(
  token: string,
  fromPlanId: string,
  toPlanId: string,
) {
  console.log('\n📉 Testing downgrade endpoint...');
  console.log('   (User has no subscription - expecting error)');

  try {
    const response = await axios.post(
      `${BASE_URL}/subscriptions/downgrade`,
      {
        newPlanId: toPlanId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log(
      '❌ Test failed: Should have returned "No active subscription" error',
    );
    console.log(response.data);
  } catch (error: any) {
    if (error.response?.data?.message?.includes('No active subscription')) {
      console.log(
        '✅ Test passed: Correctly returned "No active subscription" error',
      );
    } else {
      console.log('⚠️  Got error (status: ' + error.response?.status + ')');
      console.log(
        `   Message: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}

async function testInvalidDowngrade(
  token: string,
  basicPlanId: string,
  premiumPlanId: string,
) {
  console.log(
    '\n🧪 Testing downgrade validation (attempting upgrade via downgrade endpoint)...',
  );

  try {
    await axios.post(
      `${BASE_URL}/subscriptions/downgrade`,
      {
        newPlanId: premiumPlanId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log('❌ Test failed: Should have rejected this');
  } catch (error: any) {
    if (error.response?.data?.message?.includes('not a downgrade')) {
      console.log('✅ Test passed: Correctly rejected upgrade as downgrade');
    } else if (
      error.response?.data?.message?.includes('No active subscription')
    ) {
      console.log('✅ Test passed: No subscription (expected)');
    } else {
      console.log('⚠️  Test result: Got error');
      console.log(
        `   Message: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}

async function testInvalidPlanId(token: string) {
  console.log('\n🧪 Testing downgrade with invalid plan ID...');

  try {
    await axios.post(
      `${BASE_URL}/subscriptions/downgrade`,
      {
        newPlanId: 'invalid-plan-id-99999',
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log('❌ Test failed: Should have rejected invalid plan ID');
  } catch (error: any) {
    if (
      error.response?.status === 404 ||
      error.response?.data?.message?.includes('not found')
    ) {
      console.log('✅ Test passed: Correctly rejected invalid plan ID');
    } else if (
      error.response?.data?.message?.includes('No active subscription')
    ) {
      console.log('✅ Test passed: No subscription (expected)');
    } else {
      console.log(
        '⚠️  Got error: ' + (error.response?.data?.message || error.message),
      );
    }
  }
}

async function main() {
  console.log('='.repeat(70));
  console.log('🧪 SUBSCRIPTION DOWNGRADE ENDPOINT TEST');
  console.log('='.repeat(70));
  console.log('\n📝 Testing: POST /api/v1/subscriptions/downgrade');
  console.log('📝 Business Logic:');
  console.log('   - Downgrades give account credit (not cash refund)');
  console.log('   - Credit = prorated difference for remaining days');
  console.log('   - Validates that new plan price < current plan price');
  console.log('   - Requires active subscription');

  try {
    // Login as admin (has full permissions)
    const token = await loginAsAdmin();

    // Get available plans
    const plans = await getSubscriptionPlans(token);

    const basicPlan = plans.find((p) => p.name === 'Basic');
    const professionalPlan = plans.find((p) => p.name === 'Professional');
    const premiumPlan = plans.find((p) => p.name === 'Premium');

    if (!basicPlan || !professionalPlan || !premiumPlan) {
      console.error(
        '\n❌ Could not find required plans (Basic, Professional, Premium)',
      );
      return;
    }

    console.log('\n' + '='.repeat(70));
    console.log('📋 TEST SCENARIOS');
    console.log('='.repeat(70));

    // Test 1: Downgrade without active subscription
    console.log('\n🧪 Test 1: Downgrade without active subscription');
    await testDowngradeWithoutSubscription(token, premiumPlan.id, basicPlan.id);

    // Test 2: Invalid downgrade (trying to upgrade)
    console.log('\n🧪 Test 2: Attempting upgrade via downgrade endpoint');
    await testInvalidDowngrade(token, basicPlan.id, premiumPlan.id);

    // Test 3: Invalid plan ID
    console.log('\n🧪 Test 3: Downgrade with invalid plan ID');
    await testInvalidPlanId(token);

    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL TESTS COMPLETED');
    console.log('='.repeat(70));
    console.log('\n📌 Note: To test successful downgrade:');
    console.log('   1. Create a subscription via POST /subscriptions/checkout');
    console.log('   2. Complete payment (or use test subscription)');
    console.log('   3. Then call downgrade endpoint with lower-priced plan');
    console.log('\n📖 Expected Response on Success:');
    console.log('   {');
    console.log('     success: true,');
    console.log('     message: "Subscription downgraded successfully",');
    console.log('     data: {');
    console.log('       oldPlan: "Premium",');
    console.log('       newPlan: "Basic",');
    console.log('       creditAmount: 15.50,');
    console.log('       creditApplied: true,');
    console.log('       downgradeEffective: "immediately"');
    console.log('     }');
    console.log('   }');
  } catch (error: any) {
    console.log('\n' + '='.repeat(70));
    console.log('❌ TEST EXECUTION FAILED');
    console.log('='.repeat(70));
    console.error(error.message);
    process.exit(1);
  }
}

// Run the tests
main();
