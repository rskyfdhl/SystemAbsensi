import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

export interface UserInfo {
  id: number;
  username: string;
  nama: string;
  role: string;
}

export const authService = {
  async login(username: string, password: string): Promise<UserInfo> {
    const res = await api.post("/auth/login", { username, password });
    return res.data.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async me(): Promise<UserInfo> {
    const res = await api.get("/auth/me");
    return res.data.data;
  },

  async changePassword(
    password_lama: string,
    password_baru: string
  ): Promise<void> {
    await api.post("/auth/change-password", { password_lama, password_baru });
  },
};

export default api;
