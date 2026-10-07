import { jsPDF } from "jspdf";

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

function recursoTexto(r: ReporteRecurso): string {
  const partes = [r.nombre];
  if (r.serial) partes.push(`Serial ${r.serial}`);
  if (r.marca || r.modelo) partes.push([r.marca, r.modelo].filter(Boolean).join(" "));
  if (r.ubicacion) partes.push(`Ubicación: ${r.ubicacion}`);
  return partes.filter(Boolean).join(" · ");
}

async function logoPng(): Promise<string | null> {
  try {
    const res = await fetch("/logo-maxan.svg");
    if (!res.ok) return null;
    let svg = await res.text();
    const vbMatch = svg.match(/viewBox="([^"]+)"/);
    const vb = (vbMatch ? vbMatch[1].split(/[\s,]+/).map(Number) : [0, 0, 1855.59, 475.38]);
    const vbW = vb[2] || 1855.59;
    const vbH = vb[3] || 475.38;
    if (!/<svg[^>]*\swidth=/.test(svg)) {
      svg = svg.replace("<svg ", `<svg width="${vbW}" height="${vbH}" `);
    }
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("No se pudo cargar el logo"));
        img.src = url;
      });
      const factor = 4;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(vbW * factor);
      canvas.height = Math.round(vbH * factor);
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return null;
  }
}

