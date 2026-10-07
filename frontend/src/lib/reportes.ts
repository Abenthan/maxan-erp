export interface ReporteFila {
  id: number;
  numeroReporte: number;
  idCaso: number;
  created_at: string;
  caso_numero: string;
  caso_titulo: string;
  caso_estado: string;
  cliente_id: number | null;
  cliente_nombre: string | null;
}

export interface ReporteRecurso {
  id: number;
  nombre: string;
  serial: string | null;
  tipo: string;
  marca: string | null;
  modelo: string | null;
  ubicacion: string | null;
}

export interface ReporteDetalle {
  id: number;
  contenido: string;
  tipo: string;
  created_at: string;
  recurso: string | null;
  autor: string;
}

export interface ReporteDocumentoData {
  id: number;
  numeroReporte: number;
  idCaso: number;
  created_at: string;
  caso_numero: string;
  caso_titulo: string;
  caso_descripcion: string | null;
  caso_estado: string;
  fuente: string;
  solucion: string | null;
  resumen: string | null;
  caso_fecha: string;
  categoria_nombre: string | null;
  categoria_color: string | null;
  tecnico_nombre: string | null;
  cliente_nombre: string | null;
  cliente_documento: string | null;
  cliente_tipo_documento: string | null;
  cliente_ciudad: string | null;
  cliente_telefono: string | null;
  cliente_email: string | null;
  contacto_nombre: string | null;
  contacto_telefono: string | null;
  contacto_whatsapp: string | null;
  contacto_email: string | null;
  recursos: ReporteRecurso[];
  detalles: ReporteDetalle[];
}

export const EMPRESA = {
  nombre: "Maxan Sistemas",
  telefono: "313 485 0115",
  website: "maxansistemas.com",
  slogan: "Tecnología que impulsa tu negocio.",
};

export function fechaCorta(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function fechaLarga(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
}

export function fechaHora(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
