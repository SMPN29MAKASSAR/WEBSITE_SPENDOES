import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const zona = searchParams.get("zona");

    // Otomatis seed data awal jika tabel masih kosong
    const count = await prisma.bonsaiBooking.count();
    if (count === 0) {
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

      await prisma.bonsaiBooking.createMany({
        data: [
          {
            kodeBooking: "BNS-2601-1001",
            tanggal: today,
            jamMulai: "08:00",
            jamSelesai: "09:30",
            kelas: "VII A",
            mataPelajaran: "IPA (Observasi Ekosistem Toga)",
            namaGuru: "Dra. Hj. Rosdiana, M.Pd.",
            nomorWa: "081234567890",
            jumlahSiswa: 32,
            zona: "Zona 1 - Taman Toga & Herbal Edukasi",
            tujuan: "Mengidentifikasi morfologi tanaman obat dan manfaat bagi kesehatan keluarga.",
            status: "DISETUJUI",
            catatanAdmin: "Disetujui. Harap jaga kebersihan area tanaman.",
          },
          {
            kodeBooking: "BNS-2601-1002",
            tanggal: today,
            jamMulai: "10:00",
            jamSelesai: "11:30",
            kelas: "VIII C",
            mataPelajaran: "Bahasa Indonesia (Puisi Alam)",
            namaGuru: "Ahmad Faisal, S.Pd.",
            nomorWa: "081398765432",
            jumlahSiswa: 35,
            zona: "Zona 3 - Gazebo Literasi & Hutan Rindang",
            tujuan: "Praktik menulis puisi dengan inspirasi suasana hijau lingkungan sekolah.",
            status: "DISETUJUI",
            catatanAdmin: "Disetujui. Jaga ketenangan agar tidak mengganggu kelas sebelah.",
          },
          {
            kodeBooking: "BNS-2601-1003",
            tanggal: tomorrow,
            jamMulai: "08:00",
            jamSelesai: "09:30",
            kelas: "IX B",
            mataPelajaran: "Prakarya (Pemilahan & Pembuatan Kompos)",
            namaGuru: "Nurhidayah, S.Pd.",
            nomorWa: "085211223344",
            jumlahSiswa: 30,
            zona: "Zona 2 - Rumah Kompos & Bank Sampah Organik",
            tujuan: "Praktik pembuatan pupuk kompos aerob dari dedaunan kering sekolah.",
            status: "MENUNGGU",
            catatanAdmin: null,
          },
        ],
      });
    }

    const where: any = {};
    if (date) where.tanggal = date;
    if (status && status !== "ALL") where.status = status;
    if (zona && zona !== "ALL") where.zona = zona;

    const bookings = await prisma.bonsaiBooking.findMany({
      where,
      orderBy: [{ tanggal: "desc" }, { jamMulai: "asc" }],
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bonsai bookings:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data booking BONSAI" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tanggal,
      jamMulai,
      jamSelesai,
      kelas,
      mataPelajaran,
      namaGuru,
      nomorWa,
      jumlahSiswa,
      zona,
      tujuan,
    } = body;

    if (
      !tanggal ||
      !jamMulai ||
      !jamSelesai ||
      !kelas ||
      !mataPelajaran ||
      !namaGuru ||
      !zona ||
      !tujuan
    ) {
      return NextResponse.json(
        { error: "Mohon lengkapi semua kolom wajib formulir booking." },
        { status: 400 }
      );
    }

    // Generate unique kode booking
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const cleanDate = tanggal.replace(/-/g, "").slice(2); // YYMMDD
    const kodeBooking = `BNS-${cleanDate}-${randomSuffix}`;

    // Cek apakah ada bentrok waktu di zona yang sama pada tanggal tersebut yang sudah disetujui
    const clash = await prisma.bonsaiBooking.findFirst({
      where: {
        tanggal,
        zona,
        status: "DISETUJUI",
        OR: [
          {
            AND: [
              { jamMulai: { lte: jamMulai } },
              { jamSelesai: { gt: jamMulai } },
            ],
          },
          {
            AND: [
              { jamMulai: { lt: jamSelesai } },
              { jamSelesai: { gte: jamSelesai } },
            ],
          },
          {
            AND: [
              { jamMulai: { gte: jamMulai } },
              { jamSelesai: { lte: jamSelesai } },
            ],
          },
        ],
      },
    });

    if (clash) {
      return NextResponse.json(
        {
          error: `Zona tersebut sudah disetujui untuk peminjaman pada jam ${clash.jamMulai} - ${clash.jamSelesai} (${clash.mataPelajaran} - ${clash.namaGuru}). Silakan pilih jam atau zona lain.`,
        },
        { status: 409 }
      );
    }

    const newBooking = await prisma.bonsaiBooking.create({
      data: {
        kodeBooking,
        tanggal,
        jamMulai,
        jamSelesai,
        kelas,
        mataPelajaran,
        namaGuru,
        nomorWa: nomorWa || null,
        jumlahSiswa: Number(jumlahSiswa) || 30,
        zona,
        tujuan,
        status: "MENUNGGU",
      },
    });

    return NextResponse.json(
      {
        message: "Permohonan booking berhasil diajukan!",
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bonsai booking:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses booking" },
      { status: 500 }
    );
  }
}
