@echo off
:: ============================================================
::  setup.bat — Setup otomatis Sistem Absensi di Windows
::  Jalankan sekali setelah clone dari GitHub
::  Klik kanan → "Run as administrator" TIDAK diperlukan
:: ============================================================

title Setup Sistem Absensi
color 0A
echo.
echo  =====================================================
echo   SETUP SISTEM ABSENSI KARYAWAN
echo  =====================================================
echo.

:: ── CEK PYTHON ───────────────────────────────────────────────
echo [1/6] Memeriksa Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Python tidak ditemukan!
    echo  Unduh dari: https://python.org/downloads
    echo  Centang "Add Python to PATH" saat instalasi
    echo.
    pause
    exit /b 1
)
python --version
echo  OK - Python ditemukan

:: ── CEK NODE.JS ──────────────────────────────────────────────
echo.
echo [2/6] Memeriksa Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Node.js tidak ditemukan!
    echo  Unduh dari: https://nodejs.org (pilih LTS)
    echo.
    pause
    exit /b 1
)
node --version
echo  OK - Node.js ditemukan

:: ── SETUP BACKEND ────────────────────────────────────────────
echo.
echo [3/6] Membuat virtual environment Python...
cd backend
if not exist venv (
    python -m venv venv
    echo  OK - Virtual environment dibuat
) else (
    echo  OK - Virtual environment sudah ada
)

echo.
echo [4/6] Menginstall library Python...
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo  [ERROR] Gagal install library Python
    pause
    exit /b 1
)
echo  OK - Library Python terinstall

:: ── BUAT .env BACKEND ─────────────────────────────────────────
if not exist .env (
    copy .env.example .env
    echo.
    echo  [PERHATIAN] File backend\.env telah dibuat dari template
    echo  Edit file backend\.env dan isi password MySQL Anda!
)
cd ..

:: ── SETUP FRONTEND ───────────────────────────────────────────
echo.
echo [5/6] Menginstall package Node.js (mungkin butuh beberapa menit)...
cd frontend
call npm install --silent
if %errorlevel% neq 0 (
    echo  [ERROR] Gagal npm install
    pause
    exit /b 1
)
echo  OK - Package Node.js terinstall

:: ── BUAT .env FRONTEND ────────────────────────────────────────
if not exist .env (
    echo VITE_API_URL=> .env
    echo VITE_APP_NAME=Sistem Absensi>> .env
    echo  OK - File frontend\.env dibuat
)
cd ..

:: ── BUILD FRONTEND ───────────────────────────────────────────
echo.
echo [6/6] Build frontend React...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo  [ERROR] Gagal build frontend
    pause
    exit /b 1
)
cd ..

echo.
echo  =====================================================
echo   SETUP SELESAI!
echo  =====================================================
echo.
echo  Langkah selanjutnya:
echo  1. Pastikan XAMPP MySQL sudah berjalan
echo  2. Import schema.sql ke phpMyAdmin
echo  3. Edit backend\.env - isi password MySQL
echo  4. Jalankan: jalankan.bat
echo.
pause