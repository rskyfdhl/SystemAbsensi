// ============================================================
//  src/pages/LaporanPage.tsx
// ============================================================

import { useState } from "react";
import { useLaporan } from "@/hooks/useLaporan";
import { useExport } from "@/hooks/useExport";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileSpreadsheet } from "lucide-react";
import { namaBulan, formatDurasi, formatPersen, cn } from "@/lib/utils";

// Generate daftar tahun
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 3 }, (_, i) => currentYear - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: namaBulan(i + 1),
}));

export default function LaporanPage() {
  const [tahun, setTahun] = useState(currentYear);
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);

  const { data, loading, exporting } = useLaporan({ tahun, bulan });
  const { exportRekapExcel } = useExport();

  // Summary stats
  const avgKehadiran = data.length
    ? data.reduce((s, r) => s + r.persen_kehadiran, 0) / data.length
    : 0;
  const totalTerlambat = data.reduce((s, r) => s + r.hari_terlambat, 0);
  const totalAbsen = data.reduce((s, r) => s + r.hari_absen, 0);

  const pctColor = (pct: number) => {
    if (pct >= 90) return "text-emerald-500";
    if (pct >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Laporan & Export"
        subtitle="Rekap absensi bulanan seluruh karyawan"
        actions={[
          {
            label: exporting ? "Mengunduh..." : "Export Excel",
            icon: Download,
            variant: "outline",
            onClick: () => exportRekapExcel(data, bulan, tahun),
          },
        ]}
      />

      {/* FILTER BAR */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={bulan.toString()}
          onValueChange={(v) => setBulan(Number(v))}
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value.toString()}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={tahun.toString()}
          onValueChange={(v) => setTahun(Number(v))}
        >
          <SelectTrigger className="h-9 w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-2">
          <FileSpreadsheet className="w-4 h-4" />
          Periode:{" "}
          <span className="font-medium text-foreground">
            {namaBulan(bulan)} {tahun}
          </span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      {data.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Rata-rata Kehadiran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={cn(
                  "text-3xl font-bold font-mono",
                  pctColor(avgKehadiran)
                )}
              >
                {formatPersen(avgKehadiran)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                dari {data.length} karyawan
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Total Keterlambatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono text-yellow-500">
                {totalTerlambat}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                kejadian terlambat
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Total Absen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-mono text-red-500">
                {totalAbsen}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                hari tidak hadir
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TABLE */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <LoadingSpinner text="Memuat laporan..." />
          ) : data.length === 0 ? (
            <EmptyState
              icon="📊"
              title="Tidak ada data laporan"
              description={`Belum ada data absensi untuk ${namaBulan(
                bulan
              )} ${tahun}.`}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Karyawan</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead className="text-center">Hari Kerja</TableHead>
                  <TableHead className="text-center">Hadir</TableHead>
                  <TableHead className="text-center">Terlambat</TableHead>
                  <TableHead className="text-center">Absen</TableHead>
                  <TableHead className="text-center">Izin</TableHead>
                  <TableHead>Total Jam</TableHead>
                  <TableHead className="text-center">% Hadir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={row.karyawan_id}>
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
                    <TableCell className="text-center font-mono text-sm">
                      {row.total_hari}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono text-sm text-emerald-500 font-semibold">
                        {row.hari_hadir}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono text-sm text-yellow-500">
                        {row.hari_terlambat || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono text-sm text-red-500">
                        {row.hari_absen || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono text-sm text-blue-500">
                        {row.hari_izin || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {formatDurasi(row.total_menit_kerja)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              row.persen_kehadiran >= 90
                                ? "bg-emerald-500"
                                : row.persen_kehadiran >= 75
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            )}
                            style={{ width: `${row.persen_kehadiran}%` }}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-xs font-mono font-semibold w-12",
                            pctColor(row.persen_kehadiran)
                          )}
                        >
                          {formatPersen(row.persen_kehadiran)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
