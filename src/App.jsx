import React, { useState, useEffect } from "react";
import { adminApi } from "./service/api.js";
import {
  LayoutDashboard,
  Plus,
  Users,
  Wallet,
  Leaf,
  Trash2,
  UploadCloud,
  Loader2,
  Pencil,
  X,
} from "lucide-react";

export default function Dashboard() {
  // --- STATE MANAGEMENT ---
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonors: 0,
    activeCampaigns: 0,
  });
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Data Formulir
  const [formData, setFormData] = useState({ title: "", target: "", desc: "" });
  const [imageFile, setImageFile] = useState(null);

  // State Penting: Menyimpan ID kampanye yang sedang diedit (Null = Mode Buat Baru)
  const [editId, setEditId] = useState(null);

  // --- 1. FETCH DATA (Load Awal) ---
  const fetchData = async () => {
    try {
      setLoading(true);
      // Panggil API admin
      const dataCampaigns = await adminApi.getCampaigns();
      const dataDonations = await adminApi.getDonations();

      setCampaigns(dataCampaigns);
      setDonations(dataDonations);

      // Hitung Statistik Manual dari data yang didapat
      const totalUang = dataDonations
        .filter((d) => d.status === "paid")
        .reduce((sum, item) => sum + Number(item.amount), 0);

      setStats({
        totalRaised: totalUang,
        totalDonors: dataDonations.length,
        activeCampaigns: dataCampaigns.filter((c) => c.status === "active")
          .length,
      });
    } catch (err) {
      alert("Gagal memuat data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. LOGIKA BUKA TUTUP MODAL ---

  // Mode Buat Baru: Reset semua form jadi kosong
  const openCreateModal = () => {
    setEditId(null);
    setFormData({ title: "", target: "", desc: "" });
    setImageFile(null);
    setShowModal(true);
  };

  // Mode Edit: Isi form dengan data lama
  const openEditModal = (camp) => {
    setEditId(camp.campaign_id);
    setFormData({
      title: camp.title,
      target: camp.target_amount,
      desc: camp.description,
    });
    setImageFile(null); // Gambar dikosongkan (user cuma isi kalau mau ganti)
    setShowModal(true);
  };

  // --- 3. LOGIKA SUBMIT (CREATE & UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // Cek 1: Apakah user meng-upload gambar baru?
      if (imageFile) {
        imageUrl = await adminApi.uploadImage(imageFile);
      }

      // Siapkan data dasar yang mau dikirim ke Supabase
      const payload = {
        title: formData.title,
        description: formData.desc,
        target_amount: formData.target,
      };

      // Cek 2: Logika Gambar untuk Payload
      if (imageUrl) {
        // Kalau ada gambar baru, update kolom image_url
        payload.image_url = imageUrl;
      }

      // Cek 3: Apakah ini EDIT atau CREATE?
      if (editId) {
        // --- MODE EDIT ---
        // Panggil fungsi update (Payload hanya berisi data yang berubah)
        await adminApi.updateCampaign(editId, payload);
        alert("Perubahan berhasil disimpan!");
      } else {
        // --- MODE CREATE ---
        // Validasi: Wajib ada gambar kalau baru bikin
        if (!imageUrl)
          throw new Error("Wajib upload gambar untuk kampanye baru!");

        payload.image_url = imageUrl;
        payload.status = "active"; // Default status aktif
        await adminApi.createCampaign(payload);
        alert("Kampanye berhasil dibuat!");
      }

      // Selesai: Tutup modal & Refresh data
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert("Terjadi Kesalahan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. LOGIKA DELETE ---
  const handleDelete = async (id) => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus kampanye ini secara permanen?"
      )
    )
      return;

    try {
      await adminApi.deleteCampaign(id);
      fetchData(); // Refresh list setelah hapus
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  // Tampilan Loading
  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
          <p className="text-slate-500 font-medium">Memuat Dashboard...</p>
        </div>
      </div>
    );

  // --- TAMPILAN UTAMA (UI) ---
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Leaf className="text-emerald-600" size={24} />
          </div>
          <span className="font-bold text-xl text-slate-800">EcoAdmin</span>
        </div>
        <nav className="mt-6 px-4 space-y-2 flex-1">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg font-medium transition"
          >
            <LayoutDashboard size={20} /> Dashboard
          </a>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <p className="text-xs text-center text-slate-400">
            © 2026 EcoEducate
          </p>
        </div>
      </aside>

      {/* KONTEN UTAMA (Disebelah Sidebar) */}
      <main className="flex-1 p-8 md:ml-64 overflow-y-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 mt-1">
              Pantau perkembangan donasi dan kampanye Anda.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg transition shadow-md font-medium"
          >
            <Plus size={20} /> Buat Kampanye
          </button>
        </header>

        {/* 1. STATISTIK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Dana Terkumpul"
            value={`$${stats.totalRaised.toLocaleString()}`}
            icon={<Wallet className="text-blue-600" size={24} />}
            bg="bg-blue-50"
            text="text-blue-600"
          />
          <StatCard
            title="Total Donatur"
            value={`${stats.totalDonors} Orang`}
            icon={<Users className="text-purple-600" size={24} />}
            bg="bg-purple-50"
            text="text-purple-600"
          />
          <StatCard
            title="Kampanye Aktif"
            value={`${stats.activeCampaigns} Program`}
            icon={<Leaf className="text-emerald-600" size={24} />}
            bg="bg-emerald-50"
            text="text-emerald-600"
          />
        </div>

        {/* 2. DAFTAR KAMPANYE GRID */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Kampanye Berjalan
            </h2>
            <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              {campaigns.length} Kampanye Total
            </span>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-400">
                Belum ada kampanye. Yuk buat sekarang!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((camp) => (
                <div
                  key={camp.campaign_id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition duration-300 group"
                >
                  {/* Gambar Kampanye */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img
                      src={
                        camp.image_url || "https://via.placeholder.com/400x300"
                      }
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

                  {/* Info Kampanye */}
                  <div className="p-5">
                    <h3
                      className="font-bold text-slate-800 text-lg truncate mb-1"
                      title={camp.title}
                    >
                      {camp.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">
                      {camp.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-emerald-600">
                          ${camp.raised_amount.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-xs">
                          Target: ${camp.target_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(
                              camp.progress_percentage,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Tombol Aksi (Edit & Hapus) */}
                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                      <button
                        onClick={() => openEditModal(camp)}
                        className="flex-1 py-2 px-3 bg-slate-50 text-slate-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 text-sm font-medium flex items-center justify-center gap-2 transition"
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(camp.campaign_id)}
                        className="flex-1 py-2 px-3 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 text-sm font-medium flex items-center justify-center gap-2 transition"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. TABEL RIWAYAT DONASI */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">
              Riwayat Donasi Masuk
            </h2>
            <button className="text-sm text-emerald-600 font-medium hover:underline">
              Lihat Semua
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Donatur</th>
                  <th className="py-4 px-6">Kampanye</th>
                  <th className="py-4 px-6">Jumlah</th>
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donations.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-700">
                        {don.first_name} {don.last_name}
                      </div>
                      <div className="text-xs text-slate-400">{don.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-600 max-w-[200px] truncate">
                        {don.campaigns?.title || "Unknown Campaign"}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-emerald-600">
                        +${Number(don.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">
                      {new Date(don.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                        {don.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-8 text-center text-slate-400 text-sm"
                    >
                      Belum ada donasi yang masuk hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- MODAL POPUP (FORM CREATE / EDIT) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {editId ? "Edit Kampanye" : "Buat Kampanye Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Judul Kampanye
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Bantuan Air Bersih Desa X"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-700"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Target Dana ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">
                      $
                    </span>
                    <input
                      required
                      type="number"
                      min="1"
                      placeholder="10000"
                      className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-slate-700"
                      value={formData.target}
                      onChange={(e) =>
                        setFormData({ ...formData, target: e.target.value })
                      }
                    />
                  </div>
                </div>
                {/* Bisa tambah input lain disini kalau perlu */}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Deskripsi Lengkap
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Ceritakan detail kampanye di sini..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-slate-700 resize-none"
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Banner Kampanye{" "}
                  {editId && (
                    <span className="text-xs font-normal text-emerald-600">
                      (Biarkan kosong jika tetap)
                    </span>
                  )}
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition cursor-pointer relative group ${
                    imageFile
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50"
                  }`}
                >
                  {imageFile ? (
                    <div className="text-center">
                      <p className="text-emerald-700 font-bold text-sm truncate max-w-[200px]">
                        {imageFile.name}
                      </p>
                      <p className="text-emerald-500 text-xs mt-1">
                        Klik untuk ganti
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 group-hover:text-emerald-500 transition">
                      <UploadCloud size={32} className="mx-auto mb-2" />
                      <span className="text-sm font-medium">
                        Klik untuk upload gambar
                      </span>
                      <p className="text-xs mt-1 text-slate-300">
                        JPG, PNG, max 2MB
                      </p>
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
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transition flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      {" "}
                      <Loader2 className="animate-spin" size={18} />{" "}
                      Menyimpan...{" "}
                    </>
                  ) : editId ? (
                    "Simpan Perubahan"
                  ) : (
                    "Buat Kampanye"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Komponen Kecil untuk Kartu Statistik
function StatCard({ title, value, icon, bg, text }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition">
      <div className={`p-4 rounded-xl ${bg} ${text}`}>{icon}</div>
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}
