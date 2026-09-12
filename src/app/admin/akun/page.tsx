"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ShieldCheck, Save, Users, Key } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ManajemenAkun() {
  const { data: session } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: "", email: "", password: "", role: "Admin Berita", name: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Peran yang tersedia
  const roles = [
    "Admin Utama",
    "Admin Berita",
    "Admin Kesiswaan",
    "Admin TU",
    "Admin Kurikulum",
    "Admin Prestasi",
    "Admin Pengaduan"
  ];

  useEffect(() => {
    // Only Admin Utama can manage accounts
    const role = (session?.user as any)?.role;
    if (role && role !== "Admin Utama") {
      router.push("/admin/dashboard");
      return;
    }
    if (role === "Admin Utama") {
      fetchData();
    }
  }, [session, router]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/akun");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return alert("Username / Email wajib diisi!");
    if (!isEditing && !formData.password) return alert("Kata sandi wajib diisi untuk akun baru!");

    const url = isEditing ? `/api/akun/${formData.id}` : "/api/akun";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Berhasil menyimpan akun!");
        resetForm();
        fetchData();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Gagal menyimpan akun.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus akun ini?")) return;
    try {
      const res = await fetch(`/api/akun/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Gagal menghapus.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ id: "", email: "", password: "", role: "Admin Berita", name: "" });
    setIsEditing(false);
  };

  if ((session?.user as any)?.role !== "Admin Utama") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-jakarta text-slate-800 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600" /> Manajemen Akun
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              {isEditing ? <Edit2 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-blue-600" />}
              {isEditing ? "Edit Akun" : "Tambah Akun Baru"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama / Pemilik Akun</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Opsional (Misal: Pak Budi)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username / Email</label>
                <input
                  type="text"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Misal: admin.berita@sekolah.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
                <input
                  type="password"
                  required={!isEditing} // Required untuk akun baru
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={isEditing ? "(Kosongkan jika tidak ingin diubah)" : "Kata Sandi..."}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hak Akses (Peran)</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  Tiap peran memiliki akses ke menu yang berbeda di dasbor admin.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 flex justify-center items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Simpan Akun
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-semibold flex items-center justify-center transition-colors"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-600" />
              Daftar Akun Admin
            </h2>

            {loading ? (
              <div className="py-10 text-center text-slate-500">Memuat data...</div>
            ) : items.length === 0 ? (
              <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                Belum ada akun yang terdaftar.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="p-5 border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-md transition-all group relative bg-white">
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setFormData({ ...item, password: "" });
                          setIsEditing(true);
                        }}
                        className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-md"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full mb-3 self-start">
                        <Key className="w-3.5 h-3.5" />
                        {item.role}
                      </span>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{item.name || "Admin"}</h3>
                      <p className="text-sm text-slate-500">{item.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
