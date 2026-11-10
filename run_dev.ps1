# A.T.L.A.S. - 1-Click Dual Service Launcher (PowerShell)
# Launches both FastAPI Backend (port 8000) and React Vite Frontend (port 5173)

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  A.T.L.A.S. - Automated Terrain & Asset Assessment System" -ForegroundColor Cyan
Write-Host "  AI-Powered Property Valuation Engine (Pune & PCMC)" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green

$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = Join-Path $PSScriptRoot "frontend"

Write-Host "`n[1/2] Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload" -PassThru

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting React 19 Frontend on http://localhost:5173..." -ForegroundColor Yellow
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -PassThru

Write-Host "`n>>> Both services launched successfully!" -ForegroundColor Green
Write-Host "  * Frontend UI: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  * Backend API: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  * MCP Server:  python backend/mcp_server.py" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
