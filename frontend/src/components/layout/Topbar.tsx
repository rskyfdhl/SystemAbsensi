import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { perangkatService } from "@/services/api";
import { toast } from "sonner";
import { cn, getInisial, stringToColor } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Moon,
  Sun,
  RefreshCw,
  LogOut,
  KeyRound,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth";
import type { UserInfo } from "@/services/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const routeMeta: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Ringkasan kehadiran hari ini" },
  "/absensi": { title: "Data Absensi", subtitle: "Rekap harian fingerprint" },
  "/karyawan": { title: "Karyawan", subtitle: "Daftar & kelola karyawan" },
  "/shift": { title: "Manajemen Shift", subtitle: "Atur jadwal & toleransi" },
  "/perangkat": {
    title: "Perangkat FP",
    subtitle: "Mesin fingerprint terhubung",
  },
  "/laporan": {
    title: "Laporan & Export",
    subtitle: "Generate & unduh laporan",
  },
};

interface TopbarProps {
  user: UserInfo;
  onLogout: () => void;
}

export default function Topbar({ user, onLogout }: TopbarProps) {
  const location = useLocation();
  const { theme, setTheme } = useAppStore();
  const [clock, setClock] = useState(new Date());
  const [syncing, setSyncing] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const meta = routeMeta[location.pathname] ?? routeMeta["/"];

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleSyncAll = async () => {
    try {
      setSyncing(true);
      toast.loading("Menyinkronisasi semua perangkat...", { id: "sync-all" });
      const res = await perangkatService.getAll();
      const perangkats = res.data ?? [];
      if (!perangkats.length) {
        toast.warning("Tidak ada perangkat terdaftar", { id: "sync-all" });
        return;
      }
      let total = 0;
      for (const p of perangkats) {
        const r = await perangkatService.sync(p.id);
        total += r.data?.record_baru ?? 0;
      }
      toast.success(`Sync selesai — ${total} record baru`, { id: "sync-all" });
    } catch (e) {
      toast.error("Gagal sync", { id: "sync-all" });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
        {/* PAGE INFO */}
        <div>
          <h1 className="text-sm font-semibold leading-none">{meta.title}</h1>
          <p className="text-xs text-muted-foreground mt-1">{meta.subtitle}</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* Clock */}
          <div className="hidden sm:block text-right">
            <p className="text-xs font-mono text-muted-foreground">
              {format(clock, "EEEE, dd MMM yyyy", { locale: localeId })}
            </p>
            <p className="text-sm font-mono font-semibold tabular-nums">
              {format(clock, "HH:mm:ss")}
            </p>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark" ? "Mode terang" : "Mode gelap"}
            </TooltipContent>
          </Tooltip>

          {/* Sync button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                onClick={handleSyncAll}
                disabled={syncing}
                className="gap-2 h-8"
              >
                <RefreshCw
                  className={cn("w-3.5 h-3.5", syncing && "animate-spin")}
                />
                <span className="hidden sm:inline">
                  {syncing ? "Sync..." : "Sync FP"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Sinkronisasi semua mesin fingerprint
            </TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-border" />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 hover:bg-muted rounded-lg px-2 py-1.5 transition-colors">
                {/* Avatar */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center",
                    "text-white text-xs font-bold shrink-0",
                    stringToColor(user.nama)
                  )}
                >
                  {getInisial(user.nama)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-none">
                    {user.nama}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                    {user.role}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-normal">
                <p className="font-semibold text-sm">{user.nama}</p>
                <p className="text-xs text-muted-foreground">
                  @{user.username}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setChangePassOpen(true)}>
                <KeyRound className="w-3.5 h-3.5 mr-2" />
                Ganti Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* CHANGE PASSWORD DIALOG */}
      <ChangePasswordDialog
        open={changePassOpen}
        onClose={() => setChangePassOpen(false)}
      />
    </TooltipProvider>
  );
}

// ── CHANGE PASSWORD DIALOG ────────────────────────────────────

function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [lama, setLama] = useState("");
  const [baru, setBaru] = useState("");
  const [ulang, setUlang] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!lama || !baru || !ulang) {
      toast.error("Semua field wajib diisi");
      return;
    }
    if (baru !== ulang) {
      toast.error("Password baru tidak cocok");
      return;
    }
    if (baru.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    try {
      setSaving(true);
      await authService.changePassword(lama, baru);
      toast.success("Password berhasil diubah");
      setLama("");
      setBaru("");
      setUlang("");
      onClose();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg ?? "Gagal mengubah password";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Ganti Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Password Lama</Label>
            <Input
              type="password"
              value={lama}
              onChange={(e) => setLama(e.target.value)}
              className="h-9"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Password Baru</Label>
            <Input
              type="password"
              value={baru}
              onChange={(e) => setBaru(e.target.value)}
              className="h-9"
              placeholder="Minimal 6 karakter"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Ulangi Password Baru</Label>
            <Input
              type="password"
              value={ulang}
              onChange={(e) => setUlang(e.target.value)}
              className="h-9"
              placeholder="••••••••"
            />
          </div>
        </div>
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
