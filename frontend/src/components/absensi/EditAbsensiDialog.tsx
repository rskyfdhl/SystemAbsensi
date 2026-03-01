import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Absensi, AbsensiStatus } from "@/types";

interface EditAbsensiDialogProps {
  absensi: Absensi | null;
  onClose: () => void;
  onSave: (id: number, payload: Partial<Absensi>) => Promise<void>;
}

const STATUS_OPTIONS: { value: AbsensiStatus; label: string }[] = [
  { value: "hadir", label: "Hadir" },
  { value: "terlambat", label: "Terlambat" },
  { value: "absen", label: "Absen" },
  { value: "izin", label: "Izin" },
];

export function EditAbsensiDialog({
  absensi,
  onClose,
  onSave,
}: EditAbsensiDialogProps) {
  const [jamMasuk, setJamMasuk] = useState("");
  const [jamKeluar, setJamKeluar] = useState("");
  const [status, setStatus] = useState<AbsensiStatus>("hadir");
  const [catatan, setCatatan] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (absensi) {
      setJamMasuk(absensi.jam_masuk?.substring(11, 16) ?? "");
      setJamKeluar(absensi.jam_keluar?.substring(11, 16) ?? "");
      setStatus(absensi.status);
      setCatatan(absensi.catatan ?? "");
    }
  }, [absensi]);

  const handleSave = async () => {
    if (!absensi) return;
    setSaving(true);
    await onSave(absensi.id, {
      jam_masuk: jamMasuk ? `${absensi.tanggal}T${jamMasuk}:00` : null,
      jam_keluar: jamKeluar ? `${absensi.tanggal}T${jamKeluar}:00` : null,
      status,
      catatan,
    });
    setSaving(false);
  };

  return (
    <Dialog open={!!absensi} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Absensi Manual</DialogTitle>
        </DialogHeader>

        {absensi && (
          <div className="space-y-4 py-2">
            {/* Info karyawan */}
            <div className="bg-muted/40 rounded-lg px-4 py-3 text-sm">
              <p className="font-semibold">{absensi.nama}</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {absensi.divisi} — {absensi.tanggal}
              </p>
            </div>

            {/* Jam */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Jam Masuk</Label>
                <Input
                  type="time"
                  value={jamMasuk}
                  onChange={(e) => setJamMasuk(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Jam Keluar</Label>
                <Input
                  type="time"
                  value={jamKeluar}
                  onChange={(e) => setJamKeluar(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as AbsensiStatus)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Catatan */}
            <div className="space-y-1.5">
              <Label className="text-xs">Catatan</Label>
              <Textarea
                placeholder="Alasan perubahan data..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={2}
                className="resize-none text-sm"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
