export interface BonsaiZone {
  id: string;
  code: string;
  nama: string;
  lokasi: string;
  kapasitas: number;
  deskripsi: string;
  fasilitas: string[];
  aturan: string[];
  mapelRekomendasi: string[];
  statusDefault: "Tersedia" | "Sedang Digunakan" | "Dalam Pemeliharaan";
  tagColor: string;
  iconName: string;
}

export const BONSAI_ZONES: BonsaiZone[] = [
  {
    id: "zona-1",
    code: "ZONA-01",
    nama: "Zona 1: Taman TOGA & Herbal Edukasi",
    lokasi: "Sayap Timur samping Laboratorium IPA",
    kapasitas: 32,
    deskripsi:
      "Taman botani berisi aneka Tanaman Obat Keluarga (TOGA) seperti jahe merah, kunyit, sirih, temu lawak, dan kumis kucing dengan label QR-Code edukasi interaktif.",
    fasilitas: [
      "Bedengan tanaman berlabel Latin & Khasiat",
      "Bangku semen melingkar berkapasitas 32 siswa",
      "Keran air bersih & wastafel cuci tangan",
      "Papan tulis / Whiteboard mini portable",
      "Tempat sampah pilah 3 warna (Organik, Anorganik, Residu)",
    ],
    aturan: [
      "Dilarang memetik bunga, daun, atau rimpang tanpa bimbingan guru pengampu.",
      "Wajib berjalan di atas jalan setapak conblock (dilarang menginjak bedengan tanah).",
      "Kembalikan alat observasi, lup, atau papan kerja ke tempat semula.",
      "Lakukan operasi LISA (Lihat Sampah Ambil) sebelum meninggalkan zona.",
    ],
    mapelRekomendasi: [
      "IPA (Biologi Tumbuhan)",
      "Prakarya (Budi Daya & Khasiat Herbal)",
      "P5 (Gaya Hidup Berkelanjutan)",
    ],
    statusDefault: "Tersedia",
    tagColor: "emerald",
    iconName: "Sprout",
  },
  {
    id: "zona-2",
    code: "ZONA-02",
    nama: "Zona 2: Rumah Kompos & Bank Sampah Organik",
    lokasi: "Area Barat Belakang Kantin Sehat Spendoes",
    kapasitas: 36,
    deskripsi:
      "Pusat pengolahan limbah organik sekolah yang dilengkapi mesin pencacah daun, tong komposter anaerob/aerob, lubang biopori, dan demoplot budidaya pupuk cair (POC).",
    fasilitas: [
      "3 Unit Bak Komposter Komunal (Kering & Basah)",
      "Alat pengaduk kompos, sekop, cangkul kecil & garu",
      "Stok EM4 & Aktivator Fermentasi Organik",
      "Wastafel sabun antiseptik & sarung tangan berkebun",
      "Timbangan digital sampah organik",
    ],
    aturan: [
      "Wajib memakai sarung tangan pelindung dan sepatu tertutup saat praktik pengomposan.",
      "Hanya sampah organik (daun kering, sisa buah) yang boleh dimasukkan ke wadah cacah.",
      "Dilarang memasukkan plastik, sterofoam, atau logam ke area pengomposan.",
      "Bersihkan alat kerja dan cuci tangan dengan sabun setelah selesai aktivitas.",
    ],
    mapelRekomendasi: [
      "IPA (Dekomposisi, Bakteri Pengurai, Siklus Karbon)",
      "Prakarya (Pengolahan Kompos & Pupuk Organik Cair)",
      "IPS (Ekonomi Lingkungan & Daur Ulang)",
      "P5 (Rekayasa dan Teknologi)",
    ],
    statusDefault: "Tersedia",
    tagColor: "amber",
    iconName: "Recycle",
  },
  {
    id: "zona-3",
    code: "ZONA-03",
    nama: "Zona 3: Gazebo Literasi & Hutan Sekolah Rindang",
    lokasi: "Koridor Tengah di bawah kanopi Pohon Trembesi",
    kapasitas: 40,
    deskripsi:
      "Area teduh berhawa sejuk alami dengan 3 unit gazebo panggung kayu, karpet rumput sintetis, rak buku mini perpustakaan alam, serta akses Wi-Fi sekolah.",
    fasilitas: [
      "3 Gazebo panggung kayu beratap ijuk/rumbia",
      "Karpet rumput sintetis bersih & nyaman",
      "Rak buku outdoor mini (Buku ensiklopedia & fiksi)",
      "Terminal stop kontak listrik portable untuk laptop/tablet",
      "Lampu taman hemat energi & Wi-Fi Spot",
    ],
    aturan: [
      "Harap lepas alas kaki sebelum menaiki gazebo kayu/karpet.",
      "Dilarang membawa makanan berkuah atau minuman berwarna pekat ke atas karpet.",
      "Jaga ketenangan suara agar suasana belajar hening dan tidak mengganggu ruang kelas lain.",
      "Kembalikan buku bacaan ke lemari literasi dalam kondisi tersusun rapi.",
    ],
    mapelRekomendasi: [
      "Bahasa Indonesia (Literasi Alam, Puisi, Menulis Cerpen)",
      "Bahasa Inggris (Outdoor Storytelling)",
      "Bimbingan Konseling (Focus Group Discussion)",
      "Seni Musik / Seni Teater",
    ],
    statusDefault: "Tersedia",
    tagColor: "teal",
    iconName: "BookOpen",
  },
  {
    id: "zona-4",
    code: "ZONA-04",
    nama: "Zona 4: Green House & Hidroponik Modern",
    lokasi: "Rooftop Sayap Kanan (Lantai 2 Agroteknologi)",
    kapasitas: 30,
    deskripsi:
      "Fasilitas budidaya sayuran modern berbasis teknologi NFT/DFT hidroponik, irigasi kabut (misting), serta pembibitan tanaman hias bernilai ekonomis.",
    fasilitas: [
      "Instalasi Hidroponik NFT/DFT 400 Lubang Tanam",
      "TDS Meter & pH Meter Digital nutrisi air",
      "Sistem pendingin Sprinkler kabut otomatis",
      "Meja semai benih rockwool & rak vertikultur",
      "Screen net anti-serangga hama",
    ],
    aturan: [
      "Pintu masuk Green House harus selalu ditutup rapat guna mencegah hama masuk.",
      "Dilarang memutar tuas pompa pipa hidroponik tanpa pendampingan instruktur.",
      "Pengecekan TDS dan pH air harus dicatat di logbook praktikum Green House.",
      "Jaga kebersihan lantai dari genangan lumut dan tumpahan nutrisi.",
    ],
    mapelRekomendasi: [
      "IPA (Kapilaritas, Fotosintesis, Nutrisi Mineral Tanaman)",
      "Matematika (Perhitungan Rasio Kepekatan & Kecepatan Alir)",
      "Prakarya (Kewirausahaan Sayur Sehat)",
      "P5 (Kewirausahaan Berbasis Pertanian Urban)",
    ],
    statusDefault: "Tersedia",
    tagColor: "green",
    iconName: "Flower2",
  },
  {
    id: "zona-5",
    code: "ZONA-05",
    nama: "Zona 5: Taman Kolam Biosfer & Akuatik",
    lokasi: "Halaman Depan Ruang Guru & Plaza Edukasi",
    kapasitas: 35,
    deskripsi:
      "Ekosistem perairan terpadu dengan kolam bio-filter berisi ikan nila dan koi, tanaman teratai, eceng gondok pengendali polutan, dan aerator bertenaga surya.",
    fasilitas: [
      "Kolam ikan biofilter berpagar kayu pembatas aman",
      "Jembatan kayu observasi perairan",
      "Bangku taman panjang rindang",
      "Papan informasi siklus biosfer & simbiosis akuatik",
      "Tempat cuci tangan air mengalir",
    ],
    aturan: [
      "Dilarang melempar kerikil, plastik, atau benda asing ke dalam kolam.",
      "Pemberian pelet makanan ikan hanya atas arahan dan izin guru pengampu.",
      "Siswa dilarang berdiri di bibir pembatas kolam demi keselamatan.",
      "Pelihara kejernihan air dan kebersihan lingkungan sekitar kolam.",
    ],
    mapelRekomendasi: [
      "IPA (Rantai Makanan, Ekosistem Air Tawar, Siklus Biologis)",
      "Seni Rupa (Sketsa & Menggambar Bentuk Lanskap)",
      "Pendidikan Agama Islam (Tadabbur Alam & Ciptaan Tuhan)",
    ],
    statusDefault: "Tersedia",
    tagColor: "sky",
    iconName: "Droplets",
  },
  {
    id: "zona-6",
    code: "ZONA-06",
    nama: "Zona 6: Amphiteater Taman & Plaza Terbuka",
    lokasi: "Pekarangan Terbuka Samping Perpustakaan Sekolah",
    kapasitas: 45,
    deskripsi:
      "Panggung berundak outdoor semi-lingkaran bertingkat dengan pemandangan pohon peneduh, cocok untuk presentasi kelompok besar, role-play, dan seminar alam.",
    fasilitas: [
      "Tribun undakan semen bertingkat berkapasitas 45 siswa",
      "Panggung presentasi outdoor dengan stop kontak",
      "Speaker wireless portable & mic",
      "Papan display pameran karya siswa",
      "Pepohonan peneduh alami rindang bebas silau",
    ],
    aturan: [
      "Jaga kebersihan undakan tribun, tidak meninggalkan coretan atau bungkus makanan.",
      "Matikan perangkat audio dan listrik setelah pembelajaran selesai.",
      "Pastikan siswa duduk dengan tertib tanpa saling dorong di tangga undakan.",
      "Segera laporkan jika terdapat daun basah yang membuat lantai licin.",
    ],
    mapelRekomendasi: [
      "PJOK (Senam Pagi, Kebugaran & Yoga Outdoor)",
      "Seni Budaya (Teater Alam, Drama & Tari)",
      "PPKn (Debat Terbuka & Simulasi Musyawarah)",
      "Pertemuan Kader Adiwiyata / OSIS",
    ],
    statusDefault: "Tersedia",
    tagColor: "indigo",
    iconName: "Users",
  },
];

