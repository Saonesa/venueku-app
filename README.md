# VenueKu App

**VenueKu App** adalah platform pemesanan dan manajemen fasilitas olahraga yang komprehensif, dirancang untuk memudahkan pengguna menemukan dan memesan lapangan olahraga impian mereka, sekaligus menyediakan alat manajemen yang efisien bagi pemilik atau pengelola *venue*.

## Fitur Utama

### Untuk Pengguna (User):
* **Pencarian Lapangan Populer**: Temukan lapangan olahraga yang paling banyak di-*booking* di *homepage*.
* **Daftar Venue & Lapangan**: Telusuri berbagai *venue* dan lapangan olahraga yang tersedia.
* **Detail Lapangan & Jadwal**: Lihat informasi terperinci tentang lapangan, harga per jam, jam operasional, dan periksa ketersediaan slot waktu untuk tanggal tertentu.
* **Pemesanan Online**: Pesan slot waktu yang tersedia langsung dari aplikasi.
* **Manajemen Pemesanan Saya**: Lacak semua *booking* yang telah dibuat dan status pembayaran.
* **Profil Pengguna**: Perbarui informasi profil pribadi.

### Untuk Pengelola Venue (Admin/Partner):
* **Dashboard Metrik Spesifik**: Dapatkan gambaran umum performa *venue* Anda sendiri (total *booking* hari ini, lapangan aktif, pendapatan bulan ini).
* **Manajemen Venue (CRUD)**: Tambah, edit, dan hapus informasi dasar *venue* yang Anda kelola.
* **Manajemen Lapangan (CRUD)**: Kelola setiap lapangan di *venue* Anda (nama, jenis olahraga, harga per jam, dan jam operasional).
* **Manajemen Galeri (CRUD)**: Unggah dan kelola foto-foto galeri untuk *venue* Anda.
* **Manajemen Pemesanan & Pembayaran**: Lihat, konfirmasi, batalkan *booking*, dan perbarui status pembayaran dari semua *booking* yang terkait dengan *venue* Anda.
* **Profil Admin**: Perbarui informasi profil admin.

### Untuk Superadmin:
* **Dashboard Global**: Melihat metrik, *user*, *partner*, *venue*, *field*, *booking*, dan *payment* dari seluruh platform.
* **Manajemen Pengguna (CRUD)**: Menambah, mengedit, dan menghapus akun *user* biasa.
* **Manajemen Partner (CRUD)**: Menambah, mengedit, dan menghapus akun *partner* (admin). Saat menambah *partner* baru, *superadmin* dapat membuat *venue* baru dan secara otomatis mengaitkannya dengan *partner* tersebut.

## Teknologi yang Digunakan

* **Backend**: [Laravel](https://laravel.com/) (PHP Framework)
    * RESTful API
    * Eloquent ORM
    * Laravel Sanctum untuk Autentikasi API dan Proteksi CSRF
    * `barryvdh/laravel-cors` untuk CORS
    * MySQL / MariaDB (Database)
* **Frontend**: [React.js](https://react.dev/) (JavaScript Library)
    * [Vite](https://vitejs.dev/) (Build Tool)
    * [React Router DOM](https://reactrouter.com/en/main) untuk Navigasi
    * [Tailwind CSS](https://tailwindcss.com/) untuk Styling
    * [Axios](https://axios-http.com/) untuk Permintaan HTTP
    * [react-datepicker](https://reactdatepicker.com/) untuk pemilihan tanggal

## Panduan Instalasi dan Penggunaan

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek VenueKu secara lokal di mesin Anda.

### Prasyarat
Pastikan Anda memiliki:
* PHP >= 8.1
* Composer
* Node.js & npm (atau Yarn)
* MySQL/MariaDB *database* server
* Git

### 1. Klon Repositori
Buka terminal dan klon repositori ini:
```bash
git clone https://github.com/Saonesa/venueku-app.git
cd venueku-app
```

### 2. Setup Backend (Laravel)

Navigasi ke folder *backend* dan instal *dependencies*:

```bash
cd venueku-be
composer install
```

Konfigurasi file `.env` Anda:

```bash
cp .env.example .env
php artisan key:generate
```

Edit file `.env` dan konfigurasikan detail *database* Anda serta `APP_URL`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=venueku_db # Sesuaikan nama database Anda
DB_USERNAME=root       # Sesuaikan username database Anda
DB_PASSWORD=           # Sesuaikan password database Anda

APP_URL=http://localhost:8000 # Sangat penting! Sesuaikan dengan port Laravel Anda
```

Jalankan migrasi dan seeder:

```bash
php artisan migrate --seed
```

Jalankan server pengembangan Laravel:

```bash
php artisan serve
```

Server *backend* akan berjalan di `http://localhost:8000` (atau port lain).

### 3. Setup Frontend (React)

Buka terminal baru, navigasi ke folder *frontend* dan instal *dependencies*:

```bash
cd ../venueku-fe
npm install
```

Konfigurasi file `.env` untuk *frontend*:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api # Sesuaikan dengan URL API backend Anda
```

Jalankan server pengembangan React:

```bash
npm run dev
```

Server *frontend* akan berjalan di `http://localhost:5173` (atau port lain).

### 4. Akses Aplikasi

Buka *browser* Anda dan navigasi ke:
```
http://localhost:5173
```

### Kredensial Login (dari Seeder)

Anda dapat menggunakan kredensial berikut untuk menguji berbagai *role*:

| Role            | Email                     | Password      |
|-----------------|---------------------------|---------------|
| Superadmin      | superadmin@venueku.com    | password123   |
| Admin/Partner   | partner.asatu@venueku.com | password123   |
| User Biasa      | user1@venueku.com         | password123   |


---

Terima kasih telah menggunakan **VenueKu App**! 🎉  
Untuk kontribusi atau laporan bug, silakan buat *issue* di repositori ini.
