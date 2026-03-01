import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # ── DATABASE ─────────────────────────────────────────────
    DB_HOST     = os.getenv("DB_HOST", "localhost")
    DB_PORT     = int(os.getenv("DB_PORT", 3306))
    DB_NAME     = os.getenv("DB_NAME", "db_absensi")
    DB_USER     = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")

    # ── FLASK ─────────────────────────────────────────────────
    SECRET_KEY  = os.getenv("SECRET_KEY", "dev-secret-change-this")
    DEBUG       = os.getenv("FLASK_ENV", "production") == "development"

    # ── FINGERPRINT SYNC ─────────────────────────────────────
    FP_SYNC_INTERVAL = int(os.getenv("FP_SYNC_INTERVAL", 300))  # detik

    # ── DATABASE POOL ─────────────────────────────────────────
    DB_POOL_SIZE = int(os.getenv("DB_POOL_SIZE", 5))
    DB_POOL_NAME = "absen_pool"