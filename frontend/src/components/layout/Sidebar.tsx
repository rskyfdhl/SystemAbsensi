import { NavLink, useLocation } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Clock,
  Cpu,
  FileBarChart2,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  {
    group: "Utama",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/absensi", icon: ClipboardList, label: "Data Absensi" },
      { to: "/karyawan", icon: Users, label: "Karyawan" },
    ],
  },
  {
    group: "Pengaturan",
    items: [
      { to: "/shift", icon: Clock, label: "Manajemen Shift" },
      { to: "/perangkat", icon: Cpu, label: "Perangkat FP" },
      { to: "/laporan", icon: FileBarChart2, label: "Laporan & Export" },
    ],
  },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 flex flex-col",
          "bg-card border-r border-border",
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-60" : "w-16"
        )}
      >
        {/* LOGO */}
        <div
          className={cn(
            "flex items-center h-14 px-4 border-b border-border shrink-0",
            sidebarOpen ? "justify-between" : "justify-center"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2 overflow-hidden",
              !sidebarOpen && "hidden"
            )}
          >
            <Fingerprint className="w-6 h-6 text-primary shrink-0" />
            <span className="font-bold text-sm tracking-tight whitespace-nowrap">
              ABSEN
              <span className="text-muted-foreground font-normal">·sys</span>
            </span>
          </div>
          {!sidebarOpen && <Fingerprint className="w-6 h-6 text-primary" />}
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-4">
          {navItems.map((group) => (
            <div key={group.group}>
              {sidebarOpen && (
                <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group.group}
                </p>
              )}
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => (
                  <NavItem key={item.to} {...item} collapsed={!sidebarOpen} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* SERVER STATUS */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-muted-foreground font-mono">
                Server aktif
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground/50 font-mono mt-0.5">
              :5000
            </p>
          </div>
        )}

        {/* TOGGLE BUTTON */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-3 top-[72px]",
            "w-6 h-6 rounded-full",
            "bg-card border border-border",
            "flex items-center justify-center",
            "text-muted-foreground hover:text-foreground",
            "transition-colors shadow-sm"
          )}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </button>
      </aside>
    </TooltipProvider>
  );
}

// ── NAV ITEM ─────────────────────────────────────────────────

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

function NavItem({ to, icon: Icon, label, collapsed }: NavItemProps) {
  const location = useLocation();
  const isActive =
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const content = (
    <NavLink
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
        "transition-colors duration-150",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
