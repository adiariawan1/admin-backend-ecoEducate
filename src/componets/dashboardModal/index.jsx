import React, { useState, useEffect } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";

/**
 * Modal Pintar untuk Create/Edit
 * Bisa menangani form Campaign DAN form Gallery
 */
export default function DashboardModal({
  isOpen,
  onClose,
  onSubmit, // Fungsi yang dipanggil saat submit (menerima payload & file)
  initialData = {}, // Data awal jika mode Edit
  activeTab, // 'campaigns' atau 'gallery' untuk menentukan form mana yang muncul
}) {
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    desc: "",
    region: "",
    latitude: "",
    longitude: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efek: Saat modal dibuka atau data berubah, isi form
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData.title || "",
        target: initialData.target_amount || "",
        desc: initialData.description || "",
        region: initialData.region || "",
        latitude: initialData.latitude || "",
        longitude: initialData.longitude || "",
      });
      setImageFile(null); // Reset file
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Kirim data ke Parent (index.jsx)
    await onSubmit(formData, imageFile);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  const isEditMode = !!initialData.id;
  const isCampaign = activeTab === "campaigns";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-slate-800">
            {isCampaign
              ? isEditMode
                ? "Edit Kampanye"
                : "Buat Kampanye Baru"
              : "Upload Foto Galeri"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Judul (Dipakai di Campaign & Gallery) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {isCampaign ? "Judul Kampanye" : "Judul Foto / Kegiatan"}
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Form Khusus Campaign (Target, Lokasi, Deskripsi) */}
          {isCampaign && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Target Dana ($)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none"
                    value={formData.target}
                    onChange={(e) =>
                      setFormData({ ...formData, target: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Wilayah
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Asia"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none"
                    value={formData.region}
                    onChange={(e) =>
                      setFormData({ ...formData, region: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="-6.200"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="106.816"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Deskripsi Lengkap
                </label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none resize-none"
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                ></textarea>
              </div>
            </>
          )}

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              File Foto
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center relative hover:bg-slate-50 cursor-pointer">
              {imageFile ? (
                <p className="text-emerald-700 font-bold text-sm">
                  {imageFile.name}
                </p>
              ) : (
                <div className="text-center text-slate-400">
                  <UploadCloud size={32} className="mx-auto mb-2" />
                  <span className="text-sm">Klik untuk upload</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}