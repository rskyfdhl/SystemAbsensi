import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { perangkatService } from "@/services/api";
import type { PerangkatFP, PerangkatFormData } from "@/types";

export function usePerangkat() {
  const [data, setData] = useState<PerangkatFP[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null); // perangkat_id yang sedang sync

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await perangkatService.getAll();
      setData(res.data ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memuat perangkat");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tambahPerangkat = async (payload: PerangkatFormData) => {
    try {
      await perangkatService.create(payload);
      toast.success(`Perangkat ${payload.nama} berhasil didaftarkan`);
      fetchData();
      return true;
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Gagal mendaftarkan perangkat"
      );
      return false;
    }
  };

  const hapusPerangkat = async (id: number) => {
    try {
      await perangkatService.delete(id);
      toast.success("Perangkat dihapus");
      fetchData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus perangkat");
    }
  };

  const syncPerangkat = async (id: number, nama: string) => {
    try {
      setSyncing(id);
      toast.loading(`Menyinkronisasi ${nama}...`, { id: `sync-${id}` });
      const res = await perangkatService.sync(id);
      const result = res.data;
      toast.success(`Sync berhasil — ${result?.record_baru ?? 0} record baru`, {
        id: `sync-${id}`,
      });
      fetchData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal sync perangkat", {
        id: `sync-${id}`,
      });
    } finally {
      setSyncing(null);
    }
  };

  const testKoneksi = async (id: number) => {
    try {
      toast.loading("Menguji koneksi...", { id: "test-conn" });
      await perangkatService.testKoneksi(id);
      toast.success("Koneksi berhasil!", { id: "test-conn" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Koneksi gagal", {
        id: "test-conn",
      });
    }
  };

  return {
    data,
    loading,
    syncing,
    tambahPerangkat,
    hapusPerangkat,
    syncPerangkat,
    testKoneksi,
    refetch: fetchData,
  };
}
