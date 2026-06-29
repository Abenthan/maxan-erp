import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { useApi } from "./ApiContext";

interface DashboardData {
  facturas: number;
  productos: number;
  gastos: number;
  compras: number;
}

interface DashboardContextValue {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const api = useApi();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [facturas, productos, gastos, compras] = await Promise.all([
        api.get<unknown[]>("/facturas"),
        api.get<unknown[]>("/productos"),
        api.get<unknown[]>("/gastos"),
        api.get<unknown[]>("/compras"),
      ]);
      setData({
        facturas: facturas.length,
        productos: productos.length,
        gastos: gastos.length,
        compras: compras.length,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar resumen");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <DashboardContext.Provider value={{ data, loading, error, refresh: fetchData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard debe usarse dentro de DashboardProvider");
  return ctx;
}
