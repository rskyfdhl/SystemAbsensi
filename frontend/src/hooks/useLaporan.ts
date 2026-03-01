import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { laporanService } from "@/services/api";
import type { RekapBulanan, LaporanFilter } from "@/types";

export function useLaporan(filter: LaporanFilter) {
  const [data, setData] = useState<RekapBulanan[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!filter.tahun || !filter.bulan) return;
    try {
      setLoading(true);
      const res = await laporanService.getBulanan(filter);
      setData(res.data ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  }, [filter.tahun, filter.bulan, filter.divisi_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const exportExcel = async () => {
    try {
      setExporting(true);
      toast.loading("Membuat file Excel...", { id: "export" });
      await laporanService.exportExcel(filter);
      toast.success("File Excel berhasil diunduh", { id: "export" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal export Excel", {
        id: "export",
      });
    } finally {
      setExporting(false);
    }
  };

  return { data, loading, exporting, exportExcel, refetch: fetchData };
}
