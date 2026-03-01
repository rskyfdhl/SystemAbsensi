@echo off
:: ============================================================
::  running.bat — Jalankan server Sistem Absensi
::  Klik dua kali untuk start server
:: ============================================================

title Sistem Absensi - Server
color 0A

echo.
echo  =====================================================
echo   SISTEM ABSENSI KARYAWAN - STARTING SERVER
echo  =====================================================
echo.

:: Cek apakah .env sudah dikonfigurasi
cd backend
if not exist .env (
    echo  [ERROR] File backend\.env tidak ditemukan!
    echo  Jalankan setup.bat terlebih dahulu
    echo.
    pause
    exit /b 1
)

:: Cek apakah venv sudah ada
if not exist venv\Scripts\activate.bat (
    echo  [ERROR] Virtual environment tidak ditemukan!
    echo  Jalankan setup.bat terlebih dahulu
    echo.
    pause
    exit /b 1
)

:: Aktifkan venv dan jalankan Flask
call venv\Scripts\activate.bat

echo  Mengecek koneksi database...
echo.
echo  Server berjalan di:
echo  ^> http://localhost:5000
echo  ^> http://[IP_KOMPUTER]:5000  (akses dari jaringan LAN)
echo.
echo  Tekan Ctrl+C untuk menghentikan server
echo  =====================================================
echo.

python app.py

:: Kalau Flask keluar/crash
echo.
echo  [INFO] Server berhenti.
pause