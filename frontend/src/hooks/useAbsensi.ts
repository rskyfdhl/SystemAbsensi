import { useState, useEffect, useCallback } from "react";
import { absensiService } from "@/services/api";
import { toast } from "sonner";
import type { Absensi, AbsensiFilter } from "@/types";

export function useAbsensi(filter?: AbsensiFilter) {
  const [data, setData] = useState<Absensi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await absensiService.getAll(filter);
      setData(res.data ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal memuat data absensi";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filter?.tanggal, filter?.divisi_id, filter?.status, filter?.nama]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateAbsensi = async (id: number, payload: Partial<Absensi>) => {
    try {
      await absensiService.update(id, payload);
      toast.success("Absensi berhasil diperbarui");
      fetchData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memperbarui absensi");
    }
  };

  return { data, loading, error, updateAbsensi, refetch: fetchData };
}
