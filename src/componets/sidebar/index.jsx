import React from "react";
import { LayoutDashboard, Leaf, Image as ImageIcon } from "lucide-react";

/**

 * @param {string} activeTab 
 * @param {function} setActiveTab 
 */
export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <Leaf className="text-orange-500" size={24} />
        </div>
        <span className="font-bold text-xl text-slate-800">EcoAdmin</span>
      </div>

      {/* Menu Navigasi */}
      <nav className="mt-6 px-4 space-y-2 flex-1">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
            activeTab === "campaigns"
              ? "bg-emerald-50 text-orange-500"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <LayoutDashboard size={20} /> Donasi & Kampanye
        </button>

        <button
          onClick={() => setActiveTab("gallery")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
            activeTab === "gallery"
              ? "bg-emerald-50 text-orange-500"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <ImageIcon size={20} /> Galeri Foto
        </button>
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-slate-100">
        <p className="text-xs text-center text-slate-400">© 2026 EcoEducate</p>
      </div>
    </aside>
  );
}