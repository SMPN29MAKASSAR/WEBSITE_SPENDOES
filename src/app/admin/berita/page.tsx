"use client";
import { useEffect, useState } from "react";
import { Loader2, Plus, Edit2, Trash2, Search, Link as LinkIcon, DownloadCloud } from "lucide-react";

export default function AdminBeritaPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [customDate, setCustomDate] = useState(new Date().toISOString().slice(0, 10));
  const [imageUrl, setImageUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    if(Array.isArray(data)) setPosts(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        alert("Upload gagal");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAutoFetch = async () => {
    if (!externalUrl) {
      alert("Masukkan Tautan Eksternal terlebih dahulu!");
      return;
    }
    setIsFetchingMetadata(true);
    try {
      const res = await fetch(`/api/fetch-metadata?url=${encodeURIComponent(externalUrl)}`);
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.image) setImageUrl(data.image);
      if (data.description && !content) setContent(data.description);
      if (data.error) alert(data.error);
    } catch (error) {
      alert("Gagal mengambil data dari tautan eksternal.");
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingPost ? `/api/posts/${editingPost.id}` : "/api/posts";
    const method = editingPost ? "PUT" : "POST";
    
    const publishedAt = new Date(customDate).toISOString();
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title, 
        content, 
        publishedAt,
        createdAt: publishedAt,
        imageUrl,
        externalUrl
      }),
    });

    if (res.ok) {
      alert(editingPost ? "Berita diperbarui" : "Berita ditambahkan");
      setTitle("");
      setContent("");
      setImageUrl("");
      setExternalUrl("");
      setCustomDate(new Date().toISOString().slice(0, 10));
      setEditingPost(null);
      fetchPosts();
    } else {
      alert("Gagal menyimpan berita");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus berita ini?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchPosts();
    }
  };

  const editPost = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content || "");
    setImageUrl(post.imageUrl || "");
    setExternalUrl(post.externalUrl || "");
    
    const dateToUse = post.publishedAt || post.createdAt;
    setCustomDate(dateToUse ? new Date(dateToUse).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setTitle("");
    setContent("");
    setImageUrl("");
    setExternalUrl("");
    setCustomDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-jakarta text-slate-800">Kelola Berita & Informasi</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4 font-jakarta text-slate-800">
          {editingPost ? "Edit Berita" : "Tambah Berita Baru"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Judul Berita</label>
              <input
                type="text"
                className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tautan Eksternal (Opsional)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://..."
                    className="w-full border border-slate-200 p-3 pl-9 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAutoFetch}
                  disabled={isFetchingMetadata || !externalUrl}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 transition disabled:opacity-50"
                  title="Ambil Judul & Gambar dari Tautan"
                >
                  {isFetchingMetadata ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                  Auto-Fetch
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Jika diisi, pengunjung akan diarahkan ke tautan ini saat berita diklik.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal Publikasi</label>
              <input
                type="date"
                className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Isi Berita</label>
              <textarea
                className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-32"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">Isi berita bisa dikosongkan jika ini adalah berita eksternal.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Gambar Berita / Thumbnail</label>
              <div className="flex gap-4 items-end">
                {imageUrl && (
                  <div className="w-32 h-32 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                    <img src={imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {isUploading && <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1"><Loader2 className="w-4 h-4 animate-spin"/> Mengunggah...</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> {editingPost ? "Simpan Perubahan" : "Tambah Berita"}
            </button>
            {editingPost && (
              <button type="button" onClick={cancelEdit} className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-200">
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-sm">
              <th className="p-4 font-semibold text-slate-600">Thumbnail</th>
              <th className="p-4 font-semibold text-slate-600">Judul Berita</th>
              <th className="p-4 font-semibold text-slate-600">Tanggal</th>
              <th className="p-4 font-semibold text-slate-600">Eksternal</th>
              <th className="p-4 font-semibold text-slate-600 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50">
                <td className="p-4">
                  {post.imageUrl ? (
                    <div className="w-16 h-12 bg-slate-200 rounded-lg overflow-hidden">
                      <img src={post.imageUrl} alt="img" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">No Img</div>
                  )}
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-800 line-clamp-1">{post.title}</p>
                </td>
                <td className="p-4 text-sm text-slate-600">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="p-4">
                  {post.externalUrl ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded font-medium">
                      <LinkIcon className="w-3 h-3" /> Ya
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm">-</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => editPost(post)} className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">Belum ada berita.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
