import { EMPRESA, fechaCorta, fechaHora, type ReporteDocumentoData } from "../lib/reportes";

function DatoFila({ label, valor }: { label: string; valor?: string | null }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="w-56 px-3 py-2 align-top bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </td>
      <td className="px-3 py-2 align-top text-sm text-gray-900">
        {valor && valor.trim() ? valor : "—"}
      </td>
    </tr>
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
    <div
      id="reporte-imprimir"
      className="bg-white shadow-lg border border-gray-200 rounded-sm mx-auto w-full max-w-3xl px-10 py-9 print:shadow-none print:border-none"
    >
      <header className="flex items-start justify-between gap-6">
        <img src="/logo-maxan.svg" alt="Maxan Sistemas" className="h-11 w-auto" />
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 leading-tight">{EMPRESA.slogan}</p>
          <p className="text-xs text-gray-500 mt-2">{EMPRESA.telefono} &nbsp;·&nbsp; {EMPRESA.website}</p>
        </div>
      </header>

      <div className="mt-3 border-t-[3px] border-blue-600" />
      <div className="mt-[3px] border-t border-blue-600" />

      <div className="mt-7 flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">REPORTE DE SERVICIO</h2>
        <span className="text-xl font-bold text-blue-600">N° {data.numeroReporte}</span>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <table className="w-full border-collapse text-sm">
          <tbody>
            <DatoFila label="Cliente" valor={data.cliente_nombre} />
            <DatoFila label="Caso" valor={data.caso_numero} />
            <DatoFila label="Fecha del caso" valor={fechaCorta(data.caso_fecha)} />
            <DatoFila label="Servicio solicitado por" valor={data.contacto_nombre} />
            <DatoFila label="Técnico" valor={data.tecnico_nombre} />
          </tbody>
        </table>
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
            <ul className="space-y-1.5">
            {data.detalles.map((d) => (
              <li key={d.id} className="text-sm text-gray-700 whitespace-pre-wrap mt-0.5">
                • {d.contenido}
              </li>
            ))}
            </ul>
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
