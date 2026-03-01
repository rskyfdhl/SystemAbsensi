import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import Sidebar from "./Sidebar";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import type { UserInfo } from "@/services/auth";
import Topbar from "./Topbar";

interface MainLayoutProps {
  children: React.ReactNode;
  user: UserInfo;
  onLogout: () => void;
}

export default function MainLayout({
  children,
  user,
  onLogout,
}: MainLayoutProps) {
  const { theme, sidebarOpen } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div
        className={cn(
          "flex flex-col flex-1 min-h-screen transition-all duration-300",
          sidebarOpen ? "ml-60" : "ml-16"
        )}
      >
        {/* Import TopbarWithAuth di bawah */}
        <Topbar user={user} onLogout={onLogout} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
      <Toaster position="top-right" richColors closeButton duration={3000} />
    </div>
  );
}
