import { create } from "zustand";
import { persist } from "zustand/middleware";
import { todayISO } from "@/lib/utils";

interface AppStore {
  // ── UI STATE ──────────────────────────────────────────────
  sidebarOpen: boolean;
  theme: "dark" | "light";

  // ── FILTER GLOBAL (persisten antar navigasi) ──────────────
  tanggalFilter: string; // "YYYY-MM-DD"
  divisiFilter: string; // divisi_id atau ''
  statusFilter: string; // status absensi atau ''

  // ── ACTIONS ───────────────────────────────────────────────
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;
  setTanggalFilter: (tanggal: string) => void;
  setDivisiFilter: (divisi: string) => void;
  setStatusFilter: (status: string) => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // ── DEFAULT STATE ──────────────────────────────────────
      sidebarOpen: true,
      theme: "dark",
      tanggalFilter: todayISO(),
      divisiFilter: "",
      statusFilter: "",

      // ── ACTIONS ────────────────────────────────────────────
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setTheme: (theme) => {
        set({ theme });
        // Terapkan ke DOM untuk Tailwind dark mode
        document.documentElement.classList.toggle("dark", theme === "dark");
      },

      setTanggalFilter: (tanggal) => set({ tanggalFilter: tanggal }),

      setDivisiFilter: (divisi) => set({ divisiFilter: divisi }),

      setStatusFilter: (status) => set({ statusFilter: status }),

      resetFilters: () =>
        set({
          tanggalFilter: todayISO(),
          divisiFilter: "",
          statusFilter: "",
        }),
    }),
    {
      name: "absen-app-store", // key di localStorage
      partialize: (state) => ({
        // hanya simpan preferensi user
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
