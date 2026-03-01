# 🖐 Sistem Absensi Karyawan

Sistem absensi karyawan berbasis **fingerprint** dengan dashboard real-time, manajemen karyawan, laporan bulanan, dan export Excel.

![Dashboard Preview](docs/preview.png)

---

## ✨ Fitur

| Fitur                        | Keterangan                                                      |
| ---------------------------- | --------------------------------------------------------------- |
| 📊 **Dashboard**             | Statistik kehadiran real-time, grafik 7 hari, status per divisi |
| 👆 **Integrasi Fingerprint** | Sync otomatis dari mesin ZKTeco via jaringan LAN                |
| 👥 **Manajemen Karyawan**    | Tambah, edit, nonaktifkan karyawan + assign shift               |
| 🕐 **Manajemen Shift**       | Buat shift dengan jam & toleransi keterlambatan                 |
| 📡 **Perangkat FP**          | Daftarkan beberapa mesin fingerprint, test koneksi              |
| 📋 **Data Absensi**          | Tabel harian dengan filter, edit manual, export Excel           |
| 📈 **Laporan Bulanan**       | Rekap per karyawan + export Excel berformat rapi                |
| 🔐 **Login & Auth**          | Session-based auth, ganti password, role admin                  |
| 🌙 **Dark / Light Mode**     | Tema gelap dan terang                                           |

---

## 🛠️ Tech Stack

**Frontend**

- React 18 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui
- Zustand (state), Recharts (grafik), date-fns

**Backend**

- Python 3.10+ + Flask
- MySQL (via XAMPP)
- pyzk (komunikasi mesin fingerprint ZKTeco)

---

## 📋 Persyaratan Sistem

Sebelum memulai, pastikan sudah terinstall:

