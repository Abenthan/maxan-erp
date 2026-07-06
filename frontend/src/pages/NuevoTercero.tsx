import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

export default function NuevoTercero() {
  const navigate = useNavigate();
  const api = useApi();

  const [form, setForm] = useState({
    tipo_documento: "13",
    numero_documento: "",
    digito_verificacion: "",
    razon_social: "",
    tipo_persona: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    telefono: "",
    email: "",
    es_propio: false,
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function setField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.razon_social.trim() || !form.numero_documento.trim()) return;
    setGuardando(true);
    setError("");
    try {
      await api.post("/terceros", form);
      navigate("/terceros");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Tercero</h1>
        <button
          onClick={() => navigate("/terceros")}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Volver
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo documento *</label>
              <select
                value={form.tipo_documento}
                onChange={(e) => setField("tipo_documento", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="13">Cédula (CC)</option>
                <option value="31">NIT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Número *</label>
              <input
                type="text"
                value={form.numero_documento}
                onChange={(e) => setField("numero_documento", e.target.value)}
                required
                placeholder="123456789"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Razón Social *</label>
            <input
              type="text"
              value={form.razon_social}
              onChange={(e) => setField("razon_social", e.target.value)}
              required
              placeholder="Nombre completo o razón social"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Ciudad</label>
              <input
                type="text"
                value={form.ciudad}
                onChange={(e) => setField("ciudad", e.target.value)}
                placeholder="Bogotá"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Departamento</label>
              <input
                type="text"
                value={form.departamento}
                onChange={(e) => setField("departamento", e.target.value)}
                placeholder="Cundinamarca"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Dirección</label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => setField("direccion", e.target.value)}
              placeholder="Cra 1 # 2-3"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) => setField("telefono", e.target.value)}
                placeholder="3001234567"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="es_propio"
              checked={form.es_propio}
              onChange={(e) => setField("es_propio", e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="es_propio" className="text-sm text-gray-600">Es empresa propia</label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/terceros")}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
