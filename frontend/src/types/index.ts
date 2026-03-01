// ── CORE ENTITIES ────────────────────────────────────────────

export interface Divisi {
  id: number;
  nama: string;
  kode: string;
}

export interface Shift {
  id: number;
  nama: string;
  jam_masuk: string; // format "HH:MM:SS"
  jam_keluar: string;
  toleransi_menit: number;
  hari_kerja: string; // "Sen-Jum"
  aktif: boolean;
  karyawan_count?: number;
}

export interface Karyawan {
  id: number;
  kode_karyawan: string; // "KRY-001"
  nama: string;
  jabatan?: string;
  divisi_id?: number;
  shift_id?: number;
  fingerprint_uid?: number;
  email?: string;
  no_hp?: string;
  aktif: boolean;
  // joined fields dari backend
  nama_divisi?: string;
  nama_shift?: string;
}

export interface Absensi {
  id: number;
  kode_karyawan: string;
  nama: string;
  divisi: string;
  shift: string;
  tanggal: string; // "YYYY-MM-DD"
  jam_masuk: string | null;
  jam_keluar: string | null;
  total_menit: number;
  terlambat_menit: number;
  status: AbsensiStatus;
  catatan?: string;
  diinput_manual?: boolean;
}

export interface PerangkatFP {
  id: number;
  nama: string;
  ip_address: string;
  port: number;
  merek: string;
  lokasi: string;
  aktif: boolean;
  terakhir_sync: string | null;
}

export interface Izin {
  id: number;
  karyawan_id: number;
  nama_karyawan?: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jenis: JenisIzin;
  alasan?: string;
  disetujui: boolean;
}

export interface LogFingerprint {
  id: number;
  perangkat_id: number;
  fingerprint_uid: number;
  waktu_tap: string;
  tipe: number;
  sudah_diproses: boolean;
}

// ── DASHBOARD ────────────────────────────────────────────────

export interface DashboardStats {
  total_karyawan: number;
  hadir: number;
  terlambat: number;
  absen: number;
  izin: number;
  chart_7hari: ChartHarian[];
  absensi_terbaru: AbsensiTerbaru[];
  kehadiran_per_divisi: KehadiranDivisi[];
}

export interface ChartHarian {
  tanggal: string; // "YYYY-MM-DD"
  hadir: number;
  terlambat: number;
  absen: number;
}

export interface AbsensiTerbaru {
  nama: string;
  divisi: string;
  shift: string;
  jam_masuk: string | null;
  status: AbsensiStatus;
}

export interface KehadiranDivisi {
  divisi: string;
  hadir: number;
  total: number;
  persen: number;
}

// ── LAPORAN ───────────────────────────────────────────────────

export interface RekapBulanan {
  karyawan_id: number;
  kode_karyawan: string;
  nama: string;
  divisi: string;
  tahun: number;
  bulan: number;
  total_hari: number;
  hari_hadir: number;
  hari_terlambat: number;
  hari_absen: number;
  hari_izin: number;
  total_menit_kerja: number;
  persen_kehadiran: number;
}

export interface LaporanKaryawan {
  karyawan: Pick<Karyawan, "nama" | "kode_karyawan">;
  detail: Absensi[];
}

// ── FILTER & FORM TYPES ───────────────────────────────────────

export interface AbsensiFilter {
  tanggal?: string;
  divisi_id?: number | string;
  status?: AbsensiStatus | "";
  nama?: string;
}

export interface LaporanFilter {
  karyawan_id?: number;
  divisi_id?: number;
  tahun: number;
  bulan: number;
  dari?: string;
  sampai?: string;
}

export type KaryawanFormData = Omit<
  Karyawan,
  "id" | "nama_divisi" | "nama_shift"
>;

export type ShiftFormData = Omit<Shift, "id" | "aktif" | "karyawan_count">;

export type PerangkatFormData = Omit<
  PerangkatFP,
  "id" | "aktif" | "terakhir_sync"
>;

// ── ENUM-LIKE TYPES ───────────────────────────────────────────

export type AbsensiStatus = "hadir" | "terlambat" | "absen" | "izin" | "libur";

export type JenisIzin = "cuti" | "sakit" | "izin" | "dinas_luar";

export type UserRole = "superadmin" | "admin" | "viewer";

// ── API RESPONSE WRAPPER ──────────────────────────────────────

export interface ApiResponse<T = unknown> {
  status: "ok" | "error";
  msg: string;
  data?: T;
}

export interface SyncResult {
  total_dari_mesin: number;
  record_baru: number;
}

// ── UI HELPER TYPES ───────────────────────────────────────────

export type ColorVariant =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "orange"
  | "gray";

export type SortDirection = "asc" | "desc";

export interface TableSort {
  column: string;
  direction: SortDirection;
}

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}
