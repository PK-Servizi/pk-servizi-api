# PK Servizi API - Deployment Script
# Usage: .\deploy.ps1
# Only uploads changed files to the server - never the full codebase

# Don't use "Stop" - it treats ssh/scp stderr as terminating errors in PS 5.1
$ErrorActionPreference = "Continue"

function Assert-ExitCode($stepName) {
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`nERROR: $stepName failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
}

$SERVER = "ubuntu@ec2-13-60-77-204.eu-north-1.compute.amazonaws.com"
$KEY = "D:\work\pk-servizi-key.pem"
$PROJECT_PATH = "d:\work\live_projects\pk-servizi-api"
$REMOTE_PATH = "~/pk-servizi-api"

Write-Host "Starting deployment..." -ForegroundColor Green

# Step 1: Pull latest code
Write-Host "`nPulling latest code..." -ForegroundColor Cyan
git pull origin main

# Step 2: Detect what changed (compare with last deployed commit)
$LAST_DEPLOYED_FILE = "$PROJECT_PATH\.last-deployed-commit"
$CURRENT_COMMIT = git rev-parse HEAD
$LAST_DEPLOYED = if (Test-Path $LAST_DEPLOYED_FILE) { Get-Content $LAST_DEPLOYED_FILE } else { "" }

if ($CURRENT_COMMIT -eq $LAST_DEPLOYED) {
    Write-Host "`nNo changes since last deployment. Nothing to do." -ForegroundColor Yellow
    exit 0
}

# Get list of changed files since last deploy
if ($LAST_DEPLOYED) {
    $CHANGED_FILES = git diff --name-only $LAST_DEPLOYED $CURRENT_COMMIT
} else {
    Write-Host "`nFirst deployment - will upload all tracked files." -ForegroundColor Yellow
    $CHANGED_FILES = git ls-files
}

Write-Host "`nChanged files ($($CHANGED_FILES.Count)):" -ForegroundColor Yellow
$CHANGED_FILES | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkGray }

# Categorize changes
$DEPS_CHANGED = $CHANGED_FILES | Where-Object { $_ -match "^package(-lock)?\.json$" }
$SRC_CHANGED = $CHANGED_FILES | Where-Object { $_ -match "^(src/|tsconfig)" }
$MIGRATION_FILES = $CHANGED_FILES | Where-Object { $_ -match "^migrations/" }
$SEED_FILES = $CHANGED_FILES | Where-Object { $_ -match "^seeds/" }
$OTHER_FILES = $CHANGED_FILES | Where-Object { $_ -notmatch "^(src/|tsconfig|package(-lock)?\.json$|migrations/|seeds/|node_modules/|dist/|\.git/|test/)" }

# Step 3: Build locally (only if source or deps changed)
if ($SRC_CHANGED -or $DEPS_CHANGED) {
    Write-Host "`nSource code changed - building project..." -ForegroundColor Cyan
    if (Test-Path "$PROJECT_PATH\dist") {
        Write-Host "  Cleaning dist/ folder..." -ForegroundColor DarkCyan
        Remove-Item -Recurse -Force "$PROJECT_PATH\dist"
    }
    npm run build
    Assert-ExitCode "Build"
} else {
    Write-Host "`nNo source changes - skipping build." -ForegroundColor Yellow
}

# Step 4: Upload ONLY changed files
Write-Host "`nUploading changed files to server..." -ForegroundColor Cyan

# 4a: dist/ as tar (compiled output, must be uploaded as a whole when source changes)
if ($SRC_CHANGED -or $DEPS_CHANGED) {
    Write-Host "  Uploading dist/ (tar+scp)..." -ForegroundColor DarkCyan
    $tarFile = "$PROJECT_PATH\dist.tar.gz"
    Push-Location "$PROJECT_PATH"
    tar -czf $tarFile dist
    Pop-Location
    scp -i $KEY $tarFile "${SERVER}:${REMOTE_PATH}/" 2>&1
    Assert-ExitCode "SCP dist.tar.gz"
    ssh -i $KEY $SERVER "cd $REMOTE_PATH && rm -rf dist && tar -xzf dist.tar.gz && rm dist.tar.gz" 2>&1
    Assert-ExitCode "Extract dist on server"
    Remove-Item -Force $tarFile
}

