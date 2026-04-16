# .launch.ps1
# LegalEase AI: Full Stack Launcher
# This script installs all dependencies and starts both the frontend and backend.

$ErrorActionPreference = "Stop"

Clear-Host
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   LegalEase AI - All-in-One Launcher   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$rootPath = Get-Location
$frontendPath = Join-Path $rootPath "LegalEaseAI"
$backendPath = Join-Path $frontendPath "server"

# 1. Install Frontend/Main Dependencies
Write-Host "`n[1/3] Installing Frontend & Orchestration dependencies..." -ForegroundColor Yellow
if (Test-Path $frontendPath) {
    Push-Location $frontendPath
    npm install
    Pop-Location
} else {
    Write-Error "Frontend directory not found at $frontendPath"
    exit 1
}

# 2. Install Backend Dependencies
Write-Host "`n[2/3] Installing Backend dependencies..." -ForegroundColor Yellow
if (Test-Path $backendPath) {
    Push-Location $backendPath
    npm install
    Pop-Location
} else {
    Write-Error "Backend directory not found at $backendPath"
    exit 1
}

# 3. Launch App
Write-Host "`n[3/3] Launching Full Stack Application..." -ForegroundColor Green
Write-Host "Starting Vite (Frontend) and Node (Backend) concurrently..." -ForegroundColor Gray
Set-Location $frontendPath
npm start
