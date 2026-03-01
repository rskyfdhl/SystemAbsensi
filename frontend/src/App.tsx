import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Fingerprint } from "lucide-react";

const AbsensiPage = lazy(() => import("@/pages/AbsensiPage"));
const KaryawanPage = lazy(() => import("@/pages/KaryawanPage"));
const ShiftPage = lazy(() => import("@/pages/ShiftPage"));
const PerangkatPage = lazy(() => import("@/pages/PerangkatPage"));
const LaporanPage = lazy(() => import("@/pages/LaporanPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export default function App() {
  const { user, loading, login, logout } = useAuth();

  // Loading awal — cek session
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Fingerprint className="w-10 h-10 text-primary animate-pulse" />
        <p className="text-sm text-muted-foreground">Memuat sistem...</p>
      </div>
    );
  }

  // Belum login → tampilkan halaman login
  if (!user) {
    return (
      <>
        {/* Dark mode default untuk login page */}
        <style>{`html { color-scheme: dark; }`}</style>
        <LoginPage onLogin={login} />
      </>
    );
  }

  // Sudah login → tampilkan aplikasi
  return (
    <BrowserRouter>
      <MainLayout user={user} onLogout={logout}>
        <Suspense fallback={<LoadingSpinner text="Memuat halaman..." />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/absensi" element={<AbsensiPage />} />
            <Route path="/karyawan" element={<KaryawanPage />} />
            <Route path="/shift" element={<ShiftPage />} />
            <Route path="/perangkat" element={<PerangkatPage />} />
            <Route path="/laporan" element={<LaporanPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  );
}