# 4b: package files
if ($DEPS_CHANGED) {
    Write-Host "  Uploading package.json & package-lock.json..." -ForegroundColor DarkCyan
    scp -i $KEY "$PROJECT_PATH\package.json" "$PROJECT_PATH\package-lock.json" "${SERVER}:${REMOTE_PATH}/" 2>&1
    Assert-ExitCode "SCP package files"
}

# 4c: Only the specific changed migration files
if ($MIGRATION_FILES) {
    Write-Host "  Uploading $($MIGRATION_FILES.Count) changed migration file(s)..." -ForegroundColor DarkCyan
    ssh -i $KEY $SERVER "mkdir -p $REMOTE_PATH/migrations" 2>&1
    foreach ($file in $MIGRATION_FILES) {
        $localFile = Join-Path $PROJECT_PATH ($file -replace '/', '\')
        if (Test-Path $localFile) {
            Write-Host "    $file" -ForegroundColor DarkGray
            scp -i $KEY $localFile "${SERVER}:${REMOTE_PATH}/${file}" 2>&1
        }
    }
    Assert-ExitCode "SCP migration files"
}

# 4d: Only the specific changed seed files
if ($SEED_FILES) {
    Write-Host "  Uploading $($SEED_FILES.Count) changed seed file(s)..." -ForegroundColor DarkCyan
    ssh -i $KEY $SERVER "mkdir -p $REMOTE_PATH/seeds" 2>&1
    foreach ($file in $SEED_FILES) {
        $localFile = Join-Path $PROJECT_PATH ($file -replace '/', '\')
        if (Test-Path $localFile) {
            Write-Host "    $file" -ForegroundColor DarkGray
            scp -i $KEY $localFile "${SERVER}:${REMOTE_PATH}/${file}" 2>&1
        }
    }
    Assert-ExitCode "SCP seed files"
}

# 4e: Other changed root files (Dockerfile, .env.example, nest-cli.json, etc.)
if ($OTHER_FILES) {
    Write-Host "  Uploading $($OTHER_FILES.Count) other changed file(s)..." -ForegroundColor DarkCyan
    foreach ($file in $OTHER_FILES) {
        $localFile = Join-Path $PROJECT_PATH ($file -replace '/', '\')
        if (Test-Path $localFile) {
            Write-Host "    $file" -ForegroundColor DarkGray
            scp -i $KEY $localFile "${SERVER}:${REMOTE_PATH}/${file}" 2>&1
        }
    }
}

# Step 5: Run remote commands based on what changed
Write-Host "`nRunning server-side commands..." -ForegroundColor Cyan

$remoteCommands = @("cd ${REMOTE_PATH}")

if ($DEPS_CHANGED) {
    Write-Host "  Dependencies changed - running npm install..." -ForegroundColor DarkCyan
    $remoteCommands += "npm install --omit=dev"
}

if ($MIGRATION_FILES) {
    Write-Host "  Migrations changed - running migrations..." -ForegroundColor DarkCyan
    $remoteCommands += "npm run migration:run"
}

$remoteCommands += "pm2 restart pk-servizi-api"
$remoteCommands += "pm2 list"

$sshCommand = $remoteCommands -join " ; "
ssh -i $KEY $SERVER $sshCommand 2>&1

# Step 6: Save deployed commit
$CURRENT_COMMIT | Set-Content $LAST_DEPLOYED_FILE
Write-Host "`nDeployment complete! Deployed commit: $($CURRENT_COMMIT.Substring(0,8))" -ForegroundColor Green
Write-Host "Check logs with: pm2 logs pk-servizi-api" -ForegroundColor Yellow

