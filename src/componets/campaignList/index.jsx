import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function CampaignList({ campaigns, onEdit, onDelete }) {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-400">Belum ada kampanye. Yuk buat sekarang!</p>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Kampanye Berjalan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp, index) => (
          <div
            key={camp.id || index} 
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition duration-300 group"
          >
            {/* Header Gambar */}
            <div className="h-48 bg-gray-200 relative overflow-hidden">
              <img
                src={camp.image_url || "https://via.placeholder.com/400"}
                alt={camp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span
                className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full font-bold shadow-sm ${
                  camp.status === "active"
                    ? "bg-white text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {camp.status === "active" ? "AKTIF" : "TUTUP"}
              </span>
            </div>

            {/* Konten */}
            <div className="p-5">
              <h3 className="font-bold text-slate-800 text-lg truncate mb-1" title={camp.title}>
                {camp.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">
                {camp.description}
              </p>

              {/* Lokasi */}
              {camp.region && (
                <p className="text-xs text-orange-500 font-semibold mb-2 flex items-center gap-1">
                  📍 {camp.region}
                </p>
              )}

              {/* Progress Bar & Uang */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-emerald-600">
                    {formatRupiah(camp.raised_amount || 0)}
                  </span>
                  <span className="text-slate-400 text-xs">
                    Target: {formatRupiah(camp.target_amount || 0)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(
                        ((camp.raised_amount || 0) / (camp.target_amount || 1)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-4 border-t border-slate-50">
                <button
                  onClick={() => onEdit(camp)}
                  className="flex-1 py-2 px-3 bg-slate-50 text-slate-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 text-sm font-medium flex items-center justify-center gap-2 transition"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => onDelete(camp.campaign_id || camp.id)}
                  className="flex-1 py-2 px-3 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 text-sm font-medium flex items-center justify-center gap-2 transition"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}