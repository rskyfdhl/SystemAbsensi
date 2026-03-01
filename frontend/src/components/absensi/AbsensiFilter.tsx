import { useAppStore } from "@/store/useAppStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface AbsensiFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
}

const STATUS_OPTIONS = [
  { value: "hadir", label: "Hadir" },
  { value: "terlambat", label: "Terlambat" },
  { value: "absen", label: "Absen" },
  { value: "izin", label: "Izin" },
];

export function AbsensiFilter({ search, onSearchChange }: AbsensiFilterProps) {
  const {
    tanggalFilter,
    setTanggalFilter,
    divisiFilter,
    statusFilter,
    setStatusFilter,
    resetFilters,
  } = useAppStore();

  const hasFilter = search || divisiFilter || statusFilter;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Cari nama karyawan..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Tanggal */}
      <Input
        type="date"
        value={tanggalFilter}
        onChange={(e) => setTanggalFilter(e.target.value)}
        className="h-9 w-40"
      />

      {/* Status */}
      <Select
        value={statusFilter || "all"}
        onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            resetFilters();
            onSearchChange("");
          }}
          className="h-9 gap-1.5 text-muted-foreground"
        >
          <X className="w-3.5 h-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
