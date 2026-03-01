from flask import Blueprint, request
from database import query
from helpers import ok, err
from datetime import date

absensi_bp = Blueprint("absensi", __name__)


@absensi_bp.route("/absensi")
def list_absensi():
    tanggal   = request.args.get("tanggal", date.today().isoformat())
    divisi_id = request.args.get("divisi_id")
    status    = request.args.get("status")
    nama      = request.args.get("nama")

    sql = """
        SELECT a.id, k.kode_karyawan, k.nama,
               d.nama AS divisi, s.nama AS shift,
               DATE_FORMAT(a.tanggal,'%Y-%m-%d') AS tanggal,
               a.jam_masuk, a.jam_keluar,
               a.total_menit, a.terlambat_menit,
               a.status, a.catatan, a.diinput_manual
        FROM absensi a
        JOIN karyawan k ON a.karyawan_id = k.id
        LEFT JOIN divisi d ON k.divisi_id = d.id
        LEFT JOIN shift  s ON k.shift_id  = s.id
        WHERE a.tanggal = %s
    """
    params = [tanggal]

    if divisi_id:
        sql += " AND k.divisi_id = %s"
        params.append(divisi_id)
    if status:
        sql += " AND a.status = %s"
        params.append(status)
    if nama:
        sql += " AND k.nama LIKE %s"
        params.append(f"%{nama}%")

    sql += " ORDER BY FIELD(a.status,'terlambat','hadir','izin','absen'), a.jam_masuk ASC"
    return ok(query(sql, params))


@absensi_bp.route("/absensi/<int:absensi_id>", methods=["PUT"])
def update_absensi(absensi_id):
    d = request.get_json(silent=True) or {}
    query("""
        UPDATE absensi
        SET jam_masuk=%s, jam_keluar=%s, status=%s,
            catatan=%s, diinput_manual=1
        WHERE id=%s
    """, (d.get("jam_masuk"), d.get("jam_keluar"),
          d.get("status"), d.get("catatan"), absensi_id),
         commit=True)
    return ok(msg="Absensi diperbarui")