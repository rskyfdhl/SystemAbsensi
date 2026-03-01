import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTanggalPendek } from "@/lib/utils";
import type { ChartHarian } from "@/types";

interface AttendanceBarChartProps {
  data: ChartHarian[];
  loading?: boolean;
}

export function AttendanceBarChart({ data, loading }: AttendanceBarChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    hari: formatTanggalPendek(d.tanggal).substring(0, 6), // "15 Apr" → "15 Apr"
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Kehadiran 7 Hari Terakhir
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 bg-muted animate-pulse rounded-md" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={14} barGap={3}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="hari"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="hadir"
                name="Hadir"
                fill="#10b981"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="terlambat"
                name="Terlambat"
                fill="#f59e0b"
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="absen"
                name="Absen"
                fill="#ef4444"
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
