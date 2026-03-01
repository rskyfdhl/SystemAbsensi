interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
}

export function EmptyState({
  icon = "📭",
  title = "Tidak ada data",
  description = "Belum ada data yang tersedia.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3 opacity-40">{icon}</div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground/60 mt-1">{description}</p>
    </div>
  );
}
