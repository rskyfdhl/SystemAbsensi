import mysql.connector
from mysql.connector import pooling, Error
from config import Config
import logging

log = logging.getLogger("db")

_pool: pooling.MySQLConnectionPool | None = None


def init_pool() -> None:
    """Inisialisasi connection pool — dipanggil sekali saat app start."""
    global _pool
    try:
        _pool = pooling.MySQLConnectionPool(
            pool_name=Config.DB_POOL_NAME,
            pool_size=Config.DB_POOL_SIZE,
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            database=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            charset="utf8mb4",
            autocommit=False,
        )
        log.info(f"✓ Database pool siap ({Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME})")
    except Error as e:
        log.error(f"✗ Gagal membuat connection pool: {e}")
        raise


def get_conn():
    """Ambil koneksi dari pool."""
    if _pool is None:
        raise RuntimeError("Database pool belum diinisialisasi. Panggil init_pool() dulu.")
    return _pool.get_connection()


def query(sql: str, params=None, *, fetchone=False, commit=False):
    """
    Helper ringkas untuk eksekusi query.

    Args:
        sql     : SQL string dengan placeholder %s
        params  : tuple parameter
        fetchone: True → return dict | None, False → return list[dict]
        commit  : True → eksekusi INSERT/UPDATE/DELETE, return lastrowid

    Returns:
        list[dict] | dict | None | int (lastrowid)
    """
    conn = get_conn()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute(sql, params or ())
        if commit:
            conn.commit()
            return cur.lastrowid
        if fetchone:
            return cur.fetchone()
        return cur.fetchall()
    except Error as e:
        if commit:
            conn.rollback()
        log.error(f"Query error: {e}\nSQL: {sql}\nParams: {params}")
        raise
    finally:
        cur.close()
        conn.close()


def query_many(sql: str, params_list: list) -> int:
    """Eksekusi banyak baris sekaligus (batch insert). Return jumlah baris."""
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.executemany(sql, params_list)
        conn.commit()
        return cur.rowcount
    except Error as e:
        conn.rollback()
        log.error(f"Batch query error: {e}")
        raise
    finally:
        cur.close()
        conn.close()