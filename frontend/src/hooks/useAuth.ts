import { useState, useEffect, useCallback } from "react";
import { authService, type UserInfo } from "@/services/auth";
import { toast } from "sonner";

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Cek session saat pertama load
  const checkSession = useCallback(async () => {
    try {
      const me = await authService.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (username: string, password: string) => {
    try {
      const me = await authService.login(username, password);
      setUser(me);
      toast.success(`Selamat datang, ${me.nama}!`);
      return true;
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg ?? "Login gagal";
      toast.error(msg);
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    toast.success("Berhasil logout");
  };

  return { user, loading, login, logout };
}
