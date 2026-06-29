import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { useApi } from "../context/ApiContext";

const modulos = [
  {
    to: "/facturas",
    titulo: "Facturación",
    desc: "Facturas electrónicas DIAN, consulta y gestión de ventas",
    icono: "📄",
    color: "blue",
  },
  {
    to: "/productos",
    titulo: "Productos",
    desc: "Catálogo de productos, servicios e inventariables",
    icono: "📦",
    color: "emerald",
  },
  {
    to: "/compras",
    titulo: "Compras",
    desc: "Facturas de proveedores y documentos soporte",
    icono: "📥",
    color: "violet",
  },
  {
    to: "/gastos",
    titulo: "Gastos",
    desc: "Gastos operacionales, administrativos y suministros",
    icono: "💰",
    color: "amber",
  },
  {
    to: "/inventario",
    titulo: "Inventario",
    desc: "Stock disponible, movimientos y consumo FIFO",
    icono: "📊",
    color: "rose",
  },
];

const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", hover: "hover:bg-blue-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", hover: "hover:bg-emerald-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", hover: "hover:bg-violet-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", hover: "hover:bg-amber-100" },
  rose: { bg: "bg-rose-50", text: "text-rose-700", hover: "hover:bg-rose-100" },
};

const resumenCards = [
  { key: "facturas" as const, label: "Facturas", color: "text-blue-600" },
  { key: "productos" as const, label: "Productos", color: "text-emerald-600" },
  { key: "gastos" as const, label: "Gastos", color: "text-amber-600" },
  { key: "compras" as const, label: "Compras", color: "text-violet-600" },
];

export default function Inicio() {
  const api = useApi();
  const { data: resumen, loading: resumenLoading } = useDashboard();
  const [salud, setSalud] = useState<string>("");

  useEffect(() => {
    api.get<{ db: string }>("/health")
      .then((d) => setSalud(d.db === "connected" ? "Conectado" : "Desconectado"))
      .catch(() => setSalud("Sin conexión"));
  }, [api]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Principal</h1>
          <p className="text-sm text-gray-500 mt-1">
            Base de datos:{" "}
            <span
              className={`font-medium ${
                salud === "Conectado" ? "text-green-600" : "text-red-600"
              }`}
            >
              {salud || "Verificando..."}
            </span>
          </p>
        </div>
        <span className="text-sm text-gray-400">
          {new Date().toLocaleDateString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {modulos.map((m) => {
          const c = colorClasses[m.color];
          return (
            <Link
              key={m.to}
              to={m.to}
              className={`block rounded-xl border border-gray-200 bg-white p-5 ${c.hover} transition-all hover:shadow-md hover:-translate-y-0.5`}
            >
              <div
                className={`w-11 h-11 rounded-lg ${c.bg} flex items-center justify-center text-xl mb-3`}
              >
                {m.icono}
              </div>
              <h3 className={`font-semibold text-base ${c.text}`}>{m.titulo}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-snug">{m.desc}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Resumen rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {resumenCards.map((card) => (
            <div key={card.key} className="p-3 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${card.color}`}>
                {resumenLoading ? "..." : resumen?.[card.key] ?? "--"}
              </div>
              <div className="text-xs text-gray-500 mt-1">{card.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
