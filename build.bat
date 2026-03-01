@echo off
:: ============================================================
::  build.bat — Build ulang frontend setelah ada perubahan kode
:: ============================================================

title Build Frontend
color 0B

echo.
echo  Building frontend React...
echo.

cd frontend
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Build gagal! Periksa error di atas.
    pause
    exit /b 1
)

echo.
echo  =====================================================
echo   BUILD SELESAI! Frontend siap di backend/static/
echo  =====================================================
echo.
echo  Restart server (jalankan.bat) untuk melihat perubahan
echo.
pause