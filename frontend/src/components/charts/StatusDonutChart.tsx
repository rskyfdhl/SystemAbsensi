import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/types";

interface StatusDonutChartProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

const SEGMENTS = [
  { key: "hadir", label: "Hadir", color: "#10b981" },
  { key: "terlambat", label: "Terlambat", color: "#f59e0b" },
  { key: "absen", label: "Absen", color: "#ef4444" },
  { key: "izin", label: "Izin", color: "#6366f1" },
];

export function StatusDonutChart({ stats, loading }: StatusDonutChartProps) {
  const data = SEGMENTS.map((s) => ({
    ...s,
    value: (stats?.[s.key as keyof DashboardStats] as number) ?? 0,
  })).filter((d) => d.value > 0);

  const total = stats?.total_karyawan ?? 0;
  const pct = total > 0 ? Math.round(((stats?.hadir ?? 0) / total) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Status Hari Ini</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 bg-muted animate-pulse rounded-md" />
        ) : (
          <div className="flex items-center gap-4">
            {/* Donut */}
            <div className="relative shrink-0">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={56}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                  >
                    {data.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold font-mono">{pct}%</span>
                <span className="text-[9px] text-muted-foreground">hadir</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 flex-1">
              {SEGMENTS.map((s) => (
                <div key={s.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ background: s.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold">
                    {(stats?.[s.key as keyof DashboardStats] as number) ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
