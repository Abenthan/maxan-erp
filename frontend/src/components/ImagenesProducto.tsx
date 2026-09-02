import { useState, useRef, useCallback } from "react";
import { useApi } from "../context/ApiContext";

interface Imagen {
  id: number;
  producto_id: number;
  url: string;
  es_principal: boolean;
  orden: number;
  created_at: string;
}

interface Props {
  productoId: number;
  imagenes: Imagen[];
  onActualizar: (imgs: Imagen[]) => void;
}

export default function ImagenesProducto({ productoId, imagenes, onActualizar }: Props) {
  const api = useApi();
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const cargar = useCallback(async () => {
    const imgs = await api.get<Imagen[]>(`/productos/${productoId}/imagenes`);
    onActualizar(imgs);
  }, [api, productoId, onActualizar]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setSubiendo(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("imagen", file);
        await api.upload(`/productos/${productoId}/imagenes`, fd);
      }
      await cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al subir imagen");
    } finally {
      setSubiendo(false);
    }
  }

  async function handleEliminar(id: number) {
    try {
      await api.del(`/productos/${productoId}/imagenes/${id}`);
      await cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
    }
  }

  async function handlePrincipal(id: number) {
    try {
      await api.patch(`/productos/${productoId}/imagenes/${id}/principal`);
      await cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cambiar principal");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  // Reorder via drag
  function handleDragStart(e: React.DragEvent, idx: number) {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOverReorder(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const reordered = [...imagenes];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, moved);
    setDragIdx(idx);
    onActualizar(reordered);
  }

  async function handleDragEnd() {
    setDragIdx(null);
    if (imagenes.length === 0) return;
    const orden = imagenes.map((img) => img.id);
    try {
      await api.patch(`/productos/${productoId}/imagenes/reordenar`, { orden });
    } catch (e) {
      await cargar();
    }
  }

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Imágenes del producto</h3>
        <span className="text-xs text-gray-400">{imagenes.length}/10</span>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">{error}</div>
      )}

      {imagenes.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {imagenes.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOverReorder(e, idx)}
              onDragEnd={handleDragEnd}
              className={`relative group rounded-lg overflow-hidden border-2 aspect-square cursor-grab active:cursor-grabbing ${
                img.es_principal ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
              } ${dragIdx === idx ? "opacity-50" : ""}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleEliminar(img.id)}
                  className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center hover:bg-red-700"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
              <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handlePrincipal(img.id)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    img.es_principal
                      ? "bg-blue-600 text-white"
                      : "bg-white/90 text-gray-700 hover:bg-blue-100"
                  }`}
                  title={img.es_principal ? "Imagen principal" : "Marcar como principal"}
                >
                  {img.es_principal ? "★ Principal" : "☆ Principal"}
                </button>
              </div>
              {img.es_principal && (
                <div className="absolute top-1 left-1">
                  <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[10px] font-semibold">
                    Principal
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {imagenes.length < 10 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          {subiendo ? (
            <p className="text-sm text-gray-500">Subiendo...</p>
          ) : (
            <p className="text-sm text-gray-500">
              Arrastra una imagen o <span className="text-blue-600 font-medium">haz clic</span>
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP — máx. 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}
