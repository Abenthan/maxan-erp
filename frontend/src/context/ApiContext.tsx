import { createContext, useContext, useCallback } from "react";
import type { ReactNode } from "react";
import api from "../lib/api";

interface ApiContextValue {
  get: <T>(url: string, params?: Record<string, string>) => Promise<T>;
  post: <T>(url: string, body?: unknown) => Promise<T>;
  put: <T>(url: string, body?: unknown) => Promise<T>;
  del: <T>(url: string) => Promise<T>;
  postXml: <T>(url: string, xml: string) => Promise<T>;
  upload: <T>(url: string, formData: FormData) => Promise<T>;
}

const ApiContext = createContext<ApiContextValue | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  const get = useCallback(<T,>(url: string, params?: Record<string, string>): Promise<T> => {
    return api.get<T>(url, { params }).then((r) => r.data);
  }, []);

  const post = useCallback(<T,>(url: string, body?: unknown): Promise<T> => {
    return api.post<T>(url, body).then((r) => r.data);
  }, []);

  const put = useCallback(<T,>(url: string, body?: unknown): Promise<T> => {
    return api.put<T>(url, body).then((r) => r.data);
  }, []);

  const postXml = useCallback(<T,>(url: string, xml: string): Promise<T> => {
    return api.post<T>(url, xml, {
      headers: { "Content-Type": "text/xml" },
    }).then((r) => r.data);
  }, []);

  const del = useCallback(<T,>(url: string): Promise<T> => {
    return api.delete<T>(url).then((r) => r.data);
  }, []);

  const upload = useCallback(<T,>(url: string, formData: FormData): Promise<T> => {
    return api.post<T>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data);
  }, []);

  return (
    <ApiContext.Provider value={{ get, post, put, del, postXml, upload }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi debe usarse dentro de ApiProvider");
  return ctx;
}
