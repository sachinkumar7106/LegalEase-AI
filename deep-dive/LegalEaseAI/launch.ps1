# LegalEase AI Launch Script

Write-Host "🚀 Starting LegalEase AI Platform Setup..." -ForegroundColor Cyan

# Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Node.js is not installed. Please install it from https://nodejs.org/" -ForegroundColor Red
    exit
}

# 1. Install Root (Frontend) Dependencies
Write-Host "`n📦 Checking Frontend dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "Installing frontend packages..." -ForegroundColor Gray
    npm install
} else {
    Write-Host "Frontend packages already installed." -ForegroundColor Gray
}

# 2. Install Server Dependencies
Write-Host "`n📦 Checking Backend dependencies..." -ForegroundColor Yellow
Push-Location server
if (!(Test-Path "node_modules")) {
    Write-Host "Installing backend packages..." -ForegroundColor Gray
    npm install
} else {
    Write-Host "Backend packages already installed." -ForegroundColor Gray
}
Pop-Location

# 3. Start Backend in a new window
Write-Host "`n📡 Starting Backend Server (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; node index.js" -WindowStyle Normal

# 4. Start Frontend
Write-Host "🖥️ Starting Frontend Development Server (Port 5173)..." -ForegroundColor Green
Write-Host "`n✨ Application will be available at http://localhost:5173" -ForegroundColor Cyan

# Give backend a moment to start
Start-Sleep -Seconds 2

# Open browser
Start-Process "http://localhost:5173"

# Start vite
npm run dev
