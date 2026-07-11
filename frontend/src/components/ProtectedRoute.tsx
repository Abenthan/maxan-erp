import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  permiso?: string;
}

export default function ProtectedRoute({ children, permiso }: Props) {
  const { user, loading, hasPermiso } = useAuth();

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (permiso && !hasPermiso(permiso)) return <div className="p-8 text-center text-red-500">No tienes permiso para acceder a esta página</div>;

  return <>{children}</>;
}
