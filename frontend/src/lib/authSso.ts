const AUTH_DELEGATED = import.meta.env.VITE_AUTH_DELEGATED === "true";
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "https://auth.maxansistemas.com";

export interface SsoUser {
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

export interface SsoSession {
  token: string;
  user: SsoUser;
}

export function authLoginUrl(redirect: string): string {
  const url = new URL(`${AUTH_URL}/login`);
  url.searchParams.set("app", "erp");
  url.searchParams.set("redirect", redirect);
  return url.toString();
}

export function redirectToAuthLogin(redirect?: string): void {
  const target = redirect || `${window.location.origin}/`;
  window.location.href = authLoginUrl(target);
}

export async function fetchAuthSession(): Promise<SsoSession> {
  const res = await fetch(`${AUTH_URL}/api/auth/session`, { credentials: "include" });
  if (!res.ok) throw new Error("Sesión no válida");
  return res.json();
}

export function authLogout(): void {
  void fetch(`${AUTH_URL}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(
    () => undefined
  );
}

export { AUTH_DELEGATED, AUTH_URL };
