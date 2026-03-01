import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Divisi, Karyawan, KaryawanFormData, Shift } from "@/types";

interface KaryawanFormProps {
  open: boolean;
  karyawan: Karyawan | null;
  divisi: Divisi[];
  shifts: Shift[];
  onClose: () => void;
  onSave: (data: KaryawanFormData) => Promise<void>;
}

const EMPTY: KaryawanFormData = {
  kode_karyawan: "",
  nama: "",
  jabatan: "",
  divisi_id: undefined,
  shift_id: undefined,
  fingerprint_uid: undefined,
  email: "",
  no_hp: "",
  aktif: true,
};

export function KaryawanForm({
  open,
  karyawan,
  divisi,
  shifts,
  onClose,
  onSave,
}: KaryawanFormProps) {
  const [form, setForm] = useState<KaryawanFormData>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (karyawan) {
      setForm({
        kode_karyawan: karyawan.kode_karyawan,
        nama: karyawan.nama,
        jabatan: karyawan.jabatan ?? "",
        divisi_id: karyawan.divisi_id,
        shift_id: karyawan.shift_id,
        fingerprint_uid: karyawan.fingerprint_uid,
        email: karyawan.email ?? "",
        no_hp: karyawan.no_hp ?? "",
        aktif: karyawan.aktif,
      });
    } else {
      setForm(EMPTY);
    }
  }, [karyawan, open]);

  const set = (key: keyof KaryawanFormData, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {karyawan ? "Edit Karyawan" : "Tambah Karyawan Baru"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">ID Karyawan *</Label>
            <Input
              placeholder="KRY-001"
              value={form.kode_karyawan}
              onChange={(e) => set("kode_karyawan", e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Fingerprint UID</Label>
            <Input
              type="number"
              placeholder="ID di mesin FP"
              value={form.fingerprint_uid ?? ""}
              onChange={(e) =>
                set(
                  "fingerprint_uid",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="h-9"
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">Nama Lengkap *</Label>
            <Input
              placeholder="Nama karyawan"
              value={form.nama}
              onChange={(e) => set("nama", e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Jabatan</Label>
            <Input
              placeholder="Jabatan/posisi"
              value={form.jabatan ?? ""}
              onChange={(e) => set("jabatan", e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">No. HP</Label>
            <Input
              placeholder="08xx-xxxx-xxxx"
              value={form.no_hp ?? ""}
              onChange={(e) => set("no_hp", e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Divisi</Label>
            <Select
              value={form.divisi_id?.toString() ?? ""}
              onValueChange={(v) => set("divisi_id", Number(v))}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Pilih divisi" />
              </SelectTrigger>
              <SelectContent>
                {divisi.map((d) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {d.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Shift</Label>
            <Select
              value={form.shift_id?.toString() ?? ""}
              onValueChange={(v) => set("shift_id", Number(v))}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Pilih shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.nama} ({s.jam_masuk.substring(0, 5)}–
                    {s.jam_keluar.substring(0, 5)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input
              type="email"
              placeholder="email@perusahaan.com"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !form.nama || !form.kode_karyawan}
          >
            {saving
              ? "Menyimpan..."
              : karyawan
              ? "Simpan Perubahan"
              : "Tambah Karyawan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
