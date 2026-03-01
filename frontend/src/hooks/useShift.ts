import { useState, useEffect, useCallback } from "react";
import { shiftService } from "@/services/api";
import { toast } from "sonner";
import type { Shift } from "@/types";

export function useShift() {
  const [data, setData] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await shiftService.getAll();
      setData(res.data ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal memuat shift";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tambahShift = async (payload: import("@/types").ShiftFormData) => {
    try {
      await shiftService.create(payload);
      toast.success(`Shift ${payload.nama} berhasil ditambahkan`);
      fetchData();
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menambah shift");
      return false;
    }
  };

  const updateShift = async (
    id: number,
    payload: Partial<import("@/types").ShiftFormData>
  ) => {
    try {
      await shiftService.update(id, payload);
      toast.success("Shift berhasil diperbarui");
      fetchData();
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memperbarui shift");
      return false;
    }
  };

  const hapusShift = async (id: number) => {
    try {
      await shiftService.delete(id);
      toast.success("Shift dihapus");
      fetchData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus shift");
    }
  };

  return {
    data,
    loading,
    error,
    tambahShift,
    updateShift,
    hapusShift,
    refetch: fetchData,
  };
}
