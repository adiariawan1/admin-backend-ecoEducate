import React from "react";
import { Trash2 } from "lucide-react";

export default function GalleryGrid({ items, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-400">Belum ada foto di galeri.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition"
        >
          <div className="aspect-square bg-gray-100 relative">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                onClick={() => onDelete(item.id)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <div className="p-3">
            <p className="font-bold text-slate-700 text-sm truncate">
              {item.title || "Tanpa Judul"}
            </p>
            <p className="text-xs text-slate-400">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}