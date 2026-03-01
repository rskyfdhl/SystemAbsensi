from flask import Blueprint, request
from database import query
from helpers import ok, err, require_fields
from services.fingerprint import FingerprintService

perangkat_bp = Blueprint("perangkat", __name__)

@perangkat_bp.route("/perangkat")
def list_perangkat():
    return ok(query("SELECT * FROM perangkat_fp ORDER BY id"))

@perangkat_bp.route("/perangkat", methods=["POST"])
def tambah_perangkat():
    d = request.get_json(silent=True) or {}
    valid, resp = require_fields(d, "nama", "ip_address")
    if not valid: return resp
    new_id = query("INSERT INTO perangkat_fp (nama,ip_address,port,merek,lokasi) VALUES (%s,%s,%s,%s,%s)",
        (d["nama"],d["ip_address"],d.get("port",4370),d.get("merek","ZKTeco"),d.get("lokasi","")), commit=True)
    return ok({"id": new_id}, msg="Perangkat didaftarkan", code=201)

@perangkat_bp.route("/perangkat/<int:pid>", methods=["DELETE"])
def hapus_perangkat(pid):
    query("DELETE FROM perangkat_fp WHERE id=%s", (pid,), commit=True)
    return ok(msg="Perangkat dihapus")

@perangkat_bp.route("/perangkat/<int:pid>/test", methods=["POST"])
def test_koneksi(pid):
    p = query("SELECT * FROM perangkat_fp WHERE id=%s", (pid,), fetchone=True)
    if not p: return err("Perangkat tidak ditemukan", 404)
    fp = FingerprintService(p["ip_address"], p["port"])
    success, msg = fp.test_connection()
    return ok(msg=msg) if success else err(msg, 503)