"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Image as ImageIcon, Layout, Target, Phone, MessageSquareWarning, Users, Trash2, Plus } from "lucide-react";

function SocialMediaEditor({ settings, onChange }: { settings: any, onChange: (key: string, val: string) => void }) {
  const [links, setLinks] = useState<any[]>(() => {
    try { return JSON.parse(settings['social_media_links'] || '[]') } catch { return [] }
  });

  const handleAdd = () => {
    const newLinks = [...links, { platform: 'Facebook', username: '', url: '' }];
    setLinks(newLinks);
    onChange('social_media_links', JSON.stringify(newLinks));
  }

  const handleUpdate = (index: number, key: string, val: string) => {
    const newLinks = [...links];
    newLinks[index][key] = val;
    setLinks(newLinks);
    onChange('social_media_links', JSON.stringify(newLinks));
  }

  const handleRemove = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
    onChange('social_media_links', JSON.stringify(newLinks));
  }

  return (
    <div className="mt-8 border-t border-slate-200 pt-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Sosial Media</h3>
          <p className="text-sm text-slate-500">Kelola tautan sosial media resmi sekolah.</p>
        </div>
        <button type="button" onClick={handleAdd} className="flex items-center gap-1 text-sm bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded hover:bg-emerald-200">
          <Plus className="w-4 h-4"/> Tambah
        </button>
      </div>
      <div className="space-y-4">
        {links.map((link, i) => (
          <div key={i} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <select value={link.platform} onChange={e => handleUpdate(i, 'platform', e.target.value)} className="p-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
              <option value="Twitter">Twitter</option>
            </select>
            <input type="text" placeholder="Username / Label (Cth: @smpn29)" value={link.username} onChange={e => handleUpdate(i, 'username', e.target.value)} className="p-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 flex-1 min-w-[150px]" />
            <input type="url" placeholder="URL (https://...)" value={link.url} onChange={e => handleUpdate(i, 'url', e.target.value)} className="p-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 flex-1 min-w-[200px]" />
            <button type="button" onClick={() => handleRemove(i)} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {links.length === 0 && <p className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-lg border border-dashed border-slate-200 text-center">Belum ada sosial media yang ditambahkan.</p>}
      </div>
    </div>
  )
}

export default function SettingsTabs({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("portal");
  const [portalFile, setPortalFile] = useState<File | null>(null);
  const [hmFile, setHmFile] = useState<File | null>(null);
  const [heroBgFile, setHeroBgFile] = useState<File | null>(null);
  const [orgFile, setOrgFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const uploadFile = async (f: File) => {
    const uploadData = new FormData();
    uploadData.append("file", f);
    const res = await fetch("/api/upload", { method: "POST", body: uploadData });
    if (res.ok) {
      const { url } = await res.json();
      return url;
    }
    throw new Error("Upload failed");
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalSettings = { ...settings };
      setIsUploading(true);

      if (portalFile) {
        try {
          finalSettings.portal_bg = await uploadFile(portalFile);
        } catch (e) {
          alert("Gagal mengunggah foto latar.");
        }
      }

      if (hmFile) {
        try {
          finalSettings.headmaster_photo = await uploadFile(hmFile);
        } catch (e) {
          alert("Gagal mengunggah foto kepala sekolah.");
        }
      }

      if (heroBgFile) {
        try {
          finalSettings.hero_bg = await uploadFile(heroBgFile);
        } catch (e) {
          alert("Gagal mengunggah banner hero.");
        }
      }

      if (orgFile) {
        try {
          finalSettings.struktur_organisasi_image = await uploadFile(orgFile);
        } catch (e) {
          alert("Gagal mengunggah struktur organisasi.");
        }
      }

      setIsUploading(false);

      // Format to array
      const settingsArray = Object.entries(finalSettings).map(([key, value]) => ({ key, value }));

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsArray),
      });

      if (res.ok) {
        alert("Pengaturan berhasil disimpan!");
        router.refresh();
      } else {
        alert("Gagal menyimpan pengaturan");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "portal", label: "Latar Portal", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "beranda", label: "Konten Utama & Sambutan", icon: <Layout className="w-4 h-4" /> },
    { id: "hero", label: "Hero & Banner", icon: <Target className="w-4 h-4" /> },
    { id: "statistik", label: "Statistik Siswa", icon: <Layout className="w-4 h-4" /> },
    { id: "visimisi", label: "Visi & Misi", icon: <Target className="w-4 h-4" /> },
    { id: "kontak", label: "Info Kontak", icon: <Phone className="w-4 h-4" /> },
    { id: "pengaduan", label: "Tips Pengaduan", icon: <MessageSquareWarning className="w-4 h-4" /> },
    { id: "organisasi", label: "Struktur Organisasi", icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? "text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50" : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="p-8">
        {activeTab === "portal" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Gambar Latar Belakang Portal</h3>
              <p className="text-sm text-slate-500 mb-6">Ubah gambar yang menjadi latar belakang pada halaman pertama.</p>
              
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Latar Baru</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setPortalFile(e.target.files?.[0] || null)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              
              {settings.portal_bg && !portalFile && (
                <div className="mt-4">
                  <p className="text-xs text-slate-500 mb-2">Latar Belakang Saat Ini:</p>
                  <img src={settings.portal_bg} alt="Portal BG" className="w-full max-w-sm rounded-lg border border-slate-200 shadow-sm" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Slogan Portal (Halaman Pertama)</label>
              <input 
                type="text" 
                value={settings['portal_slogan'] || ''}
                onChange={(e) => handleChange('portal_slogan', e.target.value)}
                placeholder="Ber-akhlak, Unggul, Mandiri, Peduli Lingkungan..."
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {activeTab === "beranda" && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Edit Teks Halaman Beranda</h3>
              <p className="text-sm text-slate-500 mb-6">Ubah teks judul dan slogan utama di beranda.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Judul Utama Beranda</label>
                  <input 
                    type="text" 
                    value={settings['hero_title'] || ''}
                    onChange={(e) => handleChange('hero_title', e.target.value)}
                    placeholder="Generasi Cerdas & Berkarakter"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teks Deskripsi / Slogan Beranda</label>
                  <textarea 
                    value={settings['hero_subtitle'] || ''}
                    onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                    rows={3}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Sambutan Kepala Sekolah</h3>
              <p className="text-sm text-slate-500 mb-6">Tampil di beranda bagian profil singkat sekolah.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kepala Sekolah</label>
                  <input 
                    type="text" 
                    value={settings['headmaster_name'] || ''}
                    onChange={(e) => handleChange('headmaster_name', e.target.value)}
                    placeholder="Nama Lengkap beserta gelar"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teks Sambutan Singkat (Quote)</label>
                  <textarea 
                    value={settings['headmaster_quote'] || ''}
                    onChange={(e) => handleChange('headmaster_quote', e.target.value)}
                    rows={4}
                    placeholder="Website ini merupakan jendela informasi..."
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Foto Kepala Sekolah</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setHmFile(e.target.files?.[0] || null)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {settings.headmaster_photo && !hmFile && (
                    <div className="mt-4">
                      <p className="text-xs text-slate-500 mb-2">Foto Saat Ini:</p>
                      <img src={settings.headmaster_photo} alt="Kepsek" className="w-32 h-auto rounded-lg border border-slate-200 shadow-sm" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        
        {activeTab === "hero" && (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Pengaturan Hero & Banner</h3>
            <p className="text-sm text-slate-500 mb-6">Kelola area utama (Hero) yang pertama kali dilihat pengunjung di beranda.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Banner Informasi Kecil (Misal: PPDB)</label>
                <input 
                  type="text" 
                  value={settings['hero_banner_text'] || ''}
                  onChange={(e) => handleChange('hero_banner_text', e.target.value)}
                  placeholder="Contoh: Penerimaan Peserta Didik Baru Telah Dibuka!"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Utama (Headline)</label>
                <input 
                  type="text" 
                  value={settings['hero_title'] || ''}
                  onChange={(e) => handleChange('hero_title', e.target.value)}
                  placeholder="Membangun Masa Depan Generasi Cerdas & Berkarakter"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sub-headline (Penjelasan Singkat)</label>
                <textarea 
                  value={settings['hero_subtitle'] || ''}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                  rows={3}
                  placeholder="UPT SPF SMPN 29 Makassar..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teks Tombol Aksi 1</label>
                  <input 
                    type="text" 
                    value={settings['hero_cta1_text'] || ''}
                    onChange={(e) => handleChange('hero_cta1_text', e.target.value)}
                    placeholder="Kenali Lebih Dekat"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link Tombol Aksi 1</label>
                  <input 
                    type="text" 
                    value={settings['hero_cta1_link'] || ''}
                    onChange={(e) => handleChange('hero_cta1_link', e.target.value)}
                    placeholder="/tentang"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teks Tombol Aksi 2</label>
                  <input 
                    type="text" 
                    value={settings['hero_cta2_text'] || ''}
                    onChange={(e) => handleChange('hero_cta2_text', e.target.value)}
                    placeholder="Info Pendaftaran"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link Tombol Aksi 2</label>
                  <input 
                    type="text" 
                    value={settings['hero_cta2_link'] || ''}
                    onChange={(e) => handleChange('hero_cta2_link', e.target.value)}
                    placeholder="/ppdb"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">Foto Background Hero</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setHeroBgFile(e.target.files?.[0] || null)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {settings.hero_bg && !heroBgFile && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2">Foto Banner Saat Ini:</p>
                    <img src={settings.hero_bg} alt="Hero BG" className="w-64 h-auto rounded-lg border border-slate-200 shadow-sm" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "statistik" && (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Statistik Jumlah Siswa</h3>
            <p className="text-sm text-slate-500 mb-6">Atur jumlah siswa laki-laki dan perempuan per tingkatan. Total akan dikalkulasi otomatis dan ditampilkan di beranda.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">Kelas 7</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Laki-laki</label>
                    <input type="number" value={settings['siswa_k7_l'] || '0'} onChange={(e) => handleChange('siswa_k7_l', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Perempuan</label>
                    <input type="number" value={settings['siswa_k7_p'] || '0'} onChange={(e) => handleChange('siswa_k7_p', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">Kelas 8</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Laki-laki</label>
                    <input type="number" value={settings['siswa_k8_l'] || '0'} onChange={(e) => handleChange('siswa_k8_l', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Perempuan</label>
                    <input type="number" value={settings['siswa_k8_p'] || '0'} onChange={(e) => handleChange('siswa_k8_p', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">Kelas 9</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Laki-laki</label>
                    <input type="number" value={settings['siswa_k9_l'] || '0'} onChange={(e) => handleChange('siswa_k9_l', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Perempuan</label>
                    <input type="number" value={settings['siswa_k9_p'] || '0'} onChange={(e) => handleChange('siswa_k9_p', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "visimisi" && (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Edit Visi & Misi Sekolah</h3>
            <p className="text-sm text-slate-500 mb-6">Teks ini akan ditampilkan pada halaman Profil Sekolah.</p>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teks Visi</label>
              <textarea 
                value={settings['visi_teks'] || ''}
                onChange={(e) => handleChange('visi_teks', e.target.value)}
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teks Misi (Pisahkan dengan baris baru untuk setiap poin)</label>
              <textarea 
                value={settings['misi_teks'] || ''}
                onChange={(e) => handleChange('misi_teks', e.target.value)}
                rows={8}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {activeTab === "kontak" && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Informasi Kontak & Sosial Media</h3>
            <p className="text-sm text-slate-500 mb-6">Digunakan di halaman Kontak dan Footer.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea 
                  value={settings['school_address'] || ''}
                  onChange={(e) => handleChange('school_address', e.target.value)}
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon</label>
                <input 
                  type="text" 
                  value={settings['school_phone'] || ''}
                  onChange={(e) => handleChange('school_phone', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="text" 
                  value={settings['school_email'] || ''}
                  onChange={(e) => handleChange('school_email', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Website</label>
                <input 
                  type="text" 
                  value={settings['school_website'] || ''}
                  onChange={(e) => handleChange('school_website', e.target.value)}
                  placeholder="smpn29makassar.sch.id"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp (Contoh: 62812...)</label>
                <input 
                  type="text" 
                  value={settings['school_whatsapp'] || ''}
                  onChange={(e) => handleChange('school_whatsapp', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="md:col-span-2 mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">URL Google Maps (URL Embed Peta)</label>
                <p className="text-xs text-slate-500 mb-2">Buka Google Maps &gt; Cari Sekolah &gt; Bagikan &gt; Sematkan Peta &gt; Salin isi dari atribut <code className="bg-slate-100 px-1 rounded">src="..."</code></p>
                <input 
                  type="text" 
                  value={settings['maps_embed_url'] || ''}
                  onChange={(e) => handleChange('maps_embed_url', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-2 mt-8">Jam Operasional</h3>
            <p className="text-sm text-slate-500 mb-6">Waktu pelayanan kantor untuk ditampilkan di halaman kontak.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Senin - Kamis</label>
                <input 
                  type="text" 
                  value={settings['jam_senin_kamis'] || ''}
                  onChange={(e) => handleChange('jam_senin_kamis', e.target.value)}
                  placeholder="08:00 - 16:00 WITA"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jumat</label>
                <input 
                  type="text" 
                  value={settings['jam_jumat'] || ''}
                  onChange={(e) => handleChange('jam_jumat', e.target.value)}
                  placeholder="08:00 - 16:30 WITA"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sabtu & Minggu</label>
                <input 
                  type="text" 
                  value={settings['jam_sabtu_minggu'] || ''}
                  onChange={(e) => handleChange('jam_sabtu_minggu', e.target.value)}
                  placeholder="Libur / Tutup"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <SocialMediaEditor settings={settings} onChange={handleChange} />
          </div>
        )}

        {activeTab === "pengaduan" && (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Tips Menyampaikan Pengaduan</h3>
            <p className="text-sm text-slate-500 mb-6">Tampil di sebelah kiri formulir Buat/Lacak Pengaduan Publik. Pisahkan setiap tips dengan baris baru (Enter).</p>
            
            <div>
              <textarea 
                value={settings['pengaduan_tips'] || ''}
                onChange={(e) => handleChange('pengaduan_tips', e.target.value)}
                rows={10}
                placeholder={"Sampaikan laporan secara jelas.\nPilih kategori yang paling sesuai.\nSertakan nomor WhatsApp."}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {activeTab === "organisasi" && (
          <div className="space-y-6 max-w-4xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Bagan Struktur Organisasi</h3>
            <p className="text-sm text-slate-500 mb-6">Gambar ini akan ditampilkan pada menu Profil &gt; Struktur Organisasi.</p>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Gambar Struktur Organisasi</label>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {orgFile ? (
                  <img src={URL.createObjectURL(orgFile)} alt="Preview Baru" className="w-64 h-auto object-contain rounded-lg border border-slate-200 shadow-sm" />
                ) : settings['struktur_organisasi_image'] ? (
                  <img src={settings['struktur_organisasi_image'].includes('i.ibb.co') ? `https://images.weserv.nl/?url=${encodeURIComponent(settings['struktur_organisasi_image'].replace('https://', ''))}` : settings['struktur_organisasi_image']} alt="Struktur Organisasi" className="w-64 h-auto object-contain rounded-lg border border-slate-200 shadow-sm" />
                ) : null}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setOrgFile(e.target.files?.[0] || null)} 
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100">
          <button 
            onClick={handleSave} 
            disabled={loading || isUploading}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50"
          >
            {(loading || isUploading) ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isUploading ? "Mengunggah..." : loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
