import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";

import { adminApi } from "./service/api";
import Sidebar from "./componets/sidebar/index.jsx";
import StatCards from "./componets/statsCard/index.jsx";
import CampaignList from "./componets/campaignList/index.jsx";
import DonationTable from "./componets/donationTables/index.jsx";
import GalleryGrid from "./componets/galleryGrid/index.jsx";
import DashboardModal from "./componets/dashboardModal/index.jsx";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});

  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonors: 0,
    activeCampaigns: 0,
  });
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [dataCampaigns, dataDonations, dataGallery] = await Promise.all([
        adminApi.getCampaigns(),
        adminApi.getDonations(),
        adminApi.getGallery(),
      ]);

      setCampaigns(dataCampaigns);
      setDonations(dataDonations);
      setGalleryItems(dataGallery);

      // Calculate Statistics
      const totalRaised = dataDonations
        .filter((d) => d.status === "paid")
        .reduce((sum, item) => sum + Number(item.amount), 0);

      const activeCampaignCount = dataCampaigns.filter(
        (c) => c.status === "active"
      ).length;

      setStats({
        totalRaised,
        totalDonors: dataDonations.length,
        activeCampaigns: activeCampaignCount,
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

  // --- HANDLERS ---
  const handleCreate = () => {
    setEditData({});
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    // 1. Cek apakah ID masuk?
    console.log("Mencoba menghapus ID:", id, "Tipe:", type);

    if (!id) {
        alert("Error: ID tidak ditemukan!");
        return;
    }

    if (!confirm("Yakin ingin menghapus item ini?")) return;

    try {
        if (type === "campaign") {
            console.log("Mengirim request hapus campaign..."); // Log ini
            await adminApi.deleteCampaign(id);
        } else {
            console.log("Mengirim request hapus gallery..."); // Log ini
            await adminApi.deleteGalleryItem(id);
        }
        
        console.log("Berhasil menghapus, refresh data...");
        fetchData(); // Refresh data setelah hapus
        alert("Berhasil dihapus!"); // Beri notifikasi sukses

    } catch (err) {
        console.error("Error Detail:", err); // Lihat detail error di Console (F12)
        alert("Gagal menghapus: " + err.message);
    }
};

  const handleFormSubmit = async (formData, imageFile) => {
    try {
      let imageUrl = null;

      if (imageFile) {
        imageUrl = await adminApi.uploadImage(imageFile);
      }

      if (activeTab === "campaigns") {
        const payload = {
          title: formData.title,
          description: formData.desc,
          target_amount: formData.target,
          region: formData.region,
          latitude: formData.latitude,
          longitude: formData.longitude,
        };

        if (imageUrl) {
          payload.image_url = imageUrl;
        }

        if (editData.id) {
          await adminApi.updateCampaign(editData.id, payload);
          alert("Berhasil diperbarui!");
        } else {
          if (!imageUrl) throw new Error("Gambar wajib!");
          payload.status = "active";
          await adminApi.createCampaign(payload);
          alert("Berhasil dibuat!");
        }
      } else {
        // Gallery
        if (!imageUrl) throw new Error("Foto wajib!");
        await adminApi.createGalleryItem({
          title: formData.title,
          image_url: imageUrl,
        });
        alert("Foto diupload!");
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8 md:ml-64 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {activeTab === "campaigns"
                ? "Dashboard Donasi"
                : "Manajemen Galeri"}
            </h1>
            <p className="text-slate-500">Selamat datang kembali, Admin.</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md"
          >
            <Plus size={20} />
            {activeTab === "campaigns" ? "Buat Kampanye" : "Upload Foto"}
          </button>
        </header>

        {activeTab === "campaigns" ? (
          <>
            <StatCards stats={stats} />
            <CampaignList
              campaigns={campaigns}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete(id, "campaign")}
            />
            <DonationTable donations={donations} />
          </>
        ) : (
          <GalleryGrid
            items={galleryItems}
            onDelete={(id) => handleDelete(id, "gallery")}
          />
        )}
      </main>

      <DashboardModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleFormSubmit}
        initialData={editData}
        activeTab={activeTab}
      />
    </div>
  );
}