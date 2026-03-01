import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatJam } from "@/lib/utils";
import type { AbsensiTerbaru } from "@/types";

interface LiveStreamPanelProps {
  data: AbsensiTerbaru[];
  loading?: boolean;
}

export function LiveStreamPanel({ data, loading }: LiveStreamPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Absensi Masuk Terbaru
          </CardTitle>
          <Badge
            variant="outline"
            className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          >
            ● Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-3 bg-muted animate-pulse rounded" />
                <div className="flex-1 h-3 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Belum ada absensi hari ini
          </div>
        ) : (
          <div className="divide-y divide-border">
            {data.slice(0, 8).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
              >
                <span className="font-mono text-xs text-primary w-11 shrink-0">
                  {formatJam(item.jam_masuk)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.nama}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {item.divisi} — {item.shift}
                  </p>
                </div>
                <StatusBadge status={item.status} showIcon={false} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
