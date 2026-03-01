import axios from "axios";
import type {
  ApiResponse,
  DashboardStats,
  Absensi,
  AbsensiFilter,
  Karyawan,
  KaryawanFormData,
  Shift,
  ShiftFormData,
  Divisi,
  PerangkatFP,
  PerangkatFormData,
  RekapBulanan,
  LaporanKaryawan,
  LaporanFilter,
  SyncResult,
} from "@/types";

// ── BASE CLIENT ───────────────────────────────────────────────

const api = axios.create({
  // Di development: Vite proxy otomatis forward /api → localhost:5000
  // Di production: sesuaikan dengan IP server LAN
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor — unwrap data.data, handle error global
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.msg ??
      error.message ??
      "Terjadi kesalahan, coba lagi";

    // Kalau error 401 di masa depan bisa redirect ke login di sini
    return Promise.reject(new Error(message));
  }
);

export default api;

// ── DASHBOARD SERVICE ─────────────────────────────────────────

export const dashboardService = {
  /**
   * Ambil semua statistik untuk halaman dashboard
   * GET /api/dashboard
   */
  getStats: () => api.get<unknown, ApiResponse<DashboardStats>>("/dashboard"),
};

// ── ABSENSI SERVICE ───────────────────────────────────────────

export const absensiService = {
  /**
   * Daftar absensi dengan filter opsional
   * GET /api/absensi?tanggal=&divisi_id=&status=&nama=
   */
  getAll: (filter?: AbsensiFilter) =>
    api.get<unknown, ApiResponse<Absensi[]>>("/absensi", {
      params: filter,
    }),

  /**
   * Update absensi manual oleh admin
   * PUT /api/absensi/:id
   */
  update: (id: number, data: Partial<Absensi>) =>
    api.put<unknown, ApiResponse>(`/absensi/${id}`, data),
};

// ── KARYAWAN SERVICE ──────────────────────────────────────────

export const karyawanService = {
  /**
   * Daftar semua karyawan aktif
   * GET /api/karyawan
   */
  getAll: () => api.get<unknown, ApiResponse<Karyawan[]>>("/karyawan"),

  /**
   * Detail satu karyawan
   * GET /api/karyawan/:id
   */
  getById: (id: number) =>
    api.get<unknown, ApiResponse<Karyawan>>(`/karyawan/${id}`),

  /**
   * Tambah karyawan baru
   * POST /api/karyawan
   */
  create: (data: KaryawanFormData) =>
    api.post<unknown, ApiResponse<{ id: number }>>("/karyawan", data),

  /**
   * Update data karyawan
   * PUT /api/karyawan/:id
   */
  update: (id: number, data: Partial<KaryawanFormData>) =>
    api.put<unknown, ApiResponse>(`/karyawan/${id}`, data),

  /**
   * Nonaktifkan karyawan (soft delete)
   * DELETE /api/karyawan/:id
   */
  delete: (id: number) => api.delete<unknown, ApiResponse>(`/karyawan/${id}`),
};

// ── SHIFT SERVICE ─────────────────────────────────────────────

export const shiftService = {
  /**
   * Daftar semua shift aktif
   * GET /api/shift
   */
  getAll: () => api.get<unknown, ApiResponse<Shift[]>>("/shift"),

  /**
   * Tambah shift baru
   * POST /api/shift
   */
  create: (data: ShiftFormData) =>
    api.post<unknown, ApiResponse<{ id: number }>>("/shift", data),

  /**
   * Update shift
   * PUT /api/shift/:id
   */
  update: (id: number, data: Partial<ShiftFormData>) =>
    api.put<unknown, ApiResponse>(`/shift/${id}`, data),

  /**
   * Hapus shift
   * DELETE /api/shift/:id
   */
  delete: (id: number) => api.delete<unknown, ApiResponse>(`/shift/${id}`),
};

// ── DIVISI SERVICE ────────────────────────────────────────────

export const divisiService = {
  /**
   * Daftar semua divisi
   * GET /api/divisi
   */
  getAll: () => api.get<unknown, ApiResponse<Divisi[]>>("/divisi"),
};

// ── PERANGKAT SERVICE ─────────────────────────────────────────

export const perangkatService = {
  /**
   * Daftar semua perangkat fingerprint
   * GET /api/perangkat
   */
  getAll: () => api.get<unknown, ApiResponse<PerangkatFP[]>>("/perangkat"),

  /**
   * Daftarkan perangkat baru
   * POST /api/perangkat
   */
  create: (data: PerangkatFormData) =>
    api.post<unknown, ApiResponse<{ id: number }>>("/perangkat", data),

  /**
   * Hapus perangkat
   * DELETE /api/perangkat/:id
   */
  delete: (id: number) => api.delete<unknown, ApiResponse>(`/perangkat/${id}`),

  /**
   * Trigger sync data dari mesin fingerprint
   * POST /api/sync/:perangkat_id
   */
  sync: (perangkatId: number) =>
    api.post<unknown, ApiResponse<SyncResult>>(`/sync/${perangkatId}`),

  /**
   * Test koneksi ke mesin (ping)
   * POST /api/perangkat/:id/test
   */
  testKoneksi: (id: number) =>
    api.post<unknown, ApiResponse>(`/perangkat/${id}/test`),
};

// ── LAPORAN SERVICE ───────────────────────────────────────────

export const laporanService = {
  /**
   * Rekap absensi bulanan semua karyawan
   * GET /api/laporan/bulanan?tahun=&bulan=&divisi_id=
   */
  getBulanan: (filter: LaporanFilter) =>
    api.get<unknown, ApiResponse<RekapBulanan[]>>("/laporan/bulanan", {
      params: {
        tahun: filter.tahun,
        bulan: filter.bulan,
        divisi_id: filter.divisi_id,
      },
    }),

  /**
   * Laporan detail per karyawan dalam rentang tanggal
   * GET /api/laporan/karyawan/:id?dari=&sampai=
   */
  getByKaryawan: (karyawanId: number, dari: string, sampai: string) =>
    api.get<unknown, ApiResponse<LaporanKaryawan>>(
      `/laporan/karyawan/${karyawanId}`,
      { params: { dari, sampai } }
    ),

  /**
   * Export laporan ke Excel — backend return file blob
   * GET /api/laporan/export/excel?tahun=&bulan=
   */
  exportExcel: async (filter: LaporanFilter): Promise<void> => {
    const response = await axios.get("/api/laporan/export/excel", {
      params: filter,
      responseType: "blob",
      baseURL: import.meta.env.VITE_API_URL ?? "",
    });
    // Trigger download di browser
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `laporan-absensi-${filter.tahun}-${String(filter.bulan).padStart(
        2,
        "0"
      )}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