export async function generarReportePdf(data: ReporteDocumentoData): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logo = await logoPng();

  const pageW = 210;
  const pageH = 297;
  const marginLeft = 18;
  const marginRight = 18;
  const marginTop = 14;
  const marginBottom = 18;
  const contentW = pageW - marginLeft - marginRight;
  const bottomLimit = pageH - marginBottom;

  let page = 1;
  let y = marginTop;

  const AZUL: [number, number, number] = [37, 99, 235];
  const GRIS: [number, number, number] = [107, 114, 128];
  const OSCURO: [number, number, number] = [17, 24, 39];

  function footer() {
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(marginLeft, pageH - 13, pageW - marginRight, pageH - 13);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GRIS);
    doc.text(
      `${EMPRESA.nombre} · Reporte N° ${data.numeroReporte} · ${EMPRESA.telefono}`,
      marginLeft,
      pageH - 9
    );
    doc.text(`Página ${page}`, pageW - marginRight, pageH - 9, { align: "right" });
  }

  function nuevaPagina() {
    footer();
    doc.addPage();
    page += 1;
    y = marginTop;
  }

  function asegurar(altura: number) {
    if (y + altura > bottomLimit) nuevaPagina();
  }

  function parrafo(contenido: string | null | undefined, tam = 10, color: [number, number, number] = OSCURO) {
    if (!contenido || !contenido.trim()) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(tam);
    doc.setTextColor(...color);
    const lineas = doc.splitTextToSize(contenido, contentW) as string[];
    for (const linea of lineas) {
      asegurar(5);
      doc.text(linea, marginLeft, y);
      y += 5;
    }
  }

  function seccion(titulo: string) {
    asegurar(16);
    y += 3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...AZUL);
    doc.text(titulo.toUpperCase(), marginLeft, y);
    y += 2;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, y, pageW - marginRight, y);
    y += 6;
  }

  function par(label: string, valor: string | null | undefined, x: number, ancho: number) {
    asegurar(11);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRIS);
    doc.text(label.toUpperCase(), x, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...OSCURO);
    const lineas = doc.splitTextToSize(valor && valor.trim() ? valor : "—", ancho) as string[];
    y += 4.5;
    for (const linea of lineas) {
      asegurar(5);
      doc.text(linea, x, y);
      y += 4.5;
    }
    y += 2;
  }

  // ---------- Membrete ----------
  const logoW = 42;
  const logoH = logoW * (475.38 / 1855.59);
  if (logo) doc.addImage(logo, "PNG", marginLeft, y, logoW, logoH);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...OSCURO);
  doc.text(EMPRESA.nombre, pageW - marginRight, y + 5, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text(`${EMPRESA.telefono}  ·  ${EMPRESA.website}`, pageW - marginRight, y + 10.5, { align: "right" });
  y += logoH + 6;

  doc.setDrawColor(...AZUL);
  doc.setLineWidth(0.7);
  doc.line(marginLeft, y, pageW - marginRight, y);
  y += 4;
  doc.setDrawColor(...AZUL);
  doc.setLineWidth(0.25);
  doc.line(marginLeft, y, pageW - marginRight, y);
  y += 12;

  // ---------- Título del documento ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...OSCURO);
  doc.text("REPORTE DE SERVICIO", marginLeft, y);
  doc.setFontSize(16);
  doc.setTextColor(...AZUL);
  doc.text(`N° ${data.numeroReporte}`, pageW - marginRight, y, { align: "right" });
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text(`Fecha de emisión: ${fechaLarga(data.created_at)}`, marginLeft, y);
  y += 10;

  // ---------- Datos del reporte ----------
  const colIzq = marginLeft;
  const colDer = marginLeft + contentW / 2;
  const colW = contentW / 2 - 4;

  const filas: [string, string | null, string, string | null][] = [
    ["Cliente", data.cliente_nombre, "Documento", data.cliente_documento
      ? `${data.cliente_tipo_documento || ""} ${data.cliente_documento}`.trim()
      : null],
    ["Contacto", data.contacto_nombre, "Teléfono", data.contacto_telefono || data.contacto_whatsapp],
    ["Caso", data.caso_numero, "Estado", data.caso_estado],
    ["Categoría", data.categoria_nombre, "Técnico", data.tecnico_nombre],
    ["Fecha del caso", fechaCorta(data.caso_fecha), "Fuente", data.fuente],
  ];

  for (const [l1, v1, l2, v2] of filas) {
    const antes = y;
    par(l1, v1, colIzq, colW);
    const finIzq = y;
    y = antes;
    par(l2, v2, colDer, colW);
    y = Math.max(finIzq, y);
  }
  y += 2;

  // ---------- Contenido ----------
  seccion("Descripción del caso");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...OSCURO);
  const tituloLineas = doc.splitTextToSize(data.caso_titulo, contentW) as string[];
  for (const linea of tituloLineas) {
    asegurar(5.5);
    doc.text(linea, marginLeft, y);
    y += 5.5;
  }
  y += 1;
  parrafo(data.caso_descripcion);

  if (data.recursos.length > 0) {
    seccion("Recursos involucrados");
    for (const r of data.recursos) {
      asegurar(5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...OSCURO);
      const lineas = doc.splitTextToSize(`•  ${recursoTexto(r)}`, contentW) as string[];
      for (const linea of lineas) {
        asegurar(5);
        doc.text(linea, marginLeft, y);
        y += 5;
      }
    }
  }

  if (data.detalles.length > 0) {
    seccion("Actuaciones");
    for (const d of data.detalles) {
      asegurar(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...AZUL);
      doc.text(`${fechaHora(d.created_at)}  ·  ${d.tipo}  ·  ${d.autor}`, marginLeft, y);
      y += 4.5;
      if (d.recurso) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(...GRIS);
        doc.text(`Recurso: ${d.recurso}`, marginLeft, y);
        y += 4.5;
      }
      parrafo(d.contenido, 10);
      y += 2;
    }
  }

  if (data.solucion && data.solucion.trim()) {
    seccion("Solución");
    parrafo(data.solucion);
  }

  if (data.resumen && data.resumen.trim()) {
    seccion("Resumen");
    parrafo(data.resumen);
  }

  asegurar(34);
  y += 12;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(marginLeft, y, marginLeft + 70, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRIS);
  doc.text(EMPRESA.nombre, marginLeft, y);
  y += 4;
  doc.text(`${EMPRESA.telefono} · ${EMPRESA.website}`, marginLeft, y);

  footer();
  doc.save(`Reporte-${data.numeroReporte}-Caso-${data.caso_numero}.pdf`);
}
