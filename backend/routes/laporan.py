from flask import Blueprint, request, send_file
from database import query
from helpers import ok, err
from services.export import generate_excel
from datetime import date
import io

laporan_bp = Blueprint("laporan", __name__)

@laporan_bp.route("/laporan/bulanan")
def laporan_bulanan():
    tahun = request.args.get("tahun", date.today().year, type=int)
    bulan = request.args.get("bulan", date.today().month, type=int)
    divisi_id = request.args.get("divisi_id", type=int)
    sql = "SELECT * FROM v_rekap_bulanan WHERE tahun=%s AND bulan=%s"
    params = [tahun, bulan]
    if divisi_id:
        sql += " AND karyawan_id IN (SELECT id FROM karyawan WHERE divisi_id=%s)"
        params.append(divisi_id)
    return ok(query(sql, params))

@laporan_bp.route("/laporan/export/excel")
def export_excel():
    tahun = request.args.get("tahun", date.today().year, type=int)
    bulan = request.args.get("bulan", date.today().month, type=int)
    data = query("SELECT * FROM v_rekap_bulanan WHERE tahun=%s AND bulan=%s", [tahun, bulan])
    if not data: return err("Tidak ada data")
    excel_bytes = generate_excel(data, bulan, tahun)
    return send_file(io.BytesIO(excel_bytes),
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True, download_name=f"laporan-{tahun}-{str(bulan).zfill(2)}.xlsx")