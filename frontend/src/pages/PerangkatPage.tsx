// ============================================================
//  src/pages/PerangkatPage.tsx
// ============================================================

import { useState } from "react";
import { usePerangkat } from "@/hooks/usePerangkat";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Plus,
  RefreshCw,
  Wifi,
  WifiOff,
  Trash2,
  MapPin,
  Clock,
  Cpu,
} from "lucide-react";
import { cn, formatTanggalPendek, formatJam } from "@/lib/utils";
import type { PerangkatFP, PerangkatFormData } from "@/types";

const EMPTY_FORM: PerangkatFormData = {
  nama: "",
  ip_address: "",
  port: 4370,
  merek: "ZKTeco",
  lokasi: "",
};

export default function PerangkatPage() {
  const {
    data,
    loading,
    syncing,
    tambahPerangkat,
    hapusPerangkat,
    syncPerangkat,
    testKoneksi,
  } = usePerangkat();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PerangkatFP | null>(null);
  const [form, setForm] = useState<PerangkatFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof PerangkatFormData, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const ok = await tambahPerangkat(form);
    if (ok) {
      setFormOpen(false);
      setForm(EMPTY_FORM);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Perangkat Fingerprint"
        subtitle="Kelola mesin absensi yang terhubung ke jaringan LAN"
        actions={[
          {
            label: "Daftarkan Perangkat",
            icon: Plus,
            onClick: () => {
              setForm(EMPTY_FORM);
              setFormOpen(true);
            },
          },
        ]}
      />

      {/* INFO BOX */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3 text-sm text-blue-400">
        <p className="font-semibold mb-1">
          💡 Cara menghubungkan mesin fingerprint
        </p>
        <p className="text-xs text-blue-400/70 leading-relaxed">
          Pastikan mesin dan server berada di subnet yang sama. Set IP statis di
          mesin (misal{" "}
          <code className="font-mono bg-blue-500/10 px-1 rounded">
            192.168.1.201
          </code>
          ), lalu daftarkan IP tersebut di sini. Port default ZKTeco adalah{" "}
          <code className="font-mono bg-blue-500/10 px-1 rounded">4370</code>.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Memuat perangkat..." />
      ) : data.length === 0 ? (
        <EmptyState
          icon="📡"
          title="Belum ada perangkat"
          description="Daftarkan mesin fingerprint pertama Anda."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((p) => (
            <PerangkatCard
              key={p.id}
              perangkat={p}
              isSyncing={syncing === p.id}
              onSync={() => syncPerangkat(p.id, p.nama)}
              onTest={() => testKoneksi(p.id)}
              onDelete={() => setDeleteTarget(p)}
            />
          ))}
        </div>
      )}

      {/* FORM DIALOG */}
      <Dialog open={formOpen} onOpenChange={(o) => !o && setFormOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Daftarkan Perangkat Fingerprint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Nama Perangkat *</Label>
              <Input
                placeholder="FP Lantai 1, FP Gudang..."
                value={form.nama}
                onChange={(e) => set("nama", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs">IP Address *</Label>
                <Input
                  placeholder="192.168.1.201"
                  value={form.ip_address}
                  onChange={(e) => set("ip_address", e.target.value)}
                  className="h-9 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Port</Label>
                <Input
                  type="number"
                  value={form.port}
                  onChange={(e) => set("port", Number(e.target.value))}
                  className="h-9 font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Merek</Label>
                <Input
                  placeholder="ZKTeco, Hikvision..."
                  value={form.merek}
                  onChange={(e) => set("merek", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Lokasi</Label>
                <Input
                  placeholder="Lobby, Lantai 2..."
                  value={form.lokasi}
                  onChange={(e) => set("lokasi", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.nama || !form.ip_address}
            >
              {saving ? "Mendaftarkan..." : "Daftarkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Perangkat?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.nama}</strong> ({deleteTarget?.ip_address})
              akan dihapus dari sistem. Data log yang sudah tersinkronisasi
              tetap aman.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) hapusPerangkat(deleteTarget.id);
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

// ── PERANGKAT CARD ────────────────────────────────────────────

interface PerangkatCardProps {
  perangkat: PerangkatFP;
  isSyncing: boolean;
  onSync: () => void;
  onTest: () => void;
  onDelete: () => void;
}

function PerangkatCard({
  perangkat: p,
  isSyncing,
  onSync,
  onTest,
  onDelete,
}: PerangkatCardProps) {
  const isOnline = p.aktif;

  return (
    <Card className="relative overflow-hidden">
      {/* Status indicator strip */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-0.5",
          isOnline ? "bg-emerald-500" : "bg-red-500"
        )}
      />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-muted-foreground shrink-0" />
            <CardTitle className="text-sm font-semibold">{p.nama}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] shrink-0",
              isOnline
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-red-500/10 text-red-500 border-red-500/20"
            )}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Info */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <code className="font-mono bg-muted px-2 py-0.5 rounded text-xs">
              {p.ip_address}:{p.port}
            </code>
            <span className="text-muted-foreground/50">·</span>
            <span>{p.merek}</span>
          </div>
          {p.lokasi && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {p.lokasi}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {p.terakhir_sync
              ? `Sync: ${formatTanggalPendek(p.terakhir_sync)} ${formatJam(
                  p.terakhir_sync
                )}`
              : "Belum pernah sync"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 gap-1.5 h-8 text-xs"
            onClick={onSync}
            disabled={isSyncing}
          >
            <RefreshCw className={cn("w-3 h-3", isSyncing && "animate-spin")} />
            {isSyncing ? "Sync..." : "Sync Data"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={onTest}
            disabled={isSyncing}
          >
            Test
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
