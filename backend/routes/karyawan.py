from flask import Blueprint, request
from database import query
from helpers import ok, err, require_fields

karyawan_bp = Blueprint("karyawan", __name__)


@karyawan_bp.route("/karyawan")
def list_karyawan():
    rows = query("""
        SELECT k.id, k.kode_karyawan, k.nama, k.jabatan,
               k.divisi_id, k.shift_id, k.fingerprint_uid,
               k.email, k.no_hp, k.aktif,
               d.nama AS nama_divisi,
               s.nama AS nama_shift
        FROM karyawan k
        LEFT JOIN divisi d ON k.divisi_id = d.id
        LEFT JOIN shift  s ON k.shift_id  = s.id
        WHERE k.aktif = 1
        ORDER BY k.nama
    """)
    return ok(rows)


@karyawan_bp.route("/karyawan/<int:kid>")
def get_karyawan(kid):
    row = query("""
        SELECT k.*, d.nama AS nama_divisi, s.nama AS nama_shift
        FROM karyawan k
        LEFT JOIN divisi d ON k.divisi_id = d.id
        LEFT JOIN shift  s ON k.shift_id  = s.id
        WHERE k.id = %s
    """, (kid,), fetchone=True)
    if not row:
        return err("Karyawan tidak ditemukan", 404)
    return ok(row)


@karyawan_bp.route("/karyawan", methods=["POST"])
def tambah_karyawan():
    d = request.get_json(silent=True) or {}
    valid, resp = require_fields(d, "kode_karyawan", "nama")
    if not valid:
        return resp

    new_id = query("""
        INSERT INTO karyawan
          (kode_karyawan, nama, jabatan, divisi_id, shift_id,
           fingerprint_uid, email, no_hp)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """, (d["kode_karyawan"], d["nama"], d.get("jabatan"),
          d.get("divisi_id") or None,
          d.get("shift_id") or None,
          d.get("fingerprint_uid") or None,
          d.get("email"), d.get("no_hp")),
         commit=True)
    return ok({"id": new_id}, msg="Karyawan berhasil ditambahkan", code=201)


@karyawan_bp.route("/karyawan/<int:kid>", methods=["PUT"])
def update_karyawan(kid):
    d = request.get_json(silent=True) or {}
    query("""
        UPDATE karyawan
        SET nama=%s, jabatan=%s, divisi_id=%s, shift_id=%s,
            fingerprint_uid=%s, email=%s, no_hp=%s
        WHERE id=%s
    """, (d.get("nama"), d.get("jabatan"),
          d.get("divisi_id") or None,
          d.get("shift_id") or None,
          d.get("fingerprint_uid") or None,
          d.get("email"), d.get("no_hp"), kid),
         commit=True)
    return ok(msg="Data karyawan diperbarui")


@karyawan_bp.route("/karyawan/<int:kid>", methods=["DELETE"])
def hapus_karyawan(kid):
    query("UPDATE karyawan SET aktif=0 WHERE id=%s", (kid,), commit=True)
    return ok(msg="Karyawan dinonaktifkan")