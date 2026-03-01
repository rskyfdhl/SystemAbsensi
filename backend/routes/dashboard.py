from flask import Blueprint
from database import query
from helpers import ok
from datetime import date

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard")
def get_dashboard():
    today = date.today().isoformat()

    total = query("SELECT COUNT(*) AS n FROM karyawan WHERE aktif=1", fetchone=True)["n"]
    hadir = query(
        "SELECT COUNT(*) AS n FROM absensi WHERE tanggal=%s AND status IN ('hadir','terlambat')",
        (today,), fetchone=True)["n"]
    terlambat = query(
        "SELECT COUNT(*) AS n FROM absensi WHERE tanggal=%s AND status='terlambat'",
        (today,), fetchone=True)["n"]
    absen = query(
        "SELECT COUNT(*) AS n FROM absensi WHERE tanggal=%s AND status='absen'",
        (today,), fetchone=True)["n"]
    izin = query(
        "SELECT COUNT(*) AS n FROM absensi WHERE tanggal=%s AND status='izin'",
        (today,), fetchone=True)["n"]

    chart_7hari = query("""
        SELECT DATE_FORMAT(tanggal,'%Y-%m-%d') AS tanggal,
               SUM(status IN ('hadir','terlambat')) AS hadir,
               SUM(status='terlambat')              AS terlambat,
               SUM(status='absen')                  AS absen
        FROM absensi
        WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY tanggal ORDER BY tanggal
    """)

    absensi_terbaru = query("""
        SELECT k.nama, d.nama AS divisi, s.nama AS shift,
               a.jam_masuk, a.status
        FROM absensi a
        JOIN karyawan k ON a.karyawan_id = k.id
        LEFT JOIN divisi d ON k.divisi_id = d.id
        LEFT JOIN shift  s ON k.shift_id  = s.id
        WHERE a.tanggal = %s AND a.jam_masuk IS NOT NULL
        ORDER BY a.jam_masuk DESC LIMIT 10
    """, (today,))

    kehadiran_per_divisi = query("""
        SELECT d.nama AS divisi,
               SUM(a.status IN ('hadir','terlambat')) AS hadir,
               COUNT(k.id) AS total,
               ROUND(SUM(a.status IN ('hadir','terlambat')) / COUNT(k.id) * 100, 1) AS persen
        FROM karyawan k
        LEFT JOIN divisi d ON k.divisi_id = d.id
        LEFT JOIN absensi a ON a.karyawan_id = k.id AND a.tanggal = %s
        WHERE k.aktif = 1
        GROUP BY d.id, d.nama
        ORDER BY persen DESC
    """, (today,))

    return ok({
        "total_karyawan": total,
        "hadir": hadir,
        "terlambat": terlambat,
        "absen": absen,
        "izin": izin,
        "chart_7hari": chart_7hari,
        "absensi_terbaru": absensi_terbaru,
        "kehadiran_per_divisi": kehadiran_per_divisi,
    })