| Software    | Versi                  | Link Download                                      |
| ----------- | ---------------------- | -------------------------------------------------- |
| **Python**  | 3.10 atau lebih baru   | [python.org](https://python.org/downloads)         |
| **Node.js** | 18 LTS atau lebih baru | [nodejs.org](https://nodejs.org)                   |
| **XAMPP**   | Versi terbaru          | [apachefriends.org](https://www.apachefriends.org) |
| **Git**     | Versi terbaru          | [git-scm.com](https://git-scm.com)                 |

> ⚠️ Saat install Python, **centang "Add Python to PATH"**

---

## 🚀 Cara Setup (Windows)

### Langkah 1 — Clone Repository

Buka **Command Prompt** atau **PowerShell**, lalu jalankan:

```bash
git clone https://github.com/USERNAME/absensi-system.git
cd absensi-system
```

### Langkah 2 — Jalankan Setup Otomatis

Klik dua kali file **`setup.bat`** di folder project.

Script ini akan otomatis:

- ✅ Membuat virtual environment Python
- ✅ Menginstall semua library Python
- ✅ Menginstall package Node.js
- ✅ Build frontend React
- ✅ Membuat file `.env` dari template

> Proses setup membutuhkan koneksi internet dan sekitar 5–10 menit.

### Langkah 3 — Setup Database

1. Buka **XAMPP Control Panel**, klik **Start** pada MySQL
2. Buka browser → `http://localhost/phpmyadmin`
3. Klik tab **Import** di menu atas
4. Klik **Choose File** → pilih file `schema.sql` di root project
5. Klik **Go** / **Import**
6. Pastikan muncul pesan sukses dan database `db_absensi` terbuat

### Langkah 4 — Konfigurasi Environment

Buka file **`backend/.env`** dengan Notepad, isi sesuai konfigurasi:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=db_absensi
DB_USER=root
DB_PASSWORD=

FLASK_ENV=development
SECRET_KEY=
FP_SYNC_INTERVAL=300
```

> Untuk generate SECRET_KEY, buka CMD dan jalankan:
>
> ```bash
> python -c "import secrets; print(secrets.token_hex(32))"
> ```

### Langkah 5 — Jalankan Server

Klik dua kali file **`jalankan.bat`**.

Server berjalan di:

- **Lokal:** `http://localhost:5000`
- **LAN:** `http://[IP_KOMPUTER]:5000`

---

## 🔑 Login Default

| Field    | Value      |
| -------- | ---------- |
| Username | `admin`    |
| Password | `admin123` |

> ⚠️ **Segera ganti password** setelah login pertama melalui menu dropdown di pojok kanan atas!

---

## 🖥️ Struktur Project

```
absensi-system/
│
├── 📄 README.md
├── 📄 schema.sql          ← Script pembuatan database
├── 📄 setup.bat           ← Setup otomatis (jalankan sekali)
├── 📄 jalankan.bat        ← Start server sehari-hari
├── 📄 build.bat           ← Build ulang frontend
├── 📄 .gitignore
│
├── 📁 backend/            ← Flask API Server
│   ├── app.py             ← Entry point
│   ├── config.py          ← Konfigurasi
│   ├── database.py        ← Koneksi MySQL
│   ├── helpers.py         ← Response helpers
│   ├── middleware.py      ← Auth decorator
│   ├── requirements.txt   ← Library Python
│   ├── .env.example       ← Template konfigurasi
│   ├── routes/            ← API endpoints
│   │   ├── auth.py        ← Login/logout
│   │   ├── dashboard.py   ← Statistik
│   │   ├── absensi.py     ← Data absensi
│   │   ├── karyawan.py    ← CRUD karyawan
│   │   ├── shift.py       ← CRUD shift
│   │   ├── divisi.py      ← Data divisi
│   │   ├── perangkat.py   ← Mesin fingerprint
│   │   ├── sync.py        ← Sync dari mesin FP
│   │   └── laporan.py     ← Laporan & export
│   └── services/
│       ├── fingerprint.py ← Koneksi ZKTeco
│       ├── processor.py   ← Proses log → absensi
│       ├── export.py      ← Generate Excel
│       └── autosync.py    ← Background sync
│
└── 📁 frontend/           ← React Application
    ├── src/
    │   ├── pages/         ← Halaman utama
    │   ├── components/    ← Komponen UI
    │   ├── hooks/         ← Custom React hooks
    │   ├── services/      ← API calls
    │   ├── store/         ← Zustand state
    │   ├── types/         ← TypeScript types
    │   └── lib/           ← Utilities
    └── vite.config.ts
```

---

## 📡 Setup Mesin Fingerprint (ZKTeco)

### Syarat

- Mesin dan komputer server harus **satu jaringan LAN**
- Mesin harus memiliki **IP statis**

### Langkah

1. Set IP statis di mesin fingerprint (misal: `192.168.1.201`)
2. Pastikan bisa di-ping: `ping 192.168.1.201`
3. Buka sistem → halaman **Perangkat FP**
4. Klik **Daftarkan Perangkat** → isi nama, IP, port (default: `4370`)
5. Klik **Test** untuk verifikasi koneksi
6. Klik **Sync Data** untuk tarik data pertama kali

> Sistem akan otomatis sync setiap **5 menit** selama server berjalan.

---

## 🔄 Workflow Absensi

```
Karyawan tap di mesin FP
        ↓
Log tersimpan di mesin
        ↓
Server sync setiap 5 menit (atau manual)
        ↓
Log masuk ke tabel log_fingerprint
        ↓
Processor menghitung jam masuk, keluar, keterlambatan
        ↓
Data tampil di Dashboard & halaman Absensi
```

---

## 🔧 Perintah Berguna

### Development (tanpa build)

```bash
# Terminal 1 — jalankan backend
cd backend
venv\Scripts\activate
python app.py

# Terminal 2 — jalankan frontend dev server
cd frontend
npm run dev
```

Akses di `http://localhost:5173`

### Build untuk production

```bash
# Klik dua kali build.bat
# atau manual:
cd frontend
npm run build
```

### Reset password admin lewat MySQL

```sql
-- Password baru: admin123
UPDATE user_admin
SET password = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCMRlwBfyBam2LSEQ13ZGTS'
WHERE username = 'admin';
```

---

## ❓ Troubleshooting

### Server tidak bisa start

- Pastikan XAMPP MySQL sudah **Running**
- Cek password di `backend/.env` sudah benar
- Pastikan port 5000 tidak dipakai aplikasi lain

### API 404 (data tidak muncul)

- Pastikan `src/services/api.ts` menggunakan `baseURL: "/api"` (pakai `||` bukan `??`)
- Build ulang frontend: klik `build.bat`

### Mesin fingerprint tidak bisa terhubung

- Pastikan IP mesin bisa di-ping dari server
- Pastikan port 4370 tidak diblokir firewall Windows
- Coba matikan Windows Defender Firewall sementara untuk test

### `npm run build` error TypeScript

- Hapus import yang tidak terpakai (ditandai garis merah di VS Code)
- Jalankan `cd frontend && npm run build` untuk melihat error detail

---

## 🚀 Jalankan Otomatis saat Windows Startup

1. Buat shortcut dari file `jalankan.bat`
2. Tekan `Win + R` → ketik `shell:startup` → Enter
3. Pindahkan shortcut ke folder yang terbuka
4. Server akan otomatis start setiap Windows dinyalakan

---

## 📝 Lisensi

MIT License — bebas digunakan dan dimodifikasi.

---

## 👤 Kontak

Dibuat dengan ❤️ menggunakan React + Flask + MySQL
