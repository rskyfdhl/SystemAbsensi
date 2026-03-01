import { useState } from "react";
import { useKaryawan } from "@/hooks/useKaryawan";
import { useDebounce } from "@/hooks/useDebounce";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { KaryawanForm } from "@/components/karyawan/KaryawanForm";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Pencil, Trash2, Fingerprint } from "lucide-react";
import { getInisial, stringToColor, cn } from "@/lib/utils";
import type { Karyawan, KaryawanFormData } from "@/types";

export default function KaryawanPage() {
  const {
    data,
    divisi,
    shifts,
    loading,
    tambahKaryawan,
    updateKaryawan,
    hapusKaryawan,
  } = useKaryawan();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Karyawan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Karyawan | null>(null);

  const filtered = data.filter(
    (k) =>
      k.nama.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      k.kode_karyawan.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleSave = async (payload: KaryawanFormData) => {
    const ok = editTarget
      ? await updateKaryawan(editTarget.id, payload)
      : await tambahKaryawan(payload);
    if (ok) {
      setFormOpen(false);
      setEditTarget(null);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Karyawan"
        subtitle={`${data.length} karyawan aktif`}
        actions={[
          {
            label: "Tambah Karyawan",
            icon: Plus,
            onClick: () => {
              setEditTarget(null);
              setFormOpen(true);
            },
          },
        ]}
      />

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau ID karyawan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* TABLE */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <LoadingSpinner text="Memuat data karyawan..." />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="👥"
              title="Belum ada karyawan"
              description="Tambah karyawan pertama Anda."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Karyawan</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Fingerprint ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            "text-white text-xs font-bold shrink-0",
                            stringToColor(k.nama)
                          )}
                        >
                          {getInisial(k.nama)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{k.nama}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {k.kode_karyawan}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {k.nama_divisi ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {k.jabatan ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-mono">
                        {k.nama_shift ?? "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                        <Fingerprint className="w-3 h-3" />
                        {k.fingerprint_uid ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs">
                        Aktif
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setEditTarget(k);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(k)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* FORM DIALOG */}
      <KaryawanForm
        open={formOpen}
        karyawan={editTarget}
        divisi={divisi}
        shifts={shifts}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSave}
      />

      {/* DELETE CONFIRM */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan Karyawan?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.nama}</strong> akan dinonaktifkan dan tidak
              bisa absen. Data absensi sebelumnya tetap tersimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget)
                  hapusKaryawan(deleteTarget.id, deleteTarget.nama);
                setDeleteTarget(null);
              }}
            >
              Nonaktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
