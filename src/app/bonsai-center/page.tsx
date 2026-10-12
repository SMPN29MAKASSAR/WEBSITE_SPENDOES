"use client";

import React, { useState, useEffect } from "react";
import BonsaiHeader from "./BonsaiHeader";
import BonsaiDashboard, { BookingData } from "./BonsaiDashboard";
import BonsaiBookingForm from "./BonsaiBookingForm";
import BonsaiZoneMap from "./BonsaiZoneMap";
import BonsaiSopView from "./BonsaiSopView";
import { Sparkles, Heart } from "lucide-react";

export default function BonsaiCenterPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "booking" | "peta" | "sop">("dashboard");
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZoneForBooking, setSelectedZoneForBooking] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bonsai/booking");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Gagal memuat data booking:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: string, catatan?: string) => {
    try {
      const res = await fetch(`/api/bonsai/booking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, catatanAdmin: catatan }),
      });

      if (res.ok) {
        showToast(`Status booking berhasil diubah menjadi: ${status}`);
        await fetchBookings();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal mengubah status booking");
      }
    } catch (e) {
      alert("Terjadi kesalahan saat memperbarui status");
    }
  };

  const handleSelectZoneForBooking = (zoneName: string) => {
    setSelectedZoneForBooking(zoneName);
    setActiveTab("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookingSuccess = (newBooking: BookingData) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Booking ${newBooking.kodeBooking} berhasil diajukan!`);
  };

  const pendingCount = bookings.filter((b) => b.status === "MENUNGGU").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Tabs */}
      <BonsaiHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {loading && bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-600">
              Memuat data BONSAI CENTER...
            </p>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <BonsaiDashboard
                bookings={bookings}
                onRefresh={fetchBookings}
                onUpdateStatus={handleUpdateStatus}
                onNavigateBooking={() => {
                  setActiveTab("booking");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onNavigatePeta={() => {
                  setActiveTab("peta");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {activeTab === "booking" && (
              <BonsaiBookingForm
                initialZone={selectedZoneForBooking}
                onSuccess={handleBookingSuccess}
                onNavigateDashboard={() => {
                  setActiveTab("dashboard");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {activeTab === "peta" && (
              <BonsaiZoneMap
                bookings={bookings}
                onSelectZoneForBooking={handleSelectZoneForBooking}
              />
            )}

            {activeTab === "sop" && <BonsaiSopView />}
          </>
        )}
      </main>

      {/* Footer Khusus Halaman BONSAI CENTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 print:hidden mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              B
            </div>
            <div>
              <p className="font-bold text-slate-200">
                BONSAI CENTER &bull; UPT SPF SMPN 29 Makassar
              </p>
              <p className="text-[11px] text-slate-500">
                Bersih, Organik, Nyaman, Sehat, Asri dan Indah &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Dikelola dengan cinta untuk lingkungan hidup berkelanjutan</span>
            <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" />
          </p>
        </div>
      </footer>
    </div>
  );
}