export interface SopItem {
  id: string;
  kode: string;
  judul: string;
  tujuan: string;
  ruangLingkup: string;
  penanggungJawab: string;
  waktuPelaksanaan: string;
  prosedur: {
    langkah: number;
    namaLangkah: string;
    deskripsi: string;
    pelaksana: string;
  }[];
  indikatorKeberhasilan: string[];
}

export interface SopCategory {
  id: string;
  abjad: string;
  judulKategori: string;
  deskripsi: string;
  tagColor: string;
  items: SopItem[];
}

export const BONSAI_SOPS: SopCategory[] = [
  {
    id: "sop-kebersihan",
    abjad: "A",
    judulKategori: "SOP Kebersihan dan Pengelolaan Sampah",
    deskripsi:
      "Pedoman pemilahan sampah dari sumber, kebersihan area kelas dan outing, pengangkutan terjadwal, serta pengolahan sampah organik bernilai guna.",
    tagColor: "emerald",
    items: [
      {
        id: "sop-a-1",
        kode: "SOP-BNS-A.1",
        judul: "Pemilahan Sampah Terpadu 3 Warna",
        tujuan:
          "Menjamin pemisahan sampah organik, anorganik, dan residu sejak dari sumber agar memudahkan proses daur ulang dan komposting.",
        ruangLingkup: "Seluruh ruang kelas, selasar koridor, kantin, dan zona belajar outdoor.",
        penanggungJawab: "Koordinator Pokja Kebersihan & Kader Lingkungan",
        waktuPelaksanaan: "Setiap hari secara berkesinambungan",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Penyediaan Tempat Sampah Standar",
            deskripsi:
              "Menyiapkan wadah sampah 3 warna di setiap titik: Hijau (Sampah Organik/sisa makanan/daun), Kuning (Sampah Anorganik/plastik bersih/kertas), Merah/Abu (Residu/B3).",
            pelaksana: "Tim Sarana & Prasarana",
          },
          {
            langkah: 2,
            namaLangkah: "Edukasi & Pembiasaan Warga Sekolah",
            deskripsi:
              "Guru dan kader lingkungan mengarahkan siswa agar memasukkan sampah sesuai jenisnya, tidak mencampur sampah basah ke wadah anorganik.",
            pelaksana: "Guru Mata Pelajaran & Wali Kelas",
          },
          {
            langkah: 3,
            namaLangkah: "Pemeriksaan Kualitas Pemilahan",
            deskripsi:
              "Kader Adiwiyata melakukan pengecekan visual setiap istirahat untuk memastikan tidak ada kesalahan pemilahan.",
            pelaksana: "Kader Sanitasi Siswa",
          },
        ],
        indikatorKeberhasilan: [
          "Tingkat ketepatan pemilahan sampah mencapai > 90%",
          "Tidak ditemukan sampah plastik tercampur di wadah organik",
          "Wadah sampah selalu bersih dan tidak berbau",
        ],
      },
      {
        id: "sop-a-2",
        kode: "SOP-BNS-A.2",
        judul: "Kebersihan Kelas & Area Belajar Outdoor (Gerakan LISA)",
        tujuan:
          "Menciptakan ruang belajar yang higienis, rapi, dan nyaman sebelum dan sesudah kegiatan outing.",
        ruangLingkup: "Ruang kelas dan seluruh Zona Belajar BONSAI.",
        penanggungJawab: "Wali Kelas & Guru Pembimbing Outing",
        waktuPelaksanaan: "10 Menit sebelum dan sesudah pembelajaran",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Gerakan LISA (Lihat Sampah Ambil)",
            deskripsi:
              "Sebelum memulai sesi, seluruh siswa bersama guru melakukan pengecekan radius 5 meter di area zona outing.",
            pelaksana: "Siswa & Guru Pengampu",
          },
          {
            langkah: 2,
            namaLangkah: "Penataan Fasilitas Belajar",
            deskripsi:
              "Menata bangku taman, karpet gazebo, dan papan display dalam kondisi tertib dan rapi.",
            pelaksana: "Regu Piket Harian",
          },
          {
            langkah: 3,
            namaLangkah: "Pembersihan Pasca Pembelajaran",
            deskripsi:
              "Memastikan tidak ada kertas lembar kerja, bungkus alat tulis, atau dedaunan berserakan yang tertinggal pasca pembelajaran.",
            pelaksana: "Seluruh Peserta Didik",
          },
        ],
        indikatorKeberhasilan: [
          "Zona belajar dalam kondisi bersih total setelah outing selesai",
          "Fasilitas kembali ke posisi tertib semula",
        ],
      },
      {
        id: "sop-a-3",
        kode: "SOP-BNS-A.3",
        judul: "Pengangkutan Sampah Terjadwal ke TPS Sekolah",
        tujuan:
          "Mencegah penumpukan sampah yang menimbulkan bau dan sarang penyakit di lingkungan sekolah.",
        ruangLingkup: "Jalur pengangkutan dari titik kelas ke TPS dan Bank Sampah.",
        penanggungJawab: "Petugas Kebersihan Sekolah & Regu Piket",
        waktuPelaksanaan: "2 Kali Sehari: Pukul 09.30 (Istirahat I) dan Pukul 14.30 (Pulang Sekolah)",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Pengosongan Wadah Sampah",
            deskripsi:
              "Petugas membawa gerobak pilah untuk mengambil sampah dari tempat sampah tiap lantai dan zona outdoor.",
            pelaksana: "Petugas Kebersihan",
          },
          {
            langkah: 2,
            namaLangkah: "Penyortiran Ulang di TPS",
            deskripsi:
              "Sampah anorganik bernilai ekonomis (botol, kardus) disalurkan ke Bank Sampah, sedangkan residu ditempatkan di kontainer penjemputan dinas kebersihan.",
            pelaksana: "Pengelola Bank Sampah",
          },
          {
            langkah: 3,
            namaLangkah: "Pencucian Wadah Sampah",
            deskripsi:
              "Tempat sampah dicuci secara berkala setiap akhir pekan dengan disinfektan ramah lingkungan.",
            pelaksana: "Petugas Kebersihan",
          },
        ],
        indikatorKeberhasilan: [
          "Wadah sampah di kelas dan taman tidak pernah meluap",
          "TPS sekolah tertutup, bebas lalat, dan tidak mencemari lingkungan",
        ],
      },
      {
        id: "sop-a-4",
        kode: "SOP-BNS-A.4",
        judul: "Pengelolaan Sampah Organik (Komposting & Biopori)",
        tujuan:
          "Mengubah 100% sampah dedaunan dan sisa organik sekolah menjadi pupuk kompos berkualitas tinggi.",
        ruangLingkup: "Rumah Kompos (Zona 2) dan titik-titik biopori sekolah.",
        penanggungJawab: "Koordinator Rumah Kompos & Pokja Komposting",
        waktuPelaksanaan: "Senin dan Kamis pukul 08.00 - 10.00",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Pengumpulan & Pencacahan Daun",
            deskripsi:
              "Dedaunan kering dari halaman dicacah menggunakan mesin pencacah daun menjadi ukuran 1-2 cm agar cepat terdekomposisi.",
            pelaksana: "Petugas Kebersihan & Siswa Praktik",
          },
          {
            langkah: 2,
            namaLangkah: "Pencampuran & Penambahan Bio-Aktivator",
            deskripsi:
              "Bahan organik dicampur dengan larutan EM4 + molase/gula merah dengan kelembaban 50-60%, lalu dimasukkan ke dalam bak komposter aerob.",
            pelaksana: "Instruktur Kompos & Guru IPA",
          },
          {
            langkah: 3,
            namaLangkah: "Pembalikan & Pemanenan Kompos",
            deskripsi:
              "Tumpukan dibalik tiap 7 hari sekali. Pada minggu ke-3 atau ke-4 kompos yang sudah matang (warna hitam gembur, bau tanah) diayak dan dikemas untuk pupuk taman.",
            pelaksana: "Pokja Kompos Siswa",
          },
        ],
        indikatorKeberhasilan: [
          "Nol sampah daun dibakar di lingkungan sekolah",
          "Sekolah memproduksi minimal 50 kg pupuk kompos mandiri per bulan",
        ],
      },
    ],
  },
  {
    id: "sop-penghijauan",
    abjad: "B",
    judulKategori: "SOP Penghijauan dan Perawatan Tanaman",
    deskripsi:
      "Pedoman teknis pemeliharaan taman, penyiraman terjadwal, pemupukan organik, proteksi tanaman ramah lingkungan, serta peremajaan vegetasi.",
    tagColor: "green",
    items: [
      {
        id: "sop-b-1",
        kode: "SOP-BNS-B.1",
        judul: "Penyiraman Rutin Terjadwal Tanaman Sekolah",
        tujuan:
          "Menjaga kecukupan kadar air tanah dan kesegaran daun tanaman tanpa pemborosan air.",
        ruangLingkup: "Taman depan, koridor pot vertikal, Taman TOGA, dan Green House.",
        penanggungJawab: "Petugas Taman & Kader Penghijauan",
        waktuPelaksanaan:
          "Pagi: 06.45 - 07.30 WITA | Sore: 16.00 - 17.00 WITA (Hindari menyiram saat terik siang)",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Pemeriksaan Kelembaban Media Tanam",
            deskripsi:
              "Mengecek apakah tanah masih basah atau kering sebelum disiram untuk menghindari akar membusuk.",
            pelaksana: "Petugas Taman",
          },
          {
            langkah: 2,
            namaLangkah: "Penyiraman Menggunakan Nozzle Halus",
            deskripsi:
              "Menyiram pangkal tanaman secara merata menggunakan selang dengan semprotan kabut halus atau gembor air.",
            pelaksana: "Petugas Taman & Siswa Piket",
          },
          {
            langkah: 3,
            namaLangkah: "Pemanfaatan Air Daur Ulang",
            deskripsi:
              "Memprioritaskan air dari bak penampungan air hujan atau instalasi bio-filter kolam untuk menyiram taman.",
            pelaksana: "Koordinator Konservasi Air",
          },
        ],
        indikatorKeberhasilan: [
          "Semua tanaman tampak segar dan daun tidak layu",
          "Tidak ada genangan air berlebih di permukaan pot",
        ],
      },
      {
        id: "sop-b-2",
        kode: "SOP-BNS-B.2",
        judul: "Pemupukan Berkala Pupuk Kompos & Organik Cair (POC)",
        tujuan:
          "Menyediakan unsur hara makro dan mikro bagi kesuburan tanaman secara alami tanpa pupuk kimia.",
        ruangLingkup: "Seluruh tanaman di tanah langsung maupun dalam pot/polybag.",
        penanggungJawab: "Guru Pembina Tanaman & Petugas Taman",
        waktuPelaksanaan: "Setiap 14 Hari sekali (Jumat sore)",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Pemberian Kompos Padat",
            deskripsi:
              "Menggemburkan tanah permukaan pot sedalam 2 cm, lalu menambahkan 1-2 genggam pupuk kompos matang buatan sendiri.",
            pelaksana: "Petugas Taman & Kader Tanaman",
          },
          {
            langkah: 2,
            namaLangkah: "Aplikasi Pupuk Organik Cair (POC)",
            deskripsi:
              "Melarutkan 10 ml POC ke dalam 1 liter air, disemprotkan ke daun tanaman pada pagi hari saat stomata terbuka.",
            pelaksana: "Siswa Praktik Prakarya/IPA",
          },
          {
            langkah: 3,
            namaLangkah: "Pencatatan Buku Perawatan",
            deskripsi:
              "Mencatat tanggal pemupukan, jenis tanaman, dan dosis pupuk di papan monitoring tanaman.",
            pelaksana: "Ketua Kader Adiwiyata",
          },
        ],
        indikatorKeberhasilan: [
          "Pertumbuhan tunas dan daun baru berjalan subur",
          "Media tanam tetap gembur dan kaya mikroorganisme tanah",
        ],
      },
      {
        id: "sop-b-3",
        kode: "SOP-BNS-B.3",
        judul: "Pengendalian Hama & Penyakit Ramah Lingkungan",
        tujuan:
          "Melindungi tanaman dari kutu putih, ulat, dan jamur tanpa mencemari udara dan tanah dengan racun kimia.",
        ruangLingkup: "Taman bunga, Taman TOGA, dan Green House.",
        penanggungJawab: "Koordinator Konservasi Tanaman",
        waktuPelaksanaan: "Pemeriksaan rutin setiap Selasa dan penanganan situasional",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Deteksi Dini Gejala Hama",
            deskripsi:
              "Mengamati permukaan bawah daun dan pucuk tanaman dari bercak putih, jelaga, atau daun berlubang.",
            pelaksana: "Kader Lingkungan Siswa",
          },
          {
            langkah: 2,
            namaLangkah: "Pemberantasan Manual & Pemangkasan",
            deskripsi:
              "Memangkas ranting/daun yang terkena serangan hama parah lalu membuangnya ke wadah tertutup.",
            pelaksana: "Petugas Taman",
          },
          {
            langkah: 3,
            namaLangkah: "Aplikasi Pestisida Nabati (Pesnab)",
            deskripsi:
              "Menyemprotkan larutan rebusan daun mimba, serai wangi, bawang putih, dan sabun lerak organik ke bagian tanaman yang terserang.",
            pelaksana: "Petugas Taman & Guru Pembina",
          },
        ],
        indikatorKeberhasilan: [
          "Penyebaran hama terkendali tanpa menggunakan insektisida kimia berbahaya",
          "Tanaman bebas kutu putih dan serangga pengisap",
        ],
      },
      {
        id: "sop-b-4",
        kode: "SOP-BNS-B.4",
        judul: "Penggantian, Peremajaan & Penataan Lanskap Taman",
        tujuan:
          "Mempertahankan keindahan estetika lanskap sekolah dan memastikan tidak ada pot kosong atau tanaman mati.",
        ruangLingkup: "Seluruh area taman dan jalur hijau sekolah.",
        penanggungJawab: "Tim Adiwiyata & Penata Taman",
        waktuPelaksanaan: "Setiap awal bulan dan situasional bila ada tanaman rusak",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Identifikasi Tanaman Kritis",
            deskripsi:
              "Mendata tanaman yang mati, kering total, atau rusak akibat cuaca ekstrem.",
            pelaksana: "Petugas Kebersihan / Kader",
          },
          {
            langkah: 2,
            namaLangkah: "Pengambilan Bibit dari Nursery",
            deskripsi:
              "Mengambil bibit sulaman baru dari tempat pembibitan/kebun bibit mandiri sekolah.",
            pelaksana: "Tim Sarpras Taman",
          },
          {
            langkah: 3,
            namaLangkah: "Pemangkasan Bentuk (Pruning)",
            deskripsi:
              "Melakukan pemangkasan dahan pagar puring, teh-tehan, atau bougenville agar berbentuk rapi dan tidak mengganggu jalan.",
            pelaksana: "Petugas Taman",
          },
        ],
        indikatorKeberhasilan: [
          "Waktu tanggap penggantian tanaman mati maksimal 2x24 jam",
          "Penataan taman simetris, asri, dan indah dipandang",
        ],
      },
    ],
  },
  {
    id: "sop-keamanan",
    abjad: "C",
    judulKategori: "SOP Keamanan dan Kelayakan Sarana",
    deskripsi:
      "Prosedur inspeksi keselamatan sarana belajar luar ruang, perkakas berkebun, drainase anti-jentik, rak tanaman, dan mekanisme pelaporan kerusakan.",
    tagColor: "blue",
    items: [
      {
        id: "sop-c-1",
        kode: "SOP-BNS-C.1",
        judul: "Pemeriksaan Alat Kerja & Perkakas Berkebun",
        tujuan:
          "Memastikan semua peralatan aman digunakan oleh siswa dan mencegah kecelakaan kerja saat pembelajaran praktik.",
        ruangLingkup: "Gudang perkakas sarpras dan area praktik siswa.",
        penanggungJawab: "Kepala Urusan Sarana & Prasarana",
        waktuPelaksanaan: "Pengecekan setiap Senin pagi sebelum didistribusikan",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Inventarisasi Kondisi Fisik Alat",
            deskripsi:
              "Mengecek kekokohan gagang sekop, ketajaman gunting ranting, kelaikan selang air, dan ketiadaan karat berbahaya.",
            pelaksana: "Staf Sarpras",
          },
          {
            langkah: 2,
            namaLangkah: "Penyimpanan di Lemari Terkunci",
            deskripsi:
              "Alat tajam seperti gunting pangkas wajib disimpan di lemari khusus dan hanya boleh dikeluarkan atas izin guru pendamping.",
            pelaksana: "Penanggung Jawab Gudang",
          },
          {
            langkah: 3,
            namaLangkah: "Prosedur Peminjaman & Pengembalian",
            deskripsi:
              "Guru mengisi kartu peminjaman alat dan mengembalikan dalam kondisi bersih dari lumpur.",
            pelaksana: "Guru Pengampu Outing",
          },
        ],
        indikatorKeberhasilan: [
          "Zero accident (nol kecelakaan kerja) dalam penggunaan alat berkebun",
          "Alat inventaris selalu lengkap dan dalam kondisi prima",
        ],
      },
      {
        id: "sop-c-2",
        kode: "SOP-BNS-C.2",
        judul: "Pemeriksaan Saluran Air, Drainase & Bebas Jentik",
        tujuan:
          "Mencegah genangan air saat hujan deras dan memutus mata rantai perkembangbiakan nyamuk demam berdarah (Aedes aegypti).",
        ruangLingkup: "Selokan terbuka, talang atap, bak penampungan, dan kolam taman.",
        penanggungJawab: "Pokja Konservasi Air & Jumantik Sekolah",
        waktuPelaksanaan: "Pemeriksaan berkala setiap hari Jumat (Jumat Bebas Jentik)",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Pembersihan Sedimen Saluran Drainase",
            deskripsi:
              "Mengangkat endapan lumpur, pasir, dan daun gugur dari selokan agar aliran air hujan lancar menuju sumur resapan.",
            pelaksana: "Petugas Kebersihan Lingkungan",
          },
          {
            langkah: 2,
            namaLangkah: "Pemantauan Jentik Nyamuk",
            deskripsi:
              "Kader Jumantik memeriksa genangan di tatakan pot bunga, bak kontrol, dan saluran air menggunakan senter.",
            pelaksana: "Kader Jumantik Siswa",
          },
          {
            langkah: 3,
            namaLangkah: "Tebar Ikan Pemakan Jentik & Abatisasi Alami",
            deskripsi:
              "Memelihara ikan guppy/cupang di kolam terbuka atau menaburkan bubuk abate jika ada penampungan yang sulit dikuras.",
            pelaksana: "Tim UKS & Pokja Air",
          },
        ],
        indikatorKeberhasilan: [
          "Angka Bebas Jentik (ABJ) di lingkungan sekolah 100%",
          "Tidak ada genangan air yang bertahan lebih dari 30 menit setelah hujan lebat",
        ],
      },
      {
        id: "sop-c-3",
        kode: "SOP-BNS-C.3",
        judul: "Pemeriksaan Rak Tanaman Vertikal & Pot Gantung",
        tujuan:
          "Mencegah potensi bahaya pot jatuh menimpa siswa serta memastikan kekuatan struktur penyangga tanaman vertikal.",
        ruangLingkup: "Dinding hijau koridor kelas, balkon lantai 2, dan selasar sekolah.",
        penanggungJawab: "Tim Keamanan Sarpras Sekolah",
        waktuPelaksanaan: "Pengecekan struktural tiap 2 minggu sekali",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Uji Beban Rak Besi & Kawat Penggantung",
            deskripsi:
              "Memeriksa baut pengikat rak vertikal dinding, apakah terjadi kelonggaran atau korosi karat.",
            pelaksana: "Teknisi Sarpras",
          },
          {
            langkah: 2,
            namaLangkah: "Penataan Distribusi Bobot Pot",
            deskripsi:
              "Pot berat diletakkan di bagian bawah, sedangkan pot atas menggunakan wadah ringan berbasis serat sabut kelapa (coco-fiber).",
            pelaksana: "Petugas Taman",
          },
          {
            langkah: 3,
            namaLangkah: "Penguatan & Penggantian Dini",
            deskripsi:
              "Bila ditemukan tali pengait pot rapuh akibat panas matahari, segera diganti kawat baja tahan karat baru.",
            pelaksana: "Petugas Pemeliharaan",
          },
        ],
        indikatorKeberhasilan: [
          "Tidak ada insiden pot atau rak tanaman jatuh",
          "Semua instalasi tanaman vertikal terpasang kokoh dan rapi",
        ],
      },
      {
        id: "sop-c-4",
        kode: "SOP-BNS-C.4",
        judul: "Pelaporan & Perbaikan Fasilitas Lingkungan yang Rusak",
        tujuan:
          "Memberikan respon cepat perbaikan terhadap fasilitas sarana pendukung BONSAI yang mengalami kerusakan.",
        ruangLingkup: "Seluruh sarana fisik, bangku taman, pipa hidroponik, dan kran air.",
        penanggungJawab: "Koordinator Tim Reaksi Cepat Sarpras",
        waktuPelaksanaan: "Maksimal respon 1 x 24 jam setelah laporan masuk",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Pemberian Tanda Peringatan",
            deskripsi:
              "Jika fasilitas membahayakan (misal bangku patah/pipa bocor), pasang tanda 'Sedang Dalam Perbaikan / Dilarang Digunakan'.",
            pelaksana: "Petugas Keamanan / Guru Penemu",
          },
          {
            langkah: 2,
            namaLangkah: "Pengisian Tiket Pengaduan Sarana",
            deskripsi:
              "Melaporkan melalui menu Pengaduan BONSAI dengan melampirkan foto sarana yang rusak.",
            pelaksana: "Guru/Staf/Siswa Penemu Masalah",
          },
          {
            langkah: 3,
            namaLangkah: "Eksekusi Perbaikan Teknis",
            deskripsi:
              "Tim teknisi melakukan penggantian sparepart kran, pengelasan bangku, atau perbaikan instalasi.",
            pelaksana: "Teknisi Sarpras",
          },
        ],
        indikatorKeberhasilan: [
          "Kerusakan ringan ditangani dalam < 24 jam",
          "Tidak ada fasilitas rusak yang dibiarkan terbengkalai tanpa tanda peringatan",
        ],
      },
    ],
  },
  {
    id: "sop-pengawasan",
    abjad: "D",
    judulKategori: "SOP Pembagian Tugas dan Pengawasan",
    deskripsi:
      "Struktur organisasi, penetapan petugas zona, rotasi piket kelas, mekanisme serah terima (handover), dan supervisi berkala penjamin mutu lingkungan.",
    tagColor: "purple",
    items: [
      {
        id: "sop-d-1",
        kode: "SOP-BNS-D.1",
        judul: "Penetapan Petugas & Tim Penanggung Jawab Zona",
        tujuan:
          "Memastikan setiap jengkal area sekolah memiliki penanggung jawab yang jelas dalam memelihara standar BONSAI.",
        ruangLingkup: "Seluruh Zona Belajar 1 sampai dengan 6 dan koridor lingkungan.",
        penanggungJawab: "Kepala Sekolah & Ketua Tim Adiwiyata",
        waktuPelaksanaan: "Awal tahun pelajaran baru melalui Surat Keputusan (SK)",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Penerbitan SK Tim Pokja BONSAI",
            deskripsi:
              "Kepala sekolah menerbitkan SK penunjukan Koordinator Guru dan Petugas Pengampu tiap zona.",
            pelaksana: "Kepala Sekolah",
          },
          {
            langkah: 2,
            namaLangkah: "Penyusunan Rencana Kerja Zona",
            deskripsi:
              "Setiap penanggung jawab zona merancang target perawatan mingguan dan kebutuhan logistik.",
            pelaksana: "Koordinator Zona Guru",
          },
          {
            langkah: 3,
            namaLangkah: "Pemasangan Papan Informasi PIC",
            deskripsi:
              "Memasang plakat nama Guru Penanggung Jawab dan nomor kontak di gerbang masuk setiap zona belajar.",
            pelaksana: "Tim Humas & Sarpras",
          },
        ],
        indikatorKeberhasilan: [
          "Semua zona memiliki PIC yang teridentifikasi secara jelas di papan informasi",
          "Target pemeliharaan zona terlaksana sesuai kalender operasional",
        ],
      },
      {
        id: "sop-d-2",
        kode: "SOP-BNS-D.2",
        judul: "Jadwal Piket Kelas & Kader Laskar Lingkungan Siswa",
        tujuan:
          "Menanamkan karakter profil pelajar pancasila yang peduli lingkungan melalui keterlibatan aktif siswa.",
        ruangLingkup: "Pembagian tugas untuk seluruh rombel kelas VII, VIII, dan IX.",
        penanggungJawab: "Wakasek Kesiswaan & Pembina OSIS",
        waktuPelaksanaan: "Setiap hari aktif sekolah (Pagi & Siang)",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Pembagian Wilayah Binaan Kelas",
            deskripsi:
              "Setiap rombel kelas diberikan tanggung jawab taman binaan di depan selasar kelas masing-masing.",
            pelaksana: "Wali Kelas & Ketua Kelas",
          },
          {
            langkah: 2,
            namaLangkah: "Pelaksanaan Piket Siram & Bersih",
            deskripsi:
              "Regu piket siswa bertugas menyiram tanaman kelas dan memastikan lantai selasar bebas dari debu dan sampah.",
            pelaksana: "Regu Piket Harian Siswa",
          },
          {
            langkah: 3,
            namaLangkah: "Pemberian Nilai Lomba Kebersihan Rombel",
            deskripsi:
              "OSIS dan Kader Adiwiyata menilai kebersihan dan keasrian tiap kelas setiap hari Jumat secara objektif.",
            pelaksana: "Duta Lingkungan OSIS",
          },
        ],
        indikatorKeberhasilan: [
          "Partisipasi siswa dalam piket kebersihan mencapai 100%",
          "Pemberian apresiasi piala bergilir kelas terbersih tiap upacara bendera",
        ],
      },
      {
        id: "sop-d-3",
        kode: "SOP-BNS-D.3",
        judul: "Serah Terima Tugas (Handover) & Buku Logbook Harian",
        tujuan:
          "Menjaga kontinuitas pemeliharaan antar pergantian shift petugas kebersihan dan guru pengampu.",
        ruangLingkup: "Pos Pengawas Lingkungan BONSAI Center.",
        penanggungJawab: "Koordinator Lapangan Kebersihan",
        waktuPelaksanaan: "Setiap pergantian shift pukul 12.30 WITA dan akhir jam sekolah pukul 16.30 WITA",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Pengisian Lembar Logbook Harian",
            deskripsi:
              "Petugas shift pagi mencatat kondisi zona, alat yang dipinjam, dan temuan sarana yang butuh perbaikan.",
            pelaksana: "Petugas Shift Pagi",
          },
          {
            langkah: 2,
            namaLangkah: "Pemeriksaan Bersama di Lapangan",
            deskripsi:
              "Petugas shift berikutnya bersama petugas shift sebelumnya mengecek kelengkapan alat kerja dan status kebersihan.",
            pelaksana: "Petugas Shift Sore",
          },
          {
            langkah: 3,
            namaLangkah: "Penandatanganan Berita Acara Harian",
            deskripsi:
              "Kedua petugas menandatangani buku serah terima sebagai bukti tanggung jawab pekerjaan.",
            pelaksana: "Petugas Terkait & Koordinator",
          },
        ],
        indikatorKeberhasilan: [
          "Logbook harian terisi tertib 100%",
          "Tidak ada miskomunikasi antar petugas terkait tugas pemeliharaan",
        ],
      },
      {
        id: "sop-d-4",
        kode: "SOP-BNS-D.4",
        judul: "Pemeriksaan Berkala & Supervisi Penanggung Jawab (Audit Mutu)",
        tujuan:
          "Mengevaluasi keterlaksanaan standar BONSAI serta menentukan langkah perbaikan berkelanjutan.",
        ruangLingkup: "Audit menyeluruh di seluruh area sekolah.",
        penanggungJawab: "Kepala Sekolah & Tim Penjamin Mutu Pendidikan (TPMPS)",
        waktuPelaksanaan: "Setiap Senin ke-1 dan ke-3 setiap bulan",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Walkthrough Inspeksi Lapangan",
            deskripsi:
              "Kepala Sekolah bersama tim penjamin mutu berkeliling mengaudit kondisi 6 zona belajar dan sanitasi sekolah.",
            pelaksana: "Kepala Sekolah & Tim TPMPS",
          },
          {
            langkah: 2,
            namaLangkah: "Penilaian Berdasarkan Rubrik BONSAI",
            deskripsi:
              "Mengisi instrumen skor: Bersih (B), Organik (O), Nyaman (N), Sehat (S), Asri (A), dan Indah (I).",
            pelaksana: "Auditor Mutu Internal",
          },
          {
            langkah: 3,
            namaLangkah: "Rapat Evaluasi & Tindak Lanjut",
            deskripsi:
              "Membahas temuan audit dalam rapat evaluasi guru dan staf untuk menetapkan tindakan korektif.",
            pelaksana: "Dewan Guru & Manajemen Sekolah",
          },
        ],
        indikatorKeberhasilan: [
          "Rata-rata skor indeks BONSAI sekolah berada pada kategori Unggul (> 92%)",
          "Catatan rekomendasi audit tertangani dalam tenggat waktu 7 hari kerja",
        ],
      },
    ],
  },
  {
    id: "sop-pengaduan",
    abjad: "E",
    judulKategori: "SOP Pengaduan dan Penanganan Masalah",
    deskripsi:
      "Alur penanganan keluhan fasilitas lingkungan, klasifikasi urgensi masalah, penugasan teknis berkecepatan tinggi, serta audit penutupan laporan.",
    tagColor: "rose",
    items: [
      {
        id: "sop-e-1",
        kode: "SOP-BNS-E.1",
        judul: "Penerimaan & Pencatatan Laporan Masalah Lingkungan",
        tujuan:
          "Menyediakan saluran pelaporan yang mudah, transparan, dan terdata bagi seluruh warga sekolah yang menemukan kendala lingkungan.",
        ruangLingkup: "Laporan melalui formulir digital BONSAI Center maupun posko pengaduan.",
        penanggungJawab: "Admin Helpdesk BONSAI & Guru Piket",
        waktuPelaksanaan: "Setiap hari kerja (Layanan online aktif 24 jam)",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Penyampaian Laporan oleh Warga Sekolah",
            deskripsi:
              "Pelapor (guru, siswa, orang tua/tamu) mengisi form aduan atau melapor ke posko piket dengan menyebutkan lokasi dan bukti visual.",
            pelaksana: "Warga Sekolah / Pelapor",
          },
          {
            langkah: 2,
            namaLangkah: "Verifikasi & Registrasi Tiket",
            deskripsi:
              "Admin memverifikasi kebenaran laporan dan menerbitkan nomor registrasi tiket aduan (contoh: LPR-BNS-001).",
            pelaksana: "Admin Helpdesk",
          },
          {
            langkah: 3,
            namaLangkah: "Pemberitahuan Tanda Terima",
            deskripsi:
              "Sistem mengirimkan notifikasi kepada pelapor bahwa laporan telah diterima dan sedang diproses.",
            pelaksana: "Sistem Otomatis / Admin",
          },
        ],
        indikatorKeberhasilan: [
          "Semua laporan yang masuk terdata secara transparan dalam database",
          "Waktu konfirmasi penerimaan laporan < 15 menit",
        ],
      },
      {
        id: "sop-e-2",
        kode: "SOP-BNS-E.2",
        judul: "Klasifikasi Tingkat Urgensi Masalah",
        tujuan:
          "Menentukan prioritas penanganan berdasarkan tingkat risiko keselamatan, kesehatan, dan gangguan pembelajaran.",
        ruangLingkup: "Tahap skrining tiket pengaduan lingkungan.",
        penanggungJawab: "Koordinator Layanan BONSAI & Wakasek Sarpras",
        waktuPelaksanaan: "Segera saat laporan diverifikasi (< 30 menit)",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Klasifikasi Kategori Tingkat 1 (Darurat / Merah)",
            deskripsi:
              "Pipa air utama pecah, pohon patah menimpa jalur, sarang tawon/lebah berbahaya, kabel listrik terkelupas di taman, atau lantai licin berisiko jatuh. SLA Respon: < 1 Jam.",
            pelaksana: "Tim Tanggap Darurat Sarpras",
          },
          {
            langkah: 2,
            namaLangkah: "Klasifikasi Kategori Tingkat 2 (Sedang / Kuning)",
            deskripsi:
              "Kran air taman bocor menetes, tumpukan sampah daun belum terangkut, pompa hidroponik mati, bau menyengat dari bak kompos. SLA Respon: < 12 Jam.",
            pelaksana: "Petugas Pemeliharaan",
          },
          {
            langkah: 3,
            namaLangkah: "Klasifikasi Kategori Tingkat 3 (Rendah / Hijau)",
            deskripsi:
              "Cat bangku taman pudar, pot tanaman miring, kekurangan buku bacaan di gazebo literasi, label QR-code terkelupas. SLA Respon: < 48 Jam.",
            pelaksana: "Pokja Taman & Sarana",
          },
        ],
        indikatorKeberhasilan: [
          "Skrining ketepatan kategori urgensi 100% tepat sasaran",
          "Tidak ada masalah kategori darurat yang tertunda penanganannya",
        ],
      },
      {
        id: "sop-e-3",
        kode: "SOP-BNS-E.3",
        judul: "Penugasan Petugas & Tindak Lanjut Eksekusi Lapangan",
        tujuan:
          "Menerjunkan personel berkompeten dengan peralatan memadai untuk menyelesaikan permasalahan di lapangan.",
        ruangLingkup: "Zona lokasi timbulnya masalah di lingkungan sekolah.",
        penanggungJawab: "Koordinator Teknis Lapangan",
        waktuPelaksanaan: "Sesuai standar SLA tingkat urgensi masing-masing",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Penerbitan Surat Perintah Kerja (SPK)",
            deskripsi:
              "Koordinator menugaskan teknisi atau tim kebersihan terkait untuk segera menuju lokasi kejadian.",
            pelaksana: "Koordinator Teknis",
          },
          {
            langkah: 2,
            namaLangkah: "Eksekusi Penanganan Masalah",
            deskripsi:
              "Petugas melakukan perbaikan, pembersihan, atau pengamanan sesuai standar SOP keselamatan kerja.",
            pelaksana: "Petugas Lapangan Terkait",
          },
          {
            langkah: 3,
            namaLangkah: "Dokumentasi Foto Before & After",
            deskripsi:
              "Petugas mengambil foto kondisi sebelum diperbaiki dan foto kondisi sesudah perbaikan sebagai bukti kerja.",
            pelaksana: "Petugas Lapangan",
          },
        ],
        indikatorKeberhasilan: [
          "Penyelesaian masalah tepat waktu sesuai SLA",
          "Kualitas perbaikan kokoh, rapi, dan sesuai standar kelayakan",
        ],
      },
      {
        id: "sop-e-4",
        kode: "SOP-BNS-E.4",
        judul: "Penutupan Laporan, Notifikasi Pelapor & Evaluasi",
        tujuan:
          "Menutup siklus penanganan masalah, memberikan umpan balik kepada pelapor, dan mencegah masalah berulang.",
        ruangLingkup: "Sistem Administrasi Tiket & Rapat Manajemen Sarpras.",
        penanggungJawab: "Admin Helpdesk & Wakasek Sarpras",
        waktuPelaksanaan: "Maksimal 6 jam setelah perbaikan fisik selesai",
        prosedur: [
          {
            langkah: 1,
            namaLangkah: "Verifikasi Hasil Perbaikan",
            deskripsi:
              "Penanggung jawab zona mengecek kembali ke lapangan apakah masalah benar-benar tuntas.",
            pelaksana: "Koordinator Zona Terkait",
          },
          {
            langkah: 2,
            namaLangkah: "Pengiriman Umpan Balik kepada Pelapor",
            deskripsi:
              "Admin mengupdate status tiket menjadi 'SELESAI' dan mengirimkan pesan terima kasih serta foto hasil perbaikan.",
            pelaksana: "Admin Helpdesk",
          },
          {
            langkah: 3,
            namaLangkah: "Analisis Akar Masalah (Root Cause)",
            deskripsi:
              "Membahas akar penyebab masalah pada rapat koordinasi sarpras mingguan guna memperkuat tindakan preventif.",
            pelaksana: "Manajemen Sarpras & Komite Sekolah",
          },
        ],
        indikatorKeberhasilan: [
          "Tingkat kepuasan pelapor terhadap kecepatan dan kualitas solusi > 95%",
          "Pencegahan masalah serupa berulang di masa mendatang",
        ],
      },
    ],
  },
];
