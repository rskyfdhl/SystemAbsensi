import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { KehadiranDivisi } from "@/types";

interface DeptProgressListProps {
  data: KehadiranDivisi[];
  loading?: boolean;
}

const progressColor = (pct: number) => {
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 75) return "bg-yellow-500";
  return "bg-red-500";
};

export function DeptProgressList({ data, loading }: DeptProgressListProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Kehadiran per Divisi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-1.5 bg-muted animate-pulse rounded" />
              </div>
            ))
          : data.map((d) => (
              <div key={d.divisi}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">
                    {d.divisi}
                  </span>
                  <span className="text-xs font-mono font-semibold">
                    {d.hadir}/{d.total}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      progressColor(d.persen)
                    )}
                    style={{ width: `${d.persen}%` }}
                  />
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}
