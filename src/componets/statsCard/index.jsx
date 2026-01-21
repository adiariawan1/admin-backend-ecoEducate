import React from "react";
import { Wallet, Users, Leaf } from "lucide-react";


export default function StatCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <CardItem
        title="Total Dana Terkumpul"
        value={`$${stats.totalRaised.toLocaleString()}`}
        icon={<Wallet className="text-blue-600" size={24} />}
        bg="bg-blue-50"
        text="text-blue-600"
      />
      <CardItem
        title="Total Donatur"
        value={`${stats.totalDonors} Orang`}
        icon={<Users className="text-purple-600" size={24} />}
        bg="bg-purple-50"
        text="text-purple-600"
      />
      <CardItem
        title="Kampanye Aktif"
        value={`${stats.activeCampaigns} Program`}
        icon={<Leaf className="text-emerald-600" size={24} />}
        bg="bg-emerald-50"
        text="text-emerald-600"
      />
    </div>
  );
}


function CardItem({ title, value, icon, bg, text }) {
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