# Deploy Payment Fix to Live Server
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Deploying Payment Checkout Fix" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Commit changes
Write-Host "Step 1: Committing changes to Git..." -ForegroundColor Yellow
git add src/modules/services/entities/service.entity.ts
git add src/modules/service-requests/service-requests.service.ts
git add src/modules/payments/stripe.service.ts
git add src/modules/payments/payments.service.ts

git commit -m "Fix: Resolve TypeORM decimal string and float precision errors in Stripe payments

- Add column transformer to convert basePrice decimal to number
- Parse basePrice explicitly before Stripe calls
- Fix float precision when converting EUR to cents (19.99 * 100 = 1998.9999999999998)
- Use parseInt((amount * 100).toFixed(0), 10) instead of Math.round(amount * 100)
- Improves error messages to show actual Stripe error details"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git commit failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes committed" -ForegroundColor Green

# Step 2: Push to remote
Write-Host "`nStep 2: Pushing to origin main..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git push failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Pushed to remote" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Git Push Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next steps (run on your live server):" -ForegroundColor Yellow
Write-Host "  1. SSH into server: ssh ubuntu@your-server" -ForegroundColor White
Write-Host "  2. cd ~/pk-servizi-api" -ForegroundColor White
Write-Host "  3. git pull origin main" -ForegroundColor White
Write-Host "  4. npm install (if needed)" -ForegroundColor White
Write-Host "  5. pm2 restart pk-servizi-api" -ForegroundColor White
Write-Host "  6. pm2 logs pk-servizi-api --lines 50" -ForegroundColor White
Write-Host "`n"
