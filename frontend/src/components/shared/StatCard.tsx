import { cn, colorVariantClass } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { ColorVariant } from "@/types";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  icon?: LucideIcon;
  color: ColorVariant;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  loading,
}: StatCardProps) {
  const colorClass = colorVariantClass(color);

  return (
    <Card
      className={cn(
        "border-t-2 relative overflow-hidden",
        colorClass.split(" ")[0]
      )}
    >
      <CardContent className="pt-5 pb-4">
        {Icon && (
          <Icon
            className={cn(
              "absolute top-4 right-4 w-8 h-8 opacity-10",
              colorClass.split(" ")[1]
            )}
          />
        )}
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          {label}
        </p>
        {loading ? (
          <div className="h-9 w-20 bg-muted animate-pulse rounded" />
        ) : (
          <p
            className={cn(
              "text-4xl font-bold font-mono tabular-nums",
              colorClass.split(" ")[1]
            )}
          >
            {value}
          </p>
        )}
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}
