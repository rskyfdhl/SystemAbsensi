// ============================================================
//  src/pages/ShiftPage.tsx
// ============================================================

import { useState } from "react";
import { useShift } from "@/hooks/useShift";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Clock, Pencil, Trash2, Users } from "lucide-react";
import type { Shift, ShiftFormData } from "@/types";

const HARI_OPTIONS = ["Sen-Jum", "Sen-Sab", "Sen-Min"];
const EMPTY_FORM: ShiftFormData = {
  nama: "",
  jam_masuk: "08:00",
  jam_keluar: "16:00",
  toleransi_menit: 15,
  hari_kerja: "Sen-Jum",
};

export default function ShiftPage() {
  const { data, loading, tambahShift, updateShift, hapusShift } = useShift();
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Shift | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Shift | null>(null);
  const [form, setForm] = useState<ShiftFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };
  const openEdit = (s: Shift) => {
    setEditTarget(s);
    setForm({
      nama: s.nama,
      jam_masuk: s.jam_masuk.substring(0, 5),
      jam_keluar: s.jam_keluar.substring(0, 5),
      toleransi_menit: s.toleransi_menit,
      hari_kerja: s.hari_kerja,
    });
    setFormOpen(true);
  };

  const set = (k: keyof ShiftFormData, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const ok = editTarget
      ? await updateShift(editTarget.id, form)
      : await tambahShift(form);
    if (ok) {
      setFormOpen(false);
      setEditTarget(null);
    }
    setSaving(false);
  };

  const SHIFT_COLORS = [
    "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Manajemen Shift"
        subtitle="Atur jadwal dan toleransi keterlambatan"
        actions={[{ label: "Tambah Shift", icon: Plus, onClick: openAdd }]}
      />

      {loading ? (
        <LoadingSpinner />
      ) : data.length === 0 ? (
        <EmptyState
          icon="🕐"
          title="Belum ada shift"
          description="Tambah shift kerja pertama."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((shift, i) => (
            <Card key={shift.id} className="relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 ${
                  SHIFT_COLORS[i % SHIFT_COLORS.length].split(" ")[0]
                }`}
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{shift.nama}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEdit(shift)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(shift)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-lg font-semibold">
                    {shift.jam_masuk.substring(0, 5)} –{" "}
                    {shift.jam_keluar.substring(0, 5)}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {shift.hari_kerja}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Toleransi: {shift.toleransi_menit} menit
                  </Badge>
                  {shift.karyawan_count !== undefined && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Users className="w-3 h-3" />
                      {shift.karyawan_count} karyawan
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* FORM DIALOG */}
      <Dialog open={formOpen} onOpenChange={(o) => !o && setFormOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editTarget ? "Edit Shift" : "Tambah Shift Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Nama Shift *</Label>
              <Input
                placeholder="Shift Pagi, Shift Malam..."
                value={form.nama}
                onChange={(e) => set("nama", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Jam Masuk *</Label>
                <Input
                  type="time"
                  value={form.jam_masuk}
                  onChange={(e) => set("jam_masuk", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Jam Keluar *</Label>
                <Input
                  type="time"
                  value={form.jam_keluar}
                  onChange={(e) => set("jam_keluar", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Toleransi (menit)</Label>
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={form.toleransi_menit}
                  onChange={(e) =>
                    set("toleransi_menit", Number(e.target.value))
                  }
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Hari Kerja</Label>
                <Select
                  value={form.hari_kerja}
                  onValueChange={(v) => set("hari_kerja", v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HARI_OPTIONS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.nama}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Shift?</AlertDialogTitle>
            <AlertDialogDescription>
              Shift <strong>{deleteTarget?.nama}</strong> akan dihapus. Karyawan
              yang terdaftar di shift ini perlu dipindah manual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) hapusShift(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
