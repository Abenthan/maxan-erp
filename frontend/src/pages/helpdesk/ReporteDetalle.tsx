import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import ReporteDocumento from "../../components/ReporteDocumento";
import type { ReporteDocumentoData } from "../../lib/reportes";

export default function ReporteDetalle() {
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();

  const [reporte, setReporte] = useState<ReporteDocumentoData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get<ReporteDocumentoData>(`/helpdesk/reportes/${id}`)
      .then(setReporte)
      .catch(() => navigate("/helpdesk/reportes"))
      .finally(() => setCargando(false));
  }, [id, api, navigate]);

  if (cargando) return <p className="text-center py-12 text-gray-400">Cargando reporte...</p>;
  if (!reporte) return <p className="text-center py-12 text-gray-400">Reporte no encontrado</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => navigate("/helpdesk/reportes")}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ← Volver a reportes
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/helpdesk/casos/${reporte.idCaso}`)}
            className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Ver caso
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Imprimir
          </button>
        </div>
      </div>

      <ReporteDocumento data={reporte} />
    </div>
  );
}
