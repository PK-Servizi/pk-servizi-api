#!/bin/bash

# Test script to verify admin service request detail fix
echo "Testing Admin Service Request Detail Fix..."
echo "==========================================="

# 1. Login as admin
echo -e "\n1. Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pkservizi.com",
    "password": "Admin@123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful! Token obtained."

# 2. Get list of service requests
echo -e "\n2. Fetching service requests..."
REQUESTS=$(curl -s -X GET "http://localhost:3000/api/v1/admin/requests?take=1" \
  -H "Authorization: Bearer $TOKEN")

REQUEST_ID=$(echo $REQUESTS | jq -r '.data[0].id')

if [ "$REQUEST_ID" == "null" ] || [ -z "$REQUEST_ID" ]; then
  echo "⚠️  No service requests found in database"
  echo "Response: $REQUESTS"
  exit 0
fi

echo "✅ Found service request: $REQUEST_ID"

# 3. Get request detail (this was failing before)
echo -e "\n3. Fetching request detail (testing the fix)..."
DETAIL_RESPONSE=$(curl -s -X GET "http://localhost:3000/api/v1/admin/requests/$REQUEST_ID" \
  -H "Authorization: Bearer $TOKEN")

SUCCESS=$(echo $DETAIL_RESPONSE | jq -r '.success')

if [ "$SUCCESS" == "true" ]; then
  echo "✅ SUCCESS! Request detail fetched without errors!"
  echo "Response:"
  echo $DETAIL_RESPONSE | jq '.'
else
  echo "❌ FAILED! Still getting errors:"
  echo $DETAIL_RESPONSE | jq '.'
  exit 1
fi

echo -e "\n==========================================="
echo "🎉 All tests passed! The fix is working!"
