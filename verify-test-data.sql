-- Verify Customer Test Data Created
-- Customer ID: 96bed446-cf53-437a-b924-5f6bedd6effe
-- Email: customer.test.1769234475096@example.com

-- 1. Verify User Created
SELECT 'USER DATA:' AS section;
SELECT id, email, full_name, role, is_active, created_at 
FROM users 
WHERE id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid;

-- 2. Verify User Profile
SELECT 'PROFILE DATA:' AS section;
SELECT user_id, phone, fiscal_code, address, city, postal_code, province
FROM user_profiles 
WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid;

-- 3. Verify Family Member Created
SELECT 'FAMILY MEMBER DATA:' AS section;
SELECT id, user_id, full_name, relationship, fiscal_code, created_at
FROM family_members 
WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid;

-- 4. Verify Subscription Created
SELECT 'SUBSCRIPTION DATA:' AS section;
SELECT id, user_id, plan_id, status, start_date, created_at
FROM user_subscriptions 
WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid;

-- 5. Verify Service Request Created
SELECT 'SERVICE REQUEST DATA:' AS section;
SELECT id, user_id, service_type_id, status, request_data::text, created_at
FROM service_requests 
WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid;

-- 6. Verify Request Status History
SELECT 'REQUEST STATUS HISTORY:' AS section;
SELECT id, request_id, status, changed_by, created_at
FROM request_status_history 
WHERE request_id IN (
    SELECT id FROM service_requests 
    WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid
);

-- 7. Verify Appointment Created (and cancelled)
SELECT 'APPOINTMENT DATA:' AS section;
SELECT id, user_id, service_request_id, appointment_date, status, created_at
FROM appointments 
WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid;

-- 8. Verify GDPR Consent History
SELECT 'GDPR CONSENT HISTORY:' AS section;
SELECT id, user_id, gdpr_consent, marketing_consent, created_at
FROM gdpr_consents 
WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid 
ORDER BY created_at DESC 
LIMIT 5;

-- 9. Count All Related Records
SELECT 'SUMMARY:' AS section;
SELECT 
    'Users' AS entity, COUNT(*) AS count 
FROM users WHERE id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid
UNION ALL
SELECT 
    'Profiles', COUNT(*) 
FROM user_profiles WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid
UNION ALL
SELECT 
    'Family Members', COUNT(*) 
FROM family_members WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid
UNION ALL
SELECT 
    'Subscriptions', COUNT(*) 
FROM user_subscriptions WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid
UNION ALL
SELECT 
    'Service Requests', COUNT(*) 
FROM service_requests WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid
UNION ALL
SELECT 
    'Appointments', COUNT(*) 
FROM appointments WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid
UNION ALL
SELECT 
    'GDPR Consents', COUNT(*) 
FROM gdpr_consents WHERE user_id = '96bed446-cf53-437a-b924-5f6bedd6effe'::uuid;
