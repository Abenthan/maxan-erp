import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import api from "../lib/api";

interface User {
  id: number;
  empresa_id: number;
  empresa_nombre: string;
  username: string;
  email: string;
  nombres: string;
  apellidos: string;
  roles: string[];
  permisos: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isFirstRun: boolean | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  hasPermiso: (codigo: string) => boolean;
}

interface RegisterData {
  empresa_nombre: string;
  empresa_nit: string;
  username: string;
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isFirstRun, setIsFirstRun] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      api.get<User>("/auth/me")
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("token", token);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    api.get<{ firstRun: boolean }>("/auth/check-first-run")
      .then((res) => setIsFirstRun(res.data.firstRun))
      .catch(() => setIsFirstRun(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.post<{ token: string; user: User }>("/auth/login", { username, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    await api.post("/auth/register", data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const hasPermiso = useCallback((codigo: string): boolean => {
    if (!user) return false;
    if (user.roles.includes("Administrador")) return true;
    return user.permisos.includes(codigo);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, isFirstRun, login, register, logout, hasPermiso }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

export function usePermiso(codigo: string): boolean {
  const { hasPermiso } = useAuth();
  return hasPermiso(codigo);
}
