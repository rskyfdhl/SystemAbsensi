import logging
from datetime import datetime, timedelta
from database import get_conn
from mysql.connector import Error

log = logging.getLogger("processor")


def proses_log_fp() -> int:
    conn = get_conn()
    cur  = conn.cursor(dictionary=True)
    processed = 0

    try:
        cur.execute("""
            SELECT
                fingerprint_uid,
                DATE(waktu_tap)  AS tgl,
                MIN(waktu_tap)   AS jam_masuk,
                MAX(waktu_tap)   AS jam_keluar,
                GROUP_CONCAT(id) AS log_ids
            FROM log_fingerprint
            WHERE sudah_diproses = 0
            GROUP BY fingerprint_uid, DATE(waktu_tap)
        """)
        rows = cur.fetchall()
        log.info(f"Memproses {len(rows)} grup log")

        for row in rows:
            cur.execute(
                "SELECT id, shift_id FROM karyawan "
                "WHERE fingerprint_uid=%s AND aktif=1",
                (row["fingerprint_uid"],))
            karyawan = cur.fetchone()

            if not karyawan:
                log.warning(f"UID {row['fingerprint_uid']} tidak terdaftar")
                _tandai(cur, row["log_ids"])
                continue

            terlambat_menit = 0
            status = "hadir"

            if karyawan["shift_id"]:
                cur.execute(
                    "SELECT jam_masuk, toleransi_menit FROM shift WHERE id=%s",
                    (karyawan["shift_id"],))
                shift = cur.fetchone()
                if shift:
                    batas = datetime.combine(
                        row["tgl"],
                        shift["jam_masuk"]
                    ) + timedelta(minutes=shift["toleransi_menit"])

                    if row["jam_masuk"] > batas:
                        shift_dt = datetime.combine(row["tgl"], shift["jam_masuk"])
                        delta = row["jam_masuk"] - shift_dt
                        terlambat_menit = max(0, int(delta.total_seconds() / 60))
                        status = "terlambat"

            total_menit = 0
            if row["jam_keluar"] != row["jam_masuk"]:
                total_menit = int(
                    (row["jam_keluar"] - row["jam_masuk"]).total_seconds() / 60)

            cur.execute("""
                INSERT INTO absensi
                  (karyawan_id, tanggal, jam_masuk, jam_keluar,
                   total_menit, terlambat_menit, status)
                VALUES (%s,%s,%s,%s,%s,%s,%s)
                ON DUPLICATE KEY UPDATE
                  jam_masuk       = IF(diinput_manual=0, VALUES(jam_masuk),       jam_masuk),
                  jam_keluar      = IF(diinput_manual=0, VALUES(jam_keluar),      jam_keluar),
                  total_menit     = IF(diinput_manual=0, VALUES(total_menit),     total_menit),
                  terlambat_menit = IF(diinput_manual=0, VALUES(terlambat_menit), terlambat_menit),
                  status          = IF(diinput_manual=0, VALUES(status),          status)
            """, (karyawan["id"], row["tgl"],
                  row["jam_masuk"], row["jam_keluar"],
                  total_menit, terlambat_menit, status))

            _tandai(cur, row["log_ids"])
            processed += 1

        conn.commit()
        log.info(f"Selesai: {processed} absensi diproses")
        return processed

    except Error as e:
        conn.rollback()
        log.error(f"processor error: {e}")
        raise
    finally:
        cur.close()
        conn.close()


def _tandai(cur, log_ids_str: str) -> None:
    ids = log_ids_str.split(",")
    ph  = ",".join(["%s"] * len(ids))
    cur.execute(
        f"UPDATE log_fingerprint SET sudah_diproses=1 WHERE id IN ({ph})",
        ids)