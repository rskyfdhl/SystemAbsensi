import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { AbsensiStatus, ColorVariant } from "@/types";

// ── TAILWIND CLASS MERGER (wajib untuk shadcn/ui) ─────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── DATE & TIME FORMATTERS ────────────────────────────────────

export function formatTanggal(
  dateStr: string,
  fmt = "EEEE, dd MMMM yyyy"
): string {
  try {
    return format(parseISO(dateStr), fmt, { locale: localeId });
  } catch {
    return dateStr;
  }
}

/**
 * Format tanggal pendek
 * "2025-04-15" → "15 Apr 2025"
 */
export function formatTanggalPendek(dateStr: string): string {
  return formatTanggal(dateStr, "dd MMM yyyy");
}

/**
 * Format datetime ke jam saja
 * "2025-04-15T08:02:00" → "08:02"
 */
export function formatJam(datetimeStr: string | null): string {
  if (!datetimeStr) return "—";
  try {
    return format(parseISO(datetimeStr), "HH:mm");
  } catch {
    // Kalau formatnya sudah "HH:MM:SS", ambil 5 karakter pertama
    return datetimeStr.substring(0, 5);
  }
}

/**
 * Format tanggal relatif
 * → "Hari ini", "Kemarin", atau "15 Apr 2025"
 */
export function formatTanggalRelatif(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Hari ini";
    if (isYesterday(date)) return "Kemarin";
    return formatTanggalPendek(dateStr);
  } catch {
    return dateStr;
  }
}

/**
 * Konversi menit ke format jam & menit
 * 495 → "8j 15m"
 */
export function formatDurasi(menit: number): string {
  if (!menit || menit <= 0) return "—";
  const jam = Math.floor(menit / 60);
  const sisa = menit % 60;
  if (jam === 0) return `${sisa}m`;
  if (sisa === 0) return `${jam}j`;
  return `${jam}j ${sisa}m`;
}

/**
 * Format keterlambatan
 * 0 → "—", 25 → "+25 menit"
 */
export function formatTerlambat(menit: number): string {
  if (!menit || menit <= 0) return "—";
  if (menit < 60) return `+${menit} menit`;
  return `+${formatDurasi(menit)}`;
}

/**
 * Tanggal hari ini dalam format ISO "YYYY-MM-DD"
 */
export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/**
 * Nama bulan dalam bahasa Indonesia
 */
export function namaBulan(bulan: number): string {
  const bulanList = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return bulanList[bulan - 1] ?? "—";
}

// ── STATUS HELPERS ────────────────────────────────────────────

/**
 * Label teks untuk status absensi
 */
export function labelStatus(status: AbsensiStatus): string {
  const map: Record<AbsensiStatus, string> = {
    hadir: "Hadir",
    terlambat: "Terlambat",
    absen: "Absen",
    izin: "Izin",
    libur: "Libur",
  };
  return map[status] ?? status;
}

/**
 * Warna badge untuk status absensi
 * Return class Tailwind untuk variant badge shadcn
 */
export function colorStatus(status: AbsensiStatus): string {
  const map: Record<AbsensiStatus, string> = {
    hadir: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    terlambat: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    absen: "bg-red-500/10 text-red-500 border-red-500/20",
    izin: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    libur: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  return map[status] ?? "";
}

/**
 * Emoji icon untuk status absensi
 */
export function iconStatus(status: AbsensiStatus): string {
  const map: Record<AbsensiStatus, string> = {
    hadir: "✓",
    terlambat: "⚠",
    absen: "✗",
    izin: "📋",
    libur: "🏖",
  };
  return map[status] ?? "?";
}

/**
 * Warna variant untuk ColorVariant → Tailwind classes
 */
export function colorVariantClass(color: ColorVariant): string {
  const map: Record<ColorVariant, string> = {
    blue: "border-t-blue-500 text-blue-500",
    green: "border-t-emerald-500 text-emerald-500",
    red: "border-t-red-500 text-red-500",
    yellow: "border-t-yellow-500 text-yellow-500",
    orange: "border-t-orange-500 text-orange-500",
    gray: "border-t-zinc-500 text-zinc-400",
  };
  return map[color] ?? "";
}

// ── NUMBER & STRING HELPERS ───────────────────────────────────

/**
 * Format persen
 * 85.714 → "85.7%"
 */
export function formatPersen(nilai: number, desimal = 1): string {
  if (isNaN(nilai)) return "0%";
  return `${nilai.toFixed(desimal)}%`;
}

/**
 * Inisial nama untuk avatar
 * "Budi Santoso" → "BS"
 */
export function getInisial(nama: string): string {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Truncate teks panjang
 * "Ini adalah teks yang sangat panjang sekali" → "Ini adalah teks..."
 */
export function truncate(text: string, maxLength = 30): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate warna background konsisten berdasarkan string (untuk avatar)
 */
export function stringToColor(str: string): string {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-cyan-500",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// ── VALIDATION HELPERS ────────────────────────────────────────

export function isValidIP(ip: string): boolean {
  const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!pattern.test(ip)) return false;
  return ip.split(".").every((part) => parseInt(part) <= 255);
}

export function isValidTime(time: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}
