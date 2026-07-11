import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, isFirstRun } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    empresa_nombre: "",
    empresa_nit: "",
    nombres: "",
    apellidos: "",
    username: "",
    email: "",
    password: "",
    confirmar: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k: string, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await register({
        empresa_nombre: form.empresa_nombre,
        empresa_nit: form.empresa_nit,
        nombres: form.nombres,
        apellidos: form.apellidos,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  }

  if (isFirstRun === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-sm text-center">
          <p className="text-gray-600 mb-4">Ya hay usuarios registrados en el sistema.</p>
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Ir al inicio de sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configuración Inicial</h1>
          <p className="text-sm text-gray-500 mt-1">Crea el primer usuario administrador</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="border border-gray-200 rounded-lg p-4">
            <legend className="text-xs font-semibold text-gray-500 px-1">Empresa</legend>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre de la empresa</label>
                <input type="text" value={form.empresa_nombre} onChange={(e) => set("empresa_nombre", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">NIT</label>
                <input type="text" value={form.empresa_nit} onChange={(e) => set("empresa_nit", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-200 rounded-lg p-4">
            <legend className="text-xs font-semibold text-gray-500 px-1">Administrador</legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombres</label>
                <input type="text" value={form.nombres} onChange={(e) => set("nombres", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Apellidos</label>
                <input type="text" value={form.apellidos} onChange={(e) => set("apellidos", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Usuario</label>
                <input type="text" value={form.username} onChange={(e) => set("username", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Contraseña</label>
                <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Confirmar</label>
                <input type="password" value={form.confirmar} onChange={(e) => set("confirmar", e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear administrador"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
