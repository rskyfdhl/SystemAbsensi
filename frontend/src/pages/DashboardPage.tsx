import { useDashboard } from "@/hooks/useDashboard";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { AttendanceBarChart } from "@/components/charts/AttendanceBarChart";
import { StatusDonutChart } from "@/components/charts/StatusDonutChart";
import { DeptProgressList } from "@/components/charts/DeptProgressList";
import { LiveStreamPanel } from "@/components/absensi/LiveStreamPanel";
import { Users, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const { stats, loading } = useDashboard();

  const pctHadir = stats
    ? Math.round((stats.hadir / stats.total_karyawan) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Ringkasan kehadiran hari ini" />

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Karyawan"
          value={stats?.total_karyawan ?? 0}
          sub="Aktif bulan ini"
          icon={Users}
          color="blue"
          loading={loading}
        />
        <StatCard
          label="Hadir Hari Ini"
          value={stats?.hadir ?? 0}
          sub={`${pctHadir}% kehadiran`}
          icon={CheckCircle2}
          color="green"
          loading={loading}
        />
        <StatCard
          label="Tidak Hadir"
          value={stats?.absen ?? 0}
          sub={`${stats?.izin ?? 0} izin`}
          icon={XCircle}
          color="red"
          loading={loading}
        />
        <StatCard
          label="Terlambat"
          value={stats?.terlambat ?? 0}
          sub="> 15 menit"
          icon={AlertTriangle}
          color="yellow"
          loading={loading}
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AttendanceBarChart
            data={stats?.chart_7hari ?? []}
            loading={loading}
          />
        </div>
        <StatusDonutChart stats={stats} loading={loading} />
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiveStreamPanel
          data={stats?.absensi_terbaru ?? []}
          loading={loading}
        />
        <DeptProgressList
          data={stats?.kehadiran_per_divisi ?? []}
          loading={loading}
        />
      </div>
    </div>
  );
}
