"use client";
import { useEffect, useState } from "react";

export default function AdminBeritaPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [customDate, setCustomDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingPost ? `/api/posts/${editingPost.id}` : "/api/posts";
    const method = editingPost ? "PUT" : "POST";
    
    // Combine date with current time to create a valid Date object
    const createdAt = new Date(customDate).toISOString();
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, createdAt, imageUrl }),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      setImageUrl("");
      setCustomDate(new Date().toISOString().slice(0, 10));
      setEditingPost(null);
      fetchPosts();
      alert("Berita berhasil disimpan!");
    } else {
      const errorData = await res.json();
      alert(`Gagal menyimpan berita: ${errorData.error || res.statusText}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchPosts();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin - Berita (Post)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">{editingPost ? "Edit Berita" : "Tambah Berita"}</h2>
          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 border rounded-lg shadow-md">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Judul Berita</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-gray-50"
                placeholder="Masukkan judul berita"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Tanggal Berita</label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                required
                className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-gray-50"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Gambar Berita</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-gray-50"
              />
              {isUploading && <p className="text-sm text-gray-500 mt-1">Mengunggah...</p>}
              {imageUrl && (
                <div className="mt-2 relative w-32 h-32 border rounded">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                  <button 
                    type="button" 
                    onClick={() => setImageUrl("")} 
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs w-6 h-6 flex items-center justify-center"
                  >
                    X
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Konten Berita</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-gray-50"
                rows={8}
                placeholder="Isi konten berita..."
              />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              {editingPost && (
                <button type="button" onClick={() => { setEditingPost(null); setTitle(""); setContent(""); setImageUrl(""); setCustomDate(new Date().toISOString().slice(0, 10)); }} className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition font-medium">Batal</button>
              )}
              <button type="submit" disabled={isUploading} className="px-5 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition font-medium disabled:opacity-50">
                {editingPost ? "Simpan Perubahan" : "Posting Berita"}
              </button>
            </div>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Daftar Berita</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="p-5 border rounded-lg shadow-sm bg-white transition hover:shadow-md">
                {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-full h-32 object-cover rounded-md mb-3" />}
                <h3 className="font-semibold text-lg text-gray-800">{post.title}</h3>
                <p className="text-gray-600 text-sm mt-2 mb-4 line-clamp-3">{post.content}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => { 
                      setEditingPost(post); 
                      setTitle(post.title); 
                      setContent(post.content);
                      setImageUrl(post.imageUrl || "");
                      setCustomDate(new Date(post.createdAt).toISOString().slice(0, 10));
                    }}
                    className="px-4 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p className="text-gray-500">Belum ada berita yang dipublikasikan.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
