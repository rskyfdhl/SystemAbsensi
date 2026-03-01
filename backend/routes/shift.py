from flask import Blueprint, request
from database import query
from helpers import ok, require_fields

shift_bp = Blueprint("shift", __name__)

@shift_bp.route("/shift")
def list_shift():
    rows = query("""
        SELECT s.*,
          (SELECT COUNT(*) FROM karyawan k WHERE k.shift_id=s.id AND k.aktif=1) AS karyawan_count
        FROM shift s WHERE s.aktif=1 ORDER BY s.jam_masuk
    """)
    return ok(rows)

@shift_bp.route("/shift", methods=["POST"])
def tambah_shift():
    d = request.get_json(silent=True) or {}
    valid, resp = require_fields(d, "nama", "jam_masuk", "jam_keluar")
    if not valid: return resp
    new_id = query("INSERT INTO shift (nama,jam_masuk,jam_keluar,toleransi_menit,hari_kerja) VALUES (%s,%s,%s,%s,%s)",
        (d["nama"],d["jam_masuk"],d["jam_keluar"],d.get("toleransi_menit",15),d.get("hari_kerja","Sen-Jum")), commit=True)
    return ok({"id": new_id}, msg="Shift ditambahkan", code=201)

@shift_bp.route("/shift/<int:sid>", methods=["PUT"])
def update_shift(sid):
    d = request.get_json(silent=True) or {}
    query("UPDATE shift SET nama=%s,jam_masuk=%s,jam_keluar=%s,toleransi_menit=%s,hari_kerja=%s WHERE id=%s",
        (d.get("nama"),d.get("jam_masuk"),d.get("jam_keluar"),d.get("toleransi_menit",15),d.get("hari_kerja"),sid), commit=True)
    return ok(msg="Shift diperbarui")

@shift_bp.route("/shift/<int:sid>", methods=["DELETE"])
def hapus_shift(sid):
    query("UPDATE shift SET aktif=0 WHERE id=%s", (sid,), commit=True)
    return ok(msg="Shift dihapus")