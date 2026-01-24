# Family Member Document Upload Test
# Tests document upload with actual file data

Write-Host "`n==================================================================" -ForegroundColor Cyan
Write-Host "  FAMILY MEMBER DOCUMENT UPLOAD TEST" -ForegroundColor Cyan
Write-Host "==================================================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api/v1"

# Step 1: Login
Write-Host "[STEP 1] Authenticating..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@pkservizi.com"
    password = "Admin@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $loginBody

$token = $loginResponse.data.accessToken
$userId = $loginResponse.data.user.id

Write-Host "✅ Authenticated as: $($loginResponse.data.user.email)" -ForegroundColor Green
Write-Host "   User ID: $userId`n" -ForegroundColor Gray

# Step 2: Create Family Member
Write-Host "[STEP 2] Creating Family Member..." -ForegroundColor Yellow

# Generate unique fiscal code with timestamp
$timestamp = (Get-Date).ToString("HHmmss")
$uniqueFiscalCode = "BNCLU195M15H$timestamp"

$memberData = @{
    firstName = "Luca"
    lastName = "Bianchi"
    fiscalCode = $uniqueFiscalCode
    birthDate = "1995-08-15"
    relationship = "brother"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $memberResponse = Invoke-RestMethod -Uri "$baseUrl/family-members" -Method POST `
        -Headers $headers -Body $memberData

    $memberId = $memberResponse.data.id
    Write-Host "✅ Created Family Member: Luca Bianchi" -ForegroundColor Green
    Write-Host "   Member ID: $memberId`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to create family member: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nCleaning up and exiting...`n" -ForegroundColor Yellow
    exit 1
}

# Step 3: Create Test Documents
Write-Host "[STEP 3] Creating Test Documents..." -ForegroundColor Yellow

$testDocs = @(
    @{ Name = "test-identity.pdf"; Type = "identityDocument"; Content = "PDF-like content for identity document" },
    @{ Name = "test-fiscal-code.jpg"; Type = "fiscalCode"; Content = "Image content for fiscal code card" },
    @{ Name = "test-birth-cert.pdf"; Type = "birthCertificate"; Content = "Birth certificate PDF content" }
)

foreach($doc in $testDocs) {
    $doc.Content | Out-File -FilePath $doc.Name -Encoding UTF8
    Write-Host "   Created: $($doc.Name) ($($doc.Type))" -ForegroundColor Gray
}
Write-Host ""

# Step 4: Upload Documents using curl (PowerShell multipart/form-data)
Write-Host "[STEP 4] Uploading Documents..." -ForegroundColor Yellow

foreach($doc in $testDocs) {
    try {
        Write-Host "`n   Uploading $($doc.Name) as $($doc.Type)..." -ForegroundColor Cyan
        
        # Use curl.exe for proper multipart/form-data upload
        # Note: The field name must match the document type (not "file")
        $curlCommand = "curl.exe -X POST ""$baseUrl/family-members/$memberId/documents"" " +
                      "-H ""Authorization: Bearer $token"" " +
                      "-F ""$($doc.Type)=@$($doc.Name)"" " +
                      "--silent"
        
        $uploadResult = Invoke-Expression $curlCommand | ConvertFrom-Json
        
        if($uploadResult.success) {
            Write-Host "   ✅ Uploaded successfully" -ForegroundColor Green
            Write-Host "      Document ID: $($uploadResult.data.id)" -ForegroundColor Gray
            Write-Host "      File Name: $($uploadResult.data.fileName)" -ForegroundColor Gray
            Write-Host "      S3 URL: $($uploadResult.data.s3Url)" -ForegroundColor Gray
        } else {
            Write-Host "   ❌ Upload failed: $($uploadResult.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ⚠️  Upload error: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "      Note: AWS S3 credentials may not be configured" -ForegroundColor Gray
    }
}

Write-Host ""

# Step 5: Verify Documents
Write-Host "[STEP 5] Verifying Uploaded Documents..." -ForegroundColor Yellow
try {
    $docsResponse = Invoke-RestMethod -Uri "$baseUrl/family-members/$memberId/documents" -Method GET `
        -Headers $headers

    $docCount = $docsResponse.data.Count
    Write-Host "✅ Found $docCount documents for family member" -ForegroundColor Green
    
    if($docCount -gt 0) {
        Write-Host "`n   Document List:" -ForegroundColor Cyan
        foreach($document in $docsResponse.data) {
            Write-Host "   • Type: $($document.documentType)" -ForegroundColor Gray
            Write-Host "     File: $($document.fileName)" -ForegroundColor Gray
            Write-Host "     Status: $($document.verificationStatus)" -ForegroundColor Gray
            Write-Host "     Uploaded: $($document.uploadedAt)" -ForegroundColor Gray
            Write-Host ""
        }
    } else {
        Write-Host "   ⚠️  No documents found (AWS S3 may not be configured)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to retrieve documents: $($_.Exception.Message)" -ForegroundColor Red
}

# Cleanup
Write-Host "[CLEANUP] Removing test files..." -ForegroundColor Yellow
foreach($doc in $testDocs) {
    Remove-Item $doc.Name -ErrorAction SilentlyContinue
    Write-Host "   Removed: $($doc.Name)" -ForegroundColor Gray
}

Write-Host "`n==================================================================`n" -ForegroundColor Cyan
Write-Host "TEST COMPLETE" -ForegroundColor Green
Write-Host "`nNote: If uploads failed, verify AWS S3 credentials in .env:" -ForegroundColor Yellow
Write-Host "  - AWS_ACCESS_KEY_ID" -ForegroundColor Gray
Write-Host "  - AWS_SECRET_ACCESS_KEY" -ForegroundColor Gray
Write-Host "  - AWS_S3_BUCKET_NAME" -ForegroundColor Gray
Write-Host "  - AWS_REGION`n" -ForegroundColor Gray
Write-Host "==================================================================`n" -ForegroundColor Cyan
