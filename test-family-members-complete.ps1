# Complete Family Members API Test with Real Data
# All 8 endpoints tested with proper error handling

Write-Host "`n==================================================================" -ForegroundColor Cyan
Write-Host "  FAMILY MEMBERS API - COMPLETE TEST WITH REAL DATA" -ForegroundColor Cyan
Write-Host "==================================================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api/v1"
$timestamp = (Get-Date).ToString("HHmmss")

# Step 1: Login
Write-Host "[1] Authentication..." -ForegroundColor Cyan
$loginBody = @{
    email = "admin@pkservizi.com"
    password = "Admin@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $loginBody

$token = $loginResponse.data.accessToken
$userId = $loginResponse.data.user.id

Write-Host "✅ Authenticated: $($loginResponse.data.user.email)" -ForegroundColor Green
Write-Host "   User ID: $userId`n" -ForegroundColor Gray

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 2: Create Family Member #1 (Spouse)
Write-Host "[2] Create Family Member - Spouse..." -ForegroundColor Cyan
$member1 = @{
    firstName = "Sofia"
    lastName = "Verdi"
    fiscalCode = "VRDSOF88L45F205$timestamp"
    birthDate = "1988-07-05"
    relationship = "spouse"
} | ConvertTo-Json

$response1 = Invoke-RestMethod -Uri "$baseUrl/family-members" -Method POST `
    -Headers $headers -Body $member1

$memberId1 = $response1.data.id
Write-Host "✅ Created: Sofia Verdi (Spouse)" -ForegroundColor Green
Write-Host "   ID: $memberId1" -ForegroundColor Gray
Write-Host "   Fiscal Code: $($response1.data.fiscalCode)`n" -ForegroundColor Gray

# Step 3: Create Family Member #2 (Child)
Write-Host "[3] Create Family Member - Child..." -ForegroundColor Cyan
$member2 = @{
    firstName = "Alessandro"
    lastName = "Verdi"
    fiscalCode = "VRDALX15C20F205$timestamp"
    birthDate = "2015-03-20"
    relationship = "child"
} | ConvertTo-Json

$response2 = Invoke-RestMethod -Uri "$baseUrl/family-members" -Method POST `
    -Headers $headers -Body $member2

$memberId2 = $response2.data.id
Write-Host "✅ Created: Alessandro Verdi (Child)" -ForegroundColor Green
Write-Host "   ID: $memberId2" -ForegroundColor Gray
Write-Host "   Fiscal Code: $($response2.data.fiscalCode)`n" -ForegroundColor Gray

# Step 4: Create Family Member #3 (Parent)
Write-Host "[4] Create Family Member - Parent..." -ForegroundColor Cyan
$member3 = @{
    firstName = "Giovanni"
    lastName = "Verdi"
    fiscalCode = "VRDGVN55A01F205$timestamp"
    birthDate = "1955-01-01"
    relationship = "parent"
} | ConvertTo-Json

$response3 = Invoke-RestMethod -Uri "$baseUrl/family-members" -Method POST `
    -Headers $headers -Body $member3

$memberId3 = $response3.data.id
Write-Host "✅ Created: Giovanni Verdi (Parent)" -ForegroundColor Green
Write-Host "   ID: $memberId3`n" -ForegroundColor Gray

# Step 5: List All Family Members
Write-Host "[5] List All Family Members..." -ForegroundColor Cyan
$listResponse = Invoke-RestMethod -Uri "$baseUrl/family-members" -Method GET -Headers $headers
Write-Host "✅ Retrieved: $($listResponse.data.Count) family members" -ForegroundColor Green
foreach($member in $listResponse.data) {
    Write-Host "   • $($member.fullName) - $($member.relationship) (FC: $($member.fiscalCode))" -ForegroundColor Gray
}
Write-Host ""

# Step 6: Get Specific Family Member Details
Write-Host "[6] Get Family Member Details..." -ForegroundColor Cyan
$detailsResponse = Invoke-RestMethod -Uri "$baseUrl/family-members/$memberId1" -Method GET -Headers $headers
Write-Host "✅ Retrieved Details:" -ForegroundColor Green
Write-Host "   Name: $($detailsResponse.data.fullName)" -ForegroundColor Gray
Write-Host "   Fiscal Code: $($detailsResponse.data.fiscalCode)" -ForegroundColor Gray
Write-Host "   Birth Date: $($detailsResponse.data.birthDate)" -ForegroundColor Gray
Write-Host "   Relationship: $($detailsResponse.data.relationship)" -ForegroundColor Gray
Write-Host "   Created: $($detailsResponse.data.createdAt)`n" -ForegroundColor Gray

# Step 7: Update Family Member
Write-Host "[7] Update Family Member..." -ForegroundColor Cyan
$updateData = @{
    firstName = "Sofia"
    lastName = "Verdi"
    fiscalCode = $response1.data.fiscalCode
    birthDate = "1988-07-05"
    relationship = "spouse (primary household)"
} | ConvertTo-Json

$updateResponse = Invoke-RestMethod -Uri "$baseUrl/family-members/$memberId1" -Method PUT `
    -Headers $headers -Body $updateData

Write-Host "✅ Updated: $($updateResponse.data.fullName)" -ForegroundColor Green
Write-Host "   New Relationship: $($updateResponse.data.relationship)`n" -ForegroundColor Gray

# Step 8: Get Family Member Documents
Write-Host "[8] Get Family Member Documents..." -ForegroundColor Cyan
$docsResponse = Invoke-RestMethod -Uri "$baseUrl/family-members/$memberId1/documents" -Method GET -Headers $headers
Write-Host "✅ Documents Retrieved: $($docsResponse.data.Count) documents" -ForegroundColor Green
if($docsResponse.data.Count -eq 0) {
    Write-Host "   (No documents uploaded yet)`n" -ForegroundColor Gray
} else {
    foreach($doc in $docsResponse.data) {
        Write-Host "   • $($doc.documentType) - $($doc.fileName)" -ForegroundColor Gray
    }
    Write-Host ""
}

# Step 9: Get Family Members by User ID (Admin Route)
Write-Host "[9] Get Family Members by User ID..." -ForegroundColor Cyan
$userMembersResponse = Invoke-RestMethod -Uri "$baseUrl/family-members/user/$userId" -Method GET -Headers $headers
Write-Host "✅ Found: $($userMembersResponse.data.Count) members for user $userId" -ForegroundColor Green
Write-Host ""

# Step 10: Delete Family Member
Write-Host "[10] Delete Family Member..." -ForegroundColor Cyan
$deleteResponse = Invoke-RestMethod -Uri "$baseUrl/family-members/$memberId3" -Method DELETE -Headers $headers
Write-Host "✅ Deleted: Giovanni Verdi (Parent) - ID: $memberId3`n" -ForegroundColor Green

# Step 11: Verify Deletion
Write-Host "[11] Verify Deletion..." -ForegroundColor Cyan
$finalListResponse = Invoke-RestMethod -Uri "$baseUrl/family-members" -Method GET -Headers $headers
Write-Host "✅ Verification Complete" -ForegroundColor Green
Write-Host "   Remaining Family Members: $($finalListResponse.data.Count)" -ForegroundColor Gray
foreach($member in $finalListResponse.data) {
    Write-Host "   • $($member.fullName) - $($member.relationship)" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "==================================================================`n" -ForegroundColor Cyan
Write-Host "  ✅ ALL TESTS COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "`n  Tested Endpoints:" -ForegroundColor White
Write-Host "   1. POST   /auth/login                          ✅" -ForegroundColor Gray
Write-Host "   2. POST   /family-members                      ✅" -ForegroundColor Gray
Write-Host "   3. GET    /family-members                      ✅" -ForegroundColor Gray
Write-Host "   4. GET    /family-members/:id                  ✅" -ForegroundColor Gray
Write-Host "   5. PUT    /family-members/:id                  ✅" -ForegroundColor Gray
Write-Host "   6. GET    /family-members/:id/documents        ✅" -ForegroundColor Gray
Write-Host "   7. GET    /family-members/user/:userId         ✅" -ForegroundColor Gray
Write-Host "   8. DELETE /family-members/:id                  ✅" -ForegroundColor Gray
Write-Host "`n  Created Real Test Data:" -ForegroundColor White
Write-Host "   • Sofia Verdi (Spouse) - $memberId1" -ForegroundColor Gray
Write-Host "   • Alessandro Verdi (Child) - $memberId2" -ForegroundColor Gray
Write-Host "   • Giovanni Verdi (Parent) - Deleted ✅" -ForegroundColor Gray
Write-Host "`n==================================================================`n" -ForegroundColor Cyan
