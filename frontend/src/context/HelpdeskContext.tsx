import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface Cliente {
  id: number;
  razon_social: string;
  numero_documento: string;
  tipo_documento: string;
  ciudad?: string;
  telefono?: string;
}

interface HelpdeskContextType {
  cliente: Cliente | null;
  setCliente: (c: Cliente) => void;
  clearCliente: () => void;
}

const HelpdeskContext = createContext<HelpdeskContextType | null>(null);

export function HelpdeskProvider({ children }: { children: ReactNode }) {
  const [cliente, setClienteState] = useState<Cliente | null>(() => {
    try {
      const stored = sessionStorage.getItem("helpdesk_cliente");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setCliente = useCallback((c: Cliente) => {
    setClienteState(c);
    sessionStorage.setItem("helpdesk_cliente", JSON.stringify(c));
  }, []);

  const clearCliente = useCallback(() => {
    setClienteState(null);
    sessionStorage.removeItem("helpdesk_cliente");
  }, []);

  return (
    <HelpdeskContext.Provider value={{ cliente, setCliente, clearCliente }}>
      {children}
    </HelpdeskContext.Provider>
  );
}

export function useHelpdesk() {
  const ctx = useContext(HelpdeskContext);
  if (!ctx) throw new Error("useHelpdesk debe usarse dentro de HelpdeskProvider");
  return ctx;
}
