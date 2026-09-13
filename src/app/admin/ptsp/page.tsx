"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, XCircle, Search, RefreshCw, Send } from "lucide-react";

export default function AdminPTSP() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [responseMsg, setResponseMsg] = useState("");
  const [statusVal, setStatusVal] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ptsp");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/ptsp/${selectedReq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusVal, response: responseMsg }),
      });

      if (res.ok) {
        alert("Status berhasil diperbarui!");
        setSelectedReq(null);
        fetchData();
      }
    } catch (error) {
      alert("Gagal memperbarui status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const openModal = (req: any) => {
    setSelectedReq(req);
    setStatusVal(req.status);
    setResponseMsg(req.response || "");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-jakarta text-slate-800">Layanan PTSP</h1>
          <p className="text-slate-500 mt-1">Kelola permohonan layanan terpadu satu pintu dari siswa/masyarakat.</p>
        </div>
        <button onClick={fetchData} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-2 font-medium">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">TANGGAL</th>
                <th className="px-6 py-4 font-semibold">TIKET</th>
                <th className="px-6 py-4 font-semibold">PEMOHON</th>
                <th className="px-6 py-4 font-semibold">LAYANAN</th>
                <th className="px-6 py-4 font-semibold">STATUS</th>
                <th className="px-6 py-4 font-semibold">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">Memuat data...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">Belum ada permohonan PTSP.</td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(req.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-slate-700">{req.ticketId}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{req.name}</p>
                      <p className="text-xs text-slate-500">{req.identityId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700 font-medium">{req.serviceType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        req.status === 'SELESAI' ? 'bg-emerald-100 text-emerald-700' :
                        req.status === 'DIPROSES' ? 'bg-blue-100 text-blue-700' :
                        req.status === 'DITOLAK' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status === 'SELESAI' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {req.status === 'DIPROSES' && <RefreshCw className="w-3.5 h-3.5" />}
                        {req.status === 'DITOLAK' && <XCircle className="w-3.5 h-3.5" />}
                        {req.status === 'MENUNGGU' && <Clock className="w-3.5 h-3.5" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => openModal(req)}
                        className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Proses
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Proses */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl relative animate-in zoom-in-95 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Proses Permohonan</h3>
                <p className="text-sm font-mono text-slate-500 mt-1">{selectedReq.ticketId}</p>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-white">
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Nama Pemohon</p>
                    <p className="font-semibold text-slate-800">{selectedReq.name}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">NISN / NIK</p>
                    <p className="font-semibold text-slate-800">{selectedReq.identityId}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Jenis Layanan</p>
                  <p className="font-semibold text-slate-800">{selectedReq.serviceType}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Kontak WhatsApp</p>
                  <p className="font-semibold text-slate-800">{selectedReq.contactWa}</p>
                  <a href={`https://wa.me/${selectedReq.contactWa.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline mt-1 inline-block">Hubungi via WA &rarr;</a>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Keperluan</p>
                  <p className="font-medium text-slate-700">{selectedReq.purpose}</p>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4 border-t border-slate-100 pt-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Update Status</label>
                  <select value={statusVal} onChange={e => setStatusVal(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="MENUNGGU">Menunggu</option>
                    <option value="DIPROSES">Diproses (Berkas Sedang Dikerjakan)</option>
                    <option value="SELESAI">Selesai (Siap Diambil)</option>
                    <option value="DITOLAK">Ditolak (Berkas Tidak Lengkap)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggapan / Pesan untuk Pemohon</label>
                  <textarea 
                    value={responseMsg} 
                    onChange={e => setResponseMsg(e.target.value)} 
                    rows={3} 
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                    placeholder="Misal: Surat sudah selesai dicetak, silakan ambil di loket TU dengan membawa pas foto 3x4."
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={isUpdating} className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 flex justify-center items-center gap-2">
                    {isUpdating ? "Menyimpan..." : <><Send className="w-4 h-4" /> Simpan Perubahan</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
