<div align="center">

# Sistem Kasir & Point of Sale (POS)
### LTen Cashier - Cafe & Resto Management System

<br/>

[![Built by fidhera](https://img.shields.io/badge/Built%20by-fidhera-E50914?style=for-the-badge&logo=github)](https://github.com/fidhera)
[![Instagram](https://img.shields.io/badge/Instagram-Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/fidhera)
[![Discord](https://img.shields.io/badge/Discord-Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/cPbJn86jM)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

<br/>

[![PHP Version](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net/)
[![Framework](https://img.shields.io/badge/Framework-Laravel%2011-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![Inertia.js](https://img.shields.io/badge/Adapter-Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Icons](https://img.shields.io/badge/Icons-Lucide%20React-F56565?style=for-the-badge)](https://lucide.dev/)

<br/>

Aplikasi Point of Sale (POS) berbasis web untuk operasional kasir cafe dan restoran. Sistem ini mencakup pemrosesan pesanan cepat, manajemen stok dan menu, program membership pelanggan dengan poin reward, kalkulasi kembalian tunai, dan pengaturan identitas struk belanja.

---

[Deskripsi](#deskripsi) • [Pembaruan Fitur Terbaru](#pembaruan-fitur-terbaru) • [Fitur Utama](#fitur-utama) • [Hak Akses Pengguna](#hak-akses-pengguna) • [Alur Kerja Transaksi](#alur-kerja-transaksi) • [Aturan Poin Loyalty](#aturan-poin-loyalty) • [Panduan Instalasi](#panduan-instalasi) • [Struktur Direktori](#struktur-direktori) • [Pengembang](#pengembang)
</div>

---

## Deskripsi

LTen Cashier dibangun untuk menggantikan pencatatan pesanan manual di meja kasir cafe dan resto yang rentan selisih stok dan antrean panjang. Antarmuka kasir dirancang satu layar (Single Page) menggunakan Inertia.js dan React, sehingga perpindahan data keranjang dan katalog menu berlangsung tanpa reload halaman.

Fokus sistem ini:
1. Pemrosesan transaksi kasir langsung dari dashboard utama dengan pencarian menu dan filter kategori.
2. Pengurangan stok otomatis saat transaksi berhasil dibayar, dengan proteksi batas kuantitas di keranjang belanja.
3. Program poin loyalitas pelanggan: setiap nominal belanja tertentu menghasilkan poin yang bisa ditukar menjadi potongan harga langsung di kasir.
4. Mode layar penuh (kiosk presentation mode) agar layar kasir terbebas dari bilah navigasi browser saat operasional toko berjalan.
5. Konfigurasi identitas toko, logo, dan teks catatan kaki struk langsung dari panel pengaturan.

---

## Pembaruan Fitur Terbaru

Berikut rincian pembaruan yang baru saja diselesaikan pada sistem:

### Mode Layar Penuh (Kiosk Mode)
- Penambahan tombol toggle layar penuh di header navigasi dan sidebar menggunakan Browser Fullscreen API.
- Tampilan kasir otomatis menyesuaikan layar monitor kasir tanpa bilah alamat peramban, cocok untuk setup monitor tetap di resto atau cafe.

### Perbaikan Tema dan Kontras Light Mode
- Penyesuaian palet warna mode terang ke tone slate netral yang tidak menyilaukan mata dan teks berkontras tinggi agar terbaca jelas di bawah pencahayaan ruangan kasir.
- Penerapan transisi CSS halus (cubic-bezier) untuk perpindahan background, border, dan teks saat mengganti mode terang dan gelap.
- Perbaikan kartu formulir penambahan aturan reward di `/rewards/create` agar mengikuti tema gelap saat mode dark aktif.

### Optimasi Kecepatan Server Lokal
- Pengaktifan multi-worker pada server PHP CLI di berkas `.env` (`PHP_CLI_SERVER_WORKERS=4`) untuk menangani request aset dan panggilan API secara paralel tanpa antrean blocking.
- Penggunaan cache untuk memuat data pengaturan toko di middleware Inertia (`shop_settings`) selama 10 menit, dengan invalidasi otomatis setiap kali ada pembaruan data toko.
- Penyesuaian session driver ke file untuk mempercepat waktu respon di lingkungan pengujian lokal.

### Metadata SEO dan PWA Kiosk
- Penambahan meta tag deskripsi lengkap, OpenGraph, Twitter card, dan tag kapabilitas aplikasi web mobile pada berkas `app.blade.php`.

---

## Fitur Utama

### 1. Panel Kasir (Point of Sale)
- Katalog menu dengan navigasi cepat per kategori dan pencarian instan berdasarkan nama menu atau kode SKU.
- Indikator sisa stok fisik pada setiap kartu menu dengan badge jumlah produk yang masuk ke keranjang.
- Perhitungan subtotal, diskon manual, diskon penukaran poin, dan grand total secara otomatis.

### 2. Metode Pembayaran dan Kembalian
- Pilihan metode bayar: Tunai (Cash), QRIS, Kartu Debit, dan Transfer Bank.
- Tombol cepat nominal uang pas dan pecahan tunai (Rp 20.000, Rp 50.000, Rp 100.000) untuk mempercepat input uang diterima.
- Kalkulasi otomatis uang kembalian dan modal popup bukti transaksi sukses beserta nomor invoice.

### 3. Program Membership dan Poin Reward
- Pilihan member pelanggan pada keranjang transaksi.
- Kotak centang penukaran poin yang otomatis menghitung potongan harga jika pelanggan memenuhi syarat batas minimal poin.
- Panel pengelolaan aturan poin di menu Loyalty untuk mengatur rasio belanja per poin, nilai konversi rupiah per poin, dan syarat minimal penukaran.

### 4. Manajemen Menu dan Kategori
- Tambah, ubah, dan hapus kategori makanan atau minuman.
- Kelola data produk mencakup nama menu, harga satuan, stok barang, SKU, kategori, dan unggah foto produk.
- Validasi stok agar kasir tidak dapat menambahkan item melebihi ketersediaan fisik di gudang/dapur.

### 5. Riwayat Transaksi Penjualan
- Rekapitulasi transaksi pesanan masuk dengan rincian nomor invoice, nama kasir, nama pelanggan, metode pembayaran, total belanja, dan tanggal transaksi.
- Filter dan pencarian riwayat transaksi berdasarkan nomor invoice atau nama pelanggan.

### 6. Pengaturan Toko dan Struk
- Pengaturan informasi outlet: nama toko, nomor telepon, alamat fisik, dan catatan kaki pada struk belanja.
- Unggah logo toko yang langsung tampil di struk dan sidebar aplikasi.

---

## Hak Akses Pengguna

| Modul / Fitur | Administrator / Kasir |
|---|:---:|
| Akses Dashboard Kasir (POS) | :white_check_mark: |
| Transaksi Penjualan & Input Pembayaran | :white_check_mark: |
| Penukaran Poin Member (Redeem) | :white_check_mark: |
| Kelola Data Kategori & Menu | :white_check_mark: |
| Input & Pembaruan Stok Produk | :white_check_mark: |
| Kelola Data Pelanggan Member | :white_check_mark: |
| Konfigurasi Aturan Poin Loyalty | :white_check_mark: |
| Lihat Riwayat Transaksi & Invoice | :white_check_mark: |
| Pengaturan Identitas Toko & Logo | :white_check_mark: |

---

## Alur Kerja Transaksi

```text
[Kasir Membuka Dashboard POS]
           │
           ▼
[Pilih Kategori / Cari Menu]
           │
           ▼
[Klik Item Menu ke Keranjang] ────> Validasi stok mencukupi
           │
           ▼
[Pilih Member Pelanggan] (Opsional)
           │
           ├── Pelanggan Terdaftar ──> Pilihan tukar poin aktif
           │                           (Jika poin >= batas minimal)
           └── Pelanggan Umum ───────> Tanpa penukaran poin
           │
           ▼
[Tentukan Metode Pembayaran]
           │
           ├── Tunai (Cash) ──> Masukkan nominal uang diterima
           │                    Sistem hitung uang kembalian
           └── Non Tunai ─────> Pembayaran pas via QRIS / Debit / Transfer
           │
           ▼
[Klik Tombol Bayar Sekarang]
           │
           ▼
[Transaksi Disimpan ke Database]
           │
           ├── Stok menu otomatis berkurang (-qty)
           ├── Poin member bertambah dari transaksi baru (+poin)
           └── Poin member terpotong jika menggunakan opsi redeem (-poin)
           │
           ▼
[Modal Sukses Muncul: No Invoice, Detail Bayar & Kembalian]
```

---

## Aturan Poin Loyalty

Sistem loyalty dikonfigurasi melalui menu Aturan Poin Reward. Berikut contoh simulasi penerapannya di meja kasir:

| Parameter Aturan | Nilai Contoh | Penjelasan |
|---|---|---|
| **Kelipatan Belanja** | Rp 10.000 | Setiap kelipatan belanja ini menghasilkan unit poin baru. |
| **Poin yang Diperoleh** | 1 Poin | Jumlah poin yang masuk ke saldo akun member setiap kelipatan belanja terpenuhi. |
| **Nilai Tukar Poin** | Rp 100 / Poin | Nilai pemotongan harga yang didapat untuk setiap 1 poin saat ditukarkan. |
| **Minimal Penukaran** | 10 Poin | Jumlah saldo poin minimal yang harus dimiliki member agar opsi redeem dapat digunakan. |

*Contoh Kasus:* Pelanggan berbelanja senilai Rp 100.000 akan memperoleh 10 poin. Di transaksi berikutnya, 10 poin tersebut dapat ditukarkan menjadi potongan harga sebesar Rp 1.000.

---

## Panduan Instalasi

### Kebutuhan Sistem

- PHP versi 8.2 atau lebih baru
- Ekstensi PHP: `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `tokenizer`
- Composer 2.x
- Node.js versi 18 atau lebih baru dan NPM
- Server MySQL (Laragon, XAMPP, atau MySQL mandiri)
- Git

---

### Langkah Menjalankan Aplikasi

1. **Kloning Repositori**
   ```bash
   git clone https://github.com/fidhera/LTen-Cashier.git
   cd LTen-Cashier
   ```

2. **Pasang Dependensi PHP & JavaScript**
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Berkas `.env`**
   Salin berkas contoh konfigurasi:
   ```bash
   cp .env.example .env
   ```
   Buka berkas `.env` dan sesuaikan koneksi database MySQL:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ltencashier
   DB_USERNAME=root
   DB_PASSWORD=

   # Konfigurasi multi-worker untuk performa lokal
   PHP_CLI_SERVER_WORKERS=4
   SESSION_DRIVER=file
   CACHE_STORE=file
   ```

4. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```

5. **Migrasi Basis Data dan Data Awal (Seeder)**
   Buat database baru bernama `ltencashier` di MySQL, lalu jalankan:
   ```bash
   php artisan migrate:fresh --seed
   ```
   Perintah ini akan menyiapkan tabel basis data, akun admin bawaan, kategori, menu contoh, dan aturan loyalty aktif.

6. **Tautkan Direktori Penyimpanan Berkas (Storage Link)**
   ```bash
   php artisan storage:link
   ```

7. **Kompilasi Aset Frontend**
   Untuk tahap pengembangan:
   ```bash
   npm run dev
   ```
   Atau untuk build produksi:
   ```bash
   npm run build
   ```

8. **Jalankan Server Lokal**
   Buka terminal terpisah dan jalankan server Laravel:
   ```bash
   php artisan serve
   ```
   Aplikasi kasir dapat diakses melalui peramban di:
   ```text
   http://127.0.0.1:8000
   ```

---

## Struktur Direktori

```text
LTen-Cashier/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── CategoryController.php    # Kelola kategori menu
│   │   │   ├── CustomerController.php    # Kelola membership pelanggan
│   │   │   ├── MenuController.php        # Kelola produk, harga, dan stok
│   │   │   ├── OrderController.php       # Riwayat transaksi dan invoice
│   │   │   ├── PosController.php         # Entrypoint utama dashboard kasir
│   │   │   ├── RewardRuleController.php  # Konfigurasi poin loyalty
│   │   │   └── SettingController.php     # Pengaturan identitas toko & struk
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php # Shared state & caching data toko
│   └── Models/
│       ├── Category.php                  # Model tabel kategori
│       ├── Customer.php                  # Model pelanggan & saldo poin
│       ├── Menu.php                      # Model menu produk
│       ├── Order.php                     # Header transaksi pesanan
│       ├── OrderItem.php                 # Rincian item menu per pesanan
│       ├── RewardRule.php                # Aturan perolehan & redeem poin
│       ├── Setting.php                   # Konfigurasi nama toko & logo
│       └── User.php                      # Model akun autentikasi
├── database/
│   ├── migrations/                       # Skema tabel basis data
│   └── seeders/                          # Data contoh menu, user, dan aturan
├── resources/
│   ├── css/
│   │   └── app.css                       # Aturan transisi tema & scrollbar
│   ├── js/
│   │   ├── Layouts/
│   │   │   └── AuthenticatedLayout.jsx   # Shell navigasi, kiosk toggle & sidebar
│   │   ├── Pages/
│   │   │   ├── Categories/               # Tampilan manajemen kategori
│   │   │   ├── Customers/                # Tampilan data pelanggan member
│   │   │   ├── Menus/                    # Tampilan kelola menu & stok
│   │   │   ├── Orders/                   # Riwayat invoice transaksi
│   │   │   ├── Rewards/                  # Konfigurasi loyalty rules
│   │   │   ├── Settings/                 # Formulir pengaturan toko
│   │   │   └── Dashboard.jsx             # Antarmuka utama kasir POS
│   │   └── app.jsx                       # Inisialisasi frontend Inertia React
│   └── views/
│       └── app.blade.php                 # Template root HTML & metadata SEO
├── routes/
│   ├── auth.php                          # Rute login & autentikasi
│   └── web.php                           # Pemetaan rute aplikasi kasir
├── .env.example                          # Template konfigurasi environment
├── .gitignore                            # Filter file rahasia dan vendor
└── composer.json                         # Dependensi PHP & Laravel
```

---

## Pengembang
Dikembangkan oleh: [Raffael Fidhera](https://instagram.com/fidhera)
