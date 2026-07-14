import { useState, useEffect } from "react";
import { usePermiso } from "../context/AuthContext";

export default function Backup() {
  const puedeGestionar = usePermiso("usuarios.gestionar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<{ disponible: boolean; version?: string; modo?: string } | null>(null);

  useEffect(() => {
    fetch("/api/backup/verificar", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((d) => setStatus(d))
      .catch(() => setStatus({ disponible: false }));
  }, []);

  async function handleDownload() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/backup/descargar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Error al descargar backup" }));
        throw new Error(err.error);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = response.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="?(.+?)"?$/);
      a.download = match?.[1] || `maxan_backup_${new Date().toISOString().replace(/[:.]/g, "-")}.dump`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Error al descargar backup");
    } finally {
      setLoading(false);
    }
  }

  if (!puedeGestionar) return <div className="p-8 text-center text-red-500">No tienes permiso para esta acción</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Copia de Seguridad</h1>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
        <p className="text-sm text-gray-600 mb-4">
          Descarga una copia de seguridad completa de la base de datos en formato comprimido (.dump).
          Este archivo puede ser restaurado posteriormente con pg_restore.
        </p>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-sm text-amber-800">
          <strong>Importante:</strong> Durante la generación del backup, el rendimiento del sistema podr&iacute;a verse afectado.
        </div>

        {status && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${status.disponible ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {status.disponible ? (
              <>pg_dump disponible{status.modo ? ` (vía ${status.modo === "docker" ? "Docker: " + status.version : "host directo"})` : ""}</>
            ) : (
              <>
                pg_dump no est&aacute; disponible en el servidor.
                {status.modo === "docker"
                  ? " Verifique que Docker est&eacute; corriendo y el contenedor 'maxan_db_dev' exista."
                  : " Instale el cliente PostgreSQL o configure DB_USE_DOCKER=true en el .env"}
              </>
            )}
          </div>
        )}

        <button
          onClick={handleDownload}
          disabled={loading || status?.disponible === false}
          className="px-6 py-2.5 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? "Generando backup..." : "Descargar Backup"}
        </button>
      </div>
    </div>
  );
}
