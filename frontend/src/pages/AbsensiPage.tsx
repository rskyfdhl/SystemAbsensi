import { useState } from "react";
import { useAbsensi } from "@/hooks/useAbsensi";
import { useAppStore } from "@/store/useAppStore";
import { useExport } from "@/hooks/useExport";
import { useDebounce } from "@/hooks/useDebounce";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EditAbsensiDialog } from "@/components/absensi/EditAbsensiDialog";
import { AbsensiFilter } from "@/components/absensi/AbsensiFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Pencil } from "lucide-react";
import { formatJam, formatDurasi, formatTerlambat } from "@/lib/utils";
import type { Absensi, AbsensiStatus } from "@/types";

export default function AbsensiPage() {
  const { tanggalFilter, divisiFilter, statusFilter } = useAppStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [editTarget, setEditTarget] = useState<Absensi | null>(null);

  const { data, loading, updateAbsensi } = useAbsensi({
    tanggal: tanggalFilter,
    divisi_id: divisiFilter || undefined,
    status: (statusFilter as AbsensiStatus) || undefined,
    nama: debouncedSearch || undefined,
  });

  const { exportAbsensiExcel } = useExport();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Data Absensi"
        subtitle="Rekap harian dari mesin fingerprint"
        actions={[
          {
            label: "Export Excel",
            icon: Download,
            variant: "outline",
            onClick: () => exportAbsensiExcel(data, tanggalFilter),
          },
        ]}
      />

      {/* FILTER BAR */}
      <AbsensiFilter search={search} onSearchChange={setSearch} />

      {/* TABLE */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <LoadingSpinner text="Memuat data absensi..." />
          ) : data.length === 0 ? (
            <EmptyState
              title="Tidak ada data absensi"
              description="Belum ada data untuk filter yang dipilih."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Karyawan</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Jam Masuk</TableHead>
                  <TableHead>Jam Keluar</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Terlambat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-16">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{row.nama}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {row.kode_karyawan}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{row.divisi}</TableCell>
                    <TableCell className="text-sm">{row.shift}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatJam(row.jam_masuk)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatJam(row.jam_keluar)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDurasi(row.total_menit)}
                    </TableCell>
                    <TableCell className="text-sm text-yellow-500 font-mono">
                      {formatTerlambat(row.terlambat_menit)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditTarget(row)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <EditAbsensiDialog
        absensi={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={async (id, payload) => {
          await updateAbsensi(id, payload);
          setEditTarget(null);
        }}
      />
    </div>
  );
}
