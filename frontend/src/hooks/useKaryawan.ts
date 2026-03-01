import { useState, useEffect, useCallback } from "react";
import { karyawanService, divisiService, shiftService } from "@/services/api";
import { toast } from "sonner";
import type { Karyawan, KaryawanFormData, Divisi, Shift } from "@/types";

export function useKaryawan() {
  const [data, setData] = useState<Karyawan[]>([]);
  const [divisi, setDivisi] = useState<Divisi[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [kRes, dRes, sRes] = await Promise.all([
        karyawanService.getAll(),
        divisiService.getAll(),
        shiftService.getAll(),
      ]);
      setData(kRes.data ?? []);
      setDivisi(dRes.data ?? []);
      setShifts(sRes.data ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal memuat data karyawan";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const tambahKaryawan = async (payload: KaryawanFormData) => {
    try {
      await karyawanService.create(payload);
      toast.success(`Karyawan ${payload.nama} berhasil ditambahkan`);
      fetchAll();
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menambah karyawan");
      return false;
    }
  };

  const updateKaryawan = async (
    id: number,
    payload: Partial<KaryawanFormData>
  ) => {
    try {
      await karyawanService.update(id, payload);
      toast.success("Data karyawan berhasil diperbarui");
      fetchAll();
      return true;
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Gagal memperbarui karyawan"
      );
      return false;
    }
  };

  const hapusKaryawan = async (id: number, nama: string) => {
    try {
      await karyawanService.delete(id);
      toast.success(`${nama} telah dinonaktifkan`);
      fetchAll();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Gagal menonaktifkan karyawan"
      );
    }
  };

  return {
    data,
    divisi,
    shifts,
    loading,
    error,
    tambahKaryawan,
    updateKaryawan,
    hapusKaryawan,
    refetch: fetchAll,
  };
}
