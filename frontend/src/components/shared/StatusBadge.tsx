import { Badge } from "@/components/ui/badge";
import { cn, labelStatus, colorStatus, iconStatus } from "@/lib/utils";
import type { AbsensiStatus } from "@/types";

interface StatusBadgeProps {
  status: AbsensiStatus;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium text-xs", colorStatus(status))}
    >
      {showIcon && <span className="mr-1">{iconStatus(status)}</span>}
      {labelStatus(status)}
    </Badge>
  );
}
