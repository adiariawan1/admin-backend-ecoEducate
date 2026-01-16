import React from "react";

export default function DonationTable({ donations }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Riwayat Donasi</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr className="font-semibold">
              <th className="py-4 px-6">Donatur</th>
              <th className="py-4 px-6">Kampanye</th>
              <th className="py-4 px-6">Jumlah</th>
              <th className="py-4 px-6">Tanggal</th>
              <th className="py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {donations.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400">
                  Belum ada donasi masuk.
                </td>
              </tr>
            ) : (
              donations.map((don) => (
                <tr key={don.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-700">
                      {don.first_name} {don.last_name}
                    </div>
                    <div className="text-xs text-slate-400">{don.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-slate-600 max-w-[200px] truncate">
                      {don.campaigns?.title || "Unknown"}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-emerald-600">
                    +${Number(don.amount).toLocaleString()}
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
                      {don.status ? don.status.toUpperCase() : "PENDING"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}