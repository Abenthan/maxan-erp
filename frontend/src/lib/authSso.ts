const AUTH_DELEGATED = import.meta.env.VITE_AUTH_DELEGATED === "true";
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "https://auth.maxansistemas.com";

// En desarrollo el API de sesión se consume por un proxy mismo-origen
// (vite.config.ts: /auth-sso -> backend de auth) para evitar el bloqueo de
// cookies cross-origin. La página de login (navegación completa) sí usa AUTH_URL.
const AUTH_API_BASE =
  AUTH_DELEGATED && import.meta.env.DEV ? "/auth-sso" : AUTH_URL;

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
  const res = await fetch(`${AUTH_API_BASE}/api/auth/session`, { credentials: "include" });
  if (!res.ok) throw new Error("Sesión no válida");
  return res.json();
}

export function authLogout(): void {
  void fetch(`${AUTH_API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(
    () => undefined
  );
}

export { AUTH_DELEGATED, AUTH_URL };
