import { useCallback } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import type { Absensi, RekapBulanan } from "@/types";
import {
  labelStatus,
  formatJam,
  formatDurasi,
  formatTerlambat,
} from "@/lib/utils";

export function useExport() {
  /**
   * Export data absensi harian ke Excel
   */
  const exportAbsensiExcel = useCallback((data: Absensi[], tanggal: string) => {
    const rows = data.map((row, i) => ({
      No: i + 1,
      "ID Karyawan": row.kode_karyawan,
      Nama: row.nama,
      Divisi: row.divisi,
      Shift: row.shift,
      "Jam Masuk": formatJam(row.jam_masuk),
      "Jam Keluar": formatJam(row.jam_keluar),
      "Total Jam": formatDurasi(row.total_menit),
      Keterlambatan: formatTerlambat(row.terlambat_menit),
      Status: labelStatus(row.status),
      Catatan: row.catatan ?? "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto column width
    const colWidths = [
      { wch: 4 },
      { wch: 12 },
      { wch: 25 },
      { wch: 18 },
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 14 },
      { wch: 12 },
      { wch: 20 },
    ];
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Absensi");

    const fileName = `absensi-${tanggal}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }, []);

  /**
   * Export rekap bulanan ke Excel
   */
  const exportRekapExcel = useCallback(
    (data: RekapBulanan[], bulan: number, tahun: number) => {
      const rows = data.map((row, i) => ({
        No: i + 1,
        ID: row.kode_karyawan,
        Nama: row.nama,
        Divisi: row.divisi,
        "Hari Kerja": row.total_hari,
        Hadir: row.hari_hadir,
        Terlambat: row.hari_terlambat,
        Absen: row.hari_absen,
        Izin: row.hari_izin,
        "Total Jam": formatDurasi(row.total_menit_kerja),
        "% Kehadiran": `${row.persen_kehadiran}%`,
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      ws["!cols"] = [
        { wch: 4 },
        { wch: 10 },
        { wch: 25 },
        { wch: 18 },
        { wch: 10 },
        { wch: 8 },
        { wch: 10 },
        { wch: 8 },
        { wch: 8 },
        { wch: 12 },
        { wch: 12 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Rekap Bulanan");

      const namaBulanStr = format(new Date(tahun, bulan - 1), "MMM-yyyy");
      XLSX.writeFile(wb, `rekap-absensi-${namaBulanStr}.xlsx`);
    },
    []
  );

  return { exportAbsensiExcel, exportRekapExcel };
}
