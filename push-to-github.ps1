#!/usr/bin/env pwsh
# =============================================================
# SCRIPT PUSH CNN QUIZ TRAINER KE GITHUB
# Jalankan di PowerShell (sebagai Administrator jika perlu)
# =============================================================

# ⬇️  GANTI nilai ini sesuai akun GitHub kamu
$GITHUB_USERNAME = "AldiAlfatih"
$REPO_NAME       = "kuis_viskom"
$REMOTE_URL      = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Folder root project (sesuaikan jika berbeda)
$PROJECT_ROOT = "d:\belajar_viskom\cnn-quiz"

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  CNN Quiz Trainer — Push ke GitHub" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Pindah ke root project
Set-Location $PROJECT_ROOT

# 1. Inisialisasi git (jika belum ada)
if (-Not (Test-Path ".git")) {
    Write-Host "[1/6] Inisialisasi git..." -ForegroundColor Yellow
    git init
    Write-Host "  ✓ Git diinisialisasi" -ForegroundColor Green
} else {
    Write-Host "[1/6] Git sudah ada, skip init." -ForegroundColor Gray
}

# 2. Konfigurasi branch utama ke 'main'
Write-Host "[2/6] Set branch default ke 'main'..." -ForegroundColor Yellow
git checkout -b main 2>$null
if ($LASTEXITCODE -ne 0) {
    git branch -M main
}
Write-Host "  ✓ Branch: main" -ForegroundColor Green

# 3. Set remote origin
Write-Host "[3/6] Set remote origin..." -ForegroundColor Yellow
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    git remote set-url origin $REMOTE_URL
    Write-Host "  ✓ Remote URL diperbarui: $REMOTE_URL" -ForegroundColor Green
} else {
    git remote add origin $REMOTE_URL
    Write-Host "  ✓ Remote ditambahkan: $REMOTE_URL" -ForegroundColor Green
}

# 4. Stage semua file
Write-Host "[4/6] Staging semua file..." -ForegroundColor Yellow
git add -A
Write-Host "  ✓ Semua file di-stage" -ForegroundColor Green

# 5. Commit
Write-Host "[5/6] Commit..." -ForegroundColor Yellow
$commitMsg = "feat: CNN Quiz Trainer - initial complete frontend

- Halaman: login (NIM + password SHA-256), home, setup, quiz, result, history
- Bank soal 60 soal CNN (convolution, ReLU, pooling, feature map, softmax, arsitektur)
- Multi-user per NIM, riwayat append-only, statistik per kategori
- Komponen: MatrixInput (keyboard nav), MatrixDisplay
- Design system vanilla CSS (Inter + JetBrains Mono)"

git commit -m $commitMsg
Write-Host "  ✓ Commit berhasil" -ForegroundColor Green

# 6. Push ke GitHub (force — mengganti semua isi repo)
Write-Host "[6/6] Push ke GitHub ($REMOTE_URL)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  ⚠ Ini akan MENGGANTI SEMUA ISI REPO lama dengan project ini." -ForegroundColor Red
Write-Host "  Tekan ENTER untuk lanjut, atau Ctrl+C untuk batal." -ForegroundColor Red
Read-Host

git push --force-with-lease origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=====================================================" -ForegroundColor Green
    Write-Host "  ✅ BERHASIL! Project sudah di GitHub:" -ForegroundColor Green
    Write-Host "  https://github.com/$GITHUB_USERNAME/$REPO_NAME" -ForegroundColor Cyan
    Write-Host "=====================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "=====================================================" -ForegroundColor Red
    Write-Host "  ❌ Push gagal. Kemungkinan penyebab:" -ForegroundColor Red
    Write-Host "  1. Belum login GitHub di terminal" -ForegroundColor Yellow
    Write-Host "     Solusi: jalankan 'git config --global credential.helper manager'" -ForegroundColor White
    Write-Host "  2. Repo belum dibuat di GitHub" -ForegroundColor Yellow
    Write-Host "     Solusi: buat repo baru di https://github.com/new" -ForegroundColor White
    Write-Host "  3. Tidak ada koneksi internet" -ForegroundColor Yellow
    Write-Host "=====================================================" -ForegroundColor Red
}
