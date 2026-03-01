from flask import Blueprint
from database import query, query_many
from helpers import ok, err
from services.fingerprint import FingerprintService
from services.processor import proses_log_fp
import logging

sync_bp = Blueprint("sync", __name__)
log = logging.getLogger("sync")

@sync_bp.route("/sync/<int:perangkat_id>", methods=["POST"])
def sync_fingerprint(perangkat_id):
    p = query("SELECT * FROM perangkat_fp WHERE id=%s AND aktif=1", (perangkat_id,), fetchone=True)
    if not p: return err("Perangkat tidak ditemukan", 404)
    fp = FingerprintService(p["ip_address"], p["port"])
    success, attendances, msg = fp.get_attendance()
    if not success: return err(f"Gagal: {msg}", 503)
    new_records = 0
    if attendances:
        rows = [(perangkat_id, a.user_id, a.timestamp, a.punch) for a in attendances]
        new_records = query_many("INSERT IGNORE INTO log_fingerprint (perangkat_id,fingerprint_uid,waktu_tap,tipe) VALUES (%s,%s,%s,%s)", rows)
    query("UPDATE perangkat_fp SET terakhir_sync=NOW() WHERE id=%s", (perangkat_id,), commit=True)
    if new_records > 0: proses_log_fp()
    return ok({"total_dari_mesin": len(attendances) if attendances else 0, "record_baru": new_records})