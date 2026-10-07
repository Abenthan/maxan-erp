import { EMPRESA, fechaCorta, fechaHora, fechaLarga, type ReporteDocumentoData } from "../lib/reportes";

function Dato({ label, valor }: { label: string; valor?: string | null }) {
  return (
    <div>
      <span className="block text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</span>
      <span className="text-sm text-gray-900">{valor && valor.trim() ? valor : "—"}</span>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h3 className="text-xs font-bold uppercase tracking-wide text-blue-600 border-b border-gray-200 pb-1 mb-3">
        {titulo}
      </h3>
      {children}
    </section>
  );
}

export default function ReporteDocumento({ data }: { data: ReporteDocumentoData }) {
  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-sm mx-auto w-full max-w-3xl px-10 py-9 print:shadow-none print:border-none">
      <header className="flex items-start justify-between gap-6">
        <img src="/logo-maxan.svg" alt="Maxan Sistemas" className="h-11 w-auto" />
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 leading-tight">{EMPRESA.nombre}</p>
          <p className="text-xs text-gray-500">{EMPRESA.telefono} &nbsp;·&nbsp; {EMPRESA.website}</p>
        </div>
      </header>

      <div className="mt-3 border-t-[3px] border-blue-600" />
      <div className="mt-[3px] border-t border-blue-600" />

      <div className="mt-7 flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">REPORTE DE SERVICIO</h2>
        <span className="text-xl font-bold text-blue-600">N° {data.numeroReporte}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">Fecha de emisión: {fechaLarga(data.created_at)}</p>

      <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-gray-100 pt-4">
        <Dato label="Cliente" valor={data.cliente_nombre} />
        <Dato
          label="Documento"
          valor={data.cliente_documento ? `${data.cliente_tipo_documento || ""} ${data.cliente_documento}`.trim() : null}
        />
        <Dato label="Contacto" valor={data.contacto_nombre} />
        <Dato label="Teléfono" valor={data.contacto_telefono || data.contacto_whatsapp} />
        <Dato label="Caso" valor={data.caso_numero} />
        <Dato label="Estado" valor={data.caso_estado} />
        <Dato label="Categoría" valor={data.categoria_nombre} />
        <Dato label="Técnico" valor={data.tecnico_nombre} />
        <Dato label="Fecha del caso" valor={fechaCorta(data.caso_fecha)} />
        <Dato label="Fuente" valor={data.fuente} />
      </div>

      <Seccion titulo="Descripción del caso">
        <p className="text-sm font-semibold text-gray-900 mb-1">{data.caso_titulo}</p>
        {data.caso_descripcion ? (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.caso_descripcion}</p>
        ) : (
          <p className="text-sm text-gray-400">Sin descripción registrada</p>
        )}
      </Seccion>

      {data.recursos.length > 0 && (
        <Seccion titulo="Recursos involucrados">
          <ul className="space-y-1.5">
            {data.recursos.map((r) => (
              <li key={r.id} className="text-sm text-gray-700">
                • {r.nombre}
                {r.serial && <span className="font-mono text-gray-500"> (Serial {r.serial})</span>}
                {(r.marca || r.modelo) && (
                  <span className="text-gray-500"> — {[r.marca, r.modelo].filter(Boolean).join(" ")}</span>
                )}
                {r.ubicacion && <span className="text-gray-500"> · {r.ubicacion}</span>}
              </li>
            ))}
          </ul>
        </Seccion>
      )}

      {data.detalles.length > 0 && (
        <Seccion titulo="Actuaciones">
          <div className="space-y-4">
            {data.detalles.map((d) => (
              <div key={d.id}>
                <p className="text-[11px] font-semibold text-blue-600">
                  {fechaHora(d.created_at)} · {d.tipo} · {d.autor}
                </p>
                {d.recurso && <p className="text-[11px] italic text-gray-500">Recurso: {d.recurso}</p>}
                <p className="text-sm text-gray-700 whitespace-pre-wrap mt-0.5">{d.contenido}</p>
              </div>
            ))}
          </div>
        </Seccion>
      )}

      {data.solucion && data.solucion.trim() && (
        <Seccion titulo="Solución">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.solucion}</p>
        </Seccion>
      )}

      {data.resumen && data.resumen.trim() && (
        <Seccion titulo="Resumen">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.resumen}</p>
        </Seccion>
      )}

      <footer className="mt-14 pt-6">
        <div className="w-64 border-t border-gray-300 pt-2">
          <p className="text-xs text-gray-600">{EMPRESA.nombre}</p>
          <p className="text-xs text-gray-500">{EMPRESA.telefono} · {EMPRESA.website}</p>
        </div>
      </footer>
    </div>
  );
}
