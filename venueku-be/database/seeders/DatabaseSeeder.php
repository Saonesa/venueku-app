<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Venue;
use App\Models\Field;
use App\Models\Booking;
use App\Models\Gallery;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Nonaktifkan pengecekan Foreign Key untuk proses truncate yang aman
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Bersihkan tabel-tabel yang akan diisi data dummy
        // Urutan truncate (pembersihan data) itu penting: dari child ke parent
        DB::table('bookings')->truncate();
        DB::table('fields')->truncate();
        DB::table('gallery')->truncate();
        DB::table('venues')->truncate();
        DB::table('users')->truncate();
        // Opsional: jika Anda ingin membersihkan tabel Laravel lainnya
        DB::table('personal_access_tokens')->truncate();
        DB::table('password_reset_tokens')->truncate();
        DB::table('failed_jobs')->truncate();

        // --- 1. Buat Data User (Superadmin, Admin/Partner, User Biasa) ---

        // Superadmin (1 user)
        $superadmin = User::create([
            'name' => 'Superadmin VenueKu',
            'email' => 'superadmin@venueku.com',
            'password' => Hash::make('password123'),
            'role' => 'superadmin',
            'phone_number' => '081211112222',
            'birth_date' => '1990-01-01',
            'gender' => 'Laki-laki',
            'location' => 'Jakarta Pusat',
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Admin/Partner (3 users)
        $adminUsers = [];
        $adminUsers[] = User::create([ // Admin 1
            'name' => 'Partner Asatu Arena',
            'email' => 'partner.asatu@venueku.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone_number' => '081333334444',
            'birth_date' => '1985-05-10',
            'gender' => 'Perempuan',
            'location' => 'Jakarta Selatan',
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $adminUsers[] = User::create([ // Admin 2
            'name' => 'Admin City Sports',
            'email' => 'partner.citysports@venueku.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone_number' => '081333335555',
            'birth_date' => '1988-08-15',
            'gender' => 'Laki-laki',
            'location' => 'Bandung',
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $adminUsers[] = User::create([ // Admin 3
            'name' => 'Admin Futsal Mania',
            'email' => 'partner.futsalmania@venueku.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone_number' => '081333336666',
            'birth_date' => '1992-03-22',
            'gender' => 'Perempuan',
            'location' => 'Jakarta Timur',
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // User Biasa (3 users)
        $regularUsers = [];
        $regularUsers[] = User::create([
            'name' => 'Pengguna Biasa 1',
            'email' => 'user1@venueku.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'phone_number' => '081777778888',
            'birth_date' => '1998-11-20',
            'gender' => 'Laki-laki',
            'location' => 'Bandung',
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $regularUsers[] = User::create([
            'name' => 'Pengguna Biasa 2',
            'email' => 'user2@venueku.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'phone_number' => '081777779999',
            'birth_date' => '1995-07-01',
            'gender' => 'Perempuan',
            'location' => 'Jakarta',
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        $regularUsers[] = User::create([
            'name' => 'Pengguna Biasa 3',
            'email' => 'user3@venueku.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'phone_number' => '081777770000',
            'birth_date' => '2000-02-29',
            'gender' => 'Laki-laki',
            'location' => 'Surabaya',
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // --- 2. Buat Data Venues & Fields per Admin ---

        // Admin 1: Partner Asatu Arena ($adminUsers[0]) mengelola 2 venue dan 3 fields total
        $venueAsatu = Venue::create([
            'name' => 'ASATU ARENA CIKINI',
            'location' => 'Jakarta Pusat',
            'sport_type' => 'Futsal',
            'min_price' => 200000,
            'max_price' => 400000,
            'image_url' => 'https://via.placeholder.com/1000x400?text=ASATU+Arena+Header',
            'description' => 'Lapangan mini soccer dan futsal premium di tengah kota Jakarta. Fasilitas lengkap dan suasana nyaman, ideal untuk pertandingan persahabatan dan turnamen kecil.',
            'address' => 'Jl. Legam no 7, RT.1/RW.8, Grogol Utara, Kebayoran Lama, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12210',
            'facilities_details' => 'Mushola, Kamar Ganti, Toilet Bersih, Kantin, Area Parkir Luas',
            'contact_instagram' => '@asatu_arena_official',
            'contact_phone' => '081234567890',
            'qris_image_url' => 'https://via.placeholder.com/200x200?text=QRIS+Asatu',
            'admin_id' => $adminUsers[0]->id,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([
            'venue_id' => $venueAsatu->id,
            'name' => 'ASATU Futsal Court A',
            'sport_type' => 'Futsal',
            'price_per_hour' => 250000,
            'opening_time' => '08:00:00',
            'closing_time' => '23:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Asatu+Futsal+A',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([
            'venue_id' => $venueAsatu->id,
            'name' => 'ASATU Mini Soccer Field B',
            'sport_type' => 'Mini Soccer',
            'price_per_hour' => 350000,
            'opening_time' => '09:00:00',
            'closing_time' => '22:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Asatu+Mini+Soccer+B',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $venueJakartaFutsal = Venue::create([
            'name' => 'Jakarta Futsal Center',
            'location' => 'Jakarta Barat',
            'sport_type' => 'Futsal',
            'min_price' => 150000,
            'max_price' => 250000,
            'image_url' => 'https://via.placeholder.com/1000x400?text=Jakarta+Futsal+Center',
            'description' => 'Pusat futsal modern di Jakarta Barat dengan fasilitas lengkap.',
            'address' => 'Jl. Raya Kebon Jeruk No. 10, Jakarta Barat',
            'facilities_details' => 'Kantin, Parkir Luas, Toilet',
            'contact_instagram' => '@jktfutsalcenter',
            'contact_phone' => '081122334455',
            'qris_image_url' => 'https://via.placeholder.com/200x200?text=QRIS+JFC',
            'admin_id' => $adminUsers[0]->id,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([ // Field ke-3 untuk Admin 1
            'venue_id' => $venueJakartaFutsal->id,
            'name' => 'Futsal Court Alpha',
            'sport_type' => 'Futsal',
            'price_per_hour' => 200000,
            'opening_time' => '10:00:00',
            'closing_time' => '22:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Futsal+Alpha',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([ // Tambahan field untuk memenuhi min 2 field per venue
            'venue_id' => $venueJakartaFutsal->id,
            'name' => 'Futsal Court Beta',
            'sport_type' => 'Futsal',
            'price_per_hour' => 210000,
            'opening_time' => '10:00:00',
            'closing_time' => '22:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Futsal+Beta',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);


        // Admin 2: Admin City Sports ($adminUsers[1]) mengelola 2 venue dan 3 fields total
        $venueSportCenter = Venue::create([
            'name' => 'City Sports Center',
            'location' => 'Bandung',
            'sport_type' => 'Badminton',
            'min_price' => 80000,
            'max_price' => 150000,
            'image_url' => 'https://via.placeholder.com/1000x400?text=City+Sports+Center+Bandung',
            'description' => 'Pusat olahraga terpadu di Bandung dengan beragam fasilitas, termasuk lapangan bulutangkis, basket, dan gym.',
            'address' => 'Jl. Olahraga No. 15, Sukajadi, Bandung, Jawa Barat 40161',
            'facilities_details' => 'Area Parkir, Kantin, Ruang Tunggu, AC di area tertentu',
            'contact_instagram' => '@citysportscenterbdg',
            'contact_phone' => '082198765432',
            'qris_image_url' => 'https://via.placeholder.com/200x200?text=QRIS+CSC',
            'admin_id' => $adminUsers[1]->id,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([
            'venue_id' => $venueSportCenter->id,
            'name' => 'Badminton Court 1',
            'sport_type' => 'Badminton',
            'price_per_hour' => 100000,
            'opening_time' => '07:00:00',
            'closing_time' => '21:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Badminton+Court+1',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([
            'venue_id' => $venueSportCenter->id,
            'name' => 'Badminton Court 2',
            'sport_type' => 'Badminton',
            'price_per_hour' => 90000,
            'opening_time' => '07:00:00',
            'closing_time' => '21:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Badminton+Court+2',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $venueBandungTennis = Venue::create([
            'name' => 'Bandung Tennis Club',
            'location' => 'Bandung',
            'sport_type' => 'Tenis',
            'min_price' => 120000,
            'max_price' => 200000,
            'image_url' => 'https://via.placeholder.com/1000x400?text=Bandung+Tennis+Club',
            'description' => 'Klub tenis premium di Bandung dengan lapangan outdoor dan indoor.',
            'address' => 'Jl. Merdeka No. 5, Bandung, Jawa Barat 40111',
            'facilities_details' => 'Shower, Loker, Pro-Shop',
            'contact_instagram' => '@bdgtennisclub',
            'contact_phone' => '081567890123',
            'qris_image_url' => 'https://via.placeholder.com/200x200?text=QRIS+BTC',
            'admin_id' => $adminUsers[1]->id,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([ // Field ke-3 untuk Admin 2
            'venue_id' => $venueBandungTennis->id,
            'name' => 'Tennis Court Main',
            'sport_type' => 'Tenis',
            'price_per_hour' => 150000,
            'opening_time' => '08:00:00',
            'closing_time' => '20:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Tennis+Main',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([ // Tambahan field untuk memenuhi min 2 field per venue
            'venue_id' => $venueBandungTennis->id,
            'name' => 'Tennis Court Practice',
            'sport_type' => 'Tenis',
            'price_per_hour' => 130000,
            'opening_time' => '08:00:00',
            'closing_time' => '20:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Tennis+Practice',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);


        // Admin 3: Admin Futsal Mania ($adminUsers[2]) mengelola 2 venue dan 3 fields total
        $venueFutsalMania = Venue::create([
            'name' => 'Futsal Mania Jakarta',
            'location' => 'Jakarta Timur',
            'sport_type' => 'Futsal',
            'min_price' => 180000,
            'max_price' => 280000,
            'image_url' => 'https://via.placeholder.com/400x250?text=Futsal+Mania',
            'description' => 'Lapangan futsal indoor yang terawat dengan baik di Jakarta Timur, sering digunakan untuk liga komunitas.',
            'address' => 'Jl. Pahlawan Revolusi No. 5, Jakarta Timur',
            'facilities_details' => 'Toilet, Wifi Gratis, Area Duduk Penonton',
            'contact_instagram' => '@futsalmania',
            'contact_phone' => '081255556666',
            'qris_image_url' => 'https://via.placeholder.com/200x200?text=QRIS+Futsal',
            'admin_id' => $adminUsers[2]->id,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([
            'venue_id' => $venueFutsalMania->id,
            'name' => 'Futsal Mania Court X',
            'sport_type' => 'Futsal',
            'price_per_hour' => 180000,
            'opening_time' => '09:00:00',
            'closing_time' => '23:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Futsal+X',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([ // Field ke-3 untuk Admin 3
            'venue_id' => $venueFutsalMania->id,
            'name' => 'Futsal Mania Court Y',
            'sport_type' => 'Futsal',
            'price_per_hour' => 200000,
            'opening_time' => '09:00:00',
            'closing_time' => '23:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Futsal+Y',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $venueSemarangMultisport = Venue::create([
            'name' => 'Semarang Multisport Arena',
            'location' => 'Semarang',
            'sport_type' => 'Multi Sport',
            'min_price' => 50000,
            'max_price' => 300000,
            'image_url' => 'https://via.placeholder.com/1000x400?text=Semarang+Multisport+Arena',
            'description' => 'Arena olahraga serbaguna di Semarang untuk berbagai jenis olahraga.',
            'address' => 'Jl. Jenderal Sudirman No. 88, Semarang, Jawa Tengah 50134',
            'facilities_details' => 'Auditorium, Ruang Serbaguna, Cafe',
            'contact_instagram' => '@smgmultisport',
            'contact_phone' => '089876543210',
            'qris_image_url' => 'https://via.placeholder.com/200x200?text=QRIS+SMA',
            'admin_id' => $adminUsers[2]->id,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([ // Tambahan field untuk memenuhi min 2 field per venue
            'venue_id' => $venueSemarangMultisport->id,
            'name' => 'Volleyball Court 1',
            'sport_type' => 'Volley',
            'price_per_hour' => 100000,
            'opening_time' => '08:00:00',
            'closing_time' => '21:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Volley+1',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([ // Field ke-2 untuk Semarang Multisport Arena (sehingga venue ini punya 2 field)
            'venue_id' => $venueSemarangMultisport->id,
            'name' => 'Basketball Court 1',
            'sport_type' => 'Basketball',
            'price_per_hour' => 120000,
            'opening_time' => '08:00:00',
            'closing_time' => '21:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Basket+1',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);


        // --- Venue yang tidak dikelola oleh admin dari seeder ini (Pastikan minimal 2 field) ---
        // Hanya satu venue yang tidak dikelola admin yang dipertahankan
        $venueBadmintonGlory = Venue::create([
            'name' => 'Badminton Glory Semarang',
            'location' => 'Semarang',
            'sport_type' => 'Badminton',
            'min_price' => 70000,
            'max_price' => 120000,
            'image_url' => 'https://via.placeholder.com/400x250?text=Badminton+Glory',
            'description' => 'Tempat latihan bulutangkis yang ideal dengan banyak lapangan tersedia, cocok untuk semua level pemain.',
            'address' => 'Jl. Raya Manyaran No. 20, Semarang, Jawa Tengah 50212',
            'facilities_details' => 'Dispenser Air Minum, Ruang Ganti Pria/Wanita',
            'contact_instagram' => '@badmintonglorysmg',
            'contact_phone' => '085712345678',
            'qris_image_url' => 'https://via.placeholder.com/200x200?text=QRIS+Bdmntn',
            'admin_id' => null, // Tidak ada admin spesifik dari seeder ini
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([
            'venue_id' => $venueBadmintonGlory->id,
            'name' => 'Badminton Glory Court A',
            'sport_type' => 'Badminton',
            'price_per_hour' => 80000,
            'opening_time' => '07:00:00',
            'closing_time' => '21:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Bdmntn+A',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Field::create([
            'venue_id' => $venueBadmintonGlory->id,
            'name' => 'Badminton Glory Court B',
            'sport_type' => 'Badminton',
            'price_per_hour' => 75000,
            'opening_time' => '07:00:00',
            'closing_time' => '21:00:00',
            'photo_url' => 'https://via.placeholder.com/300x200?text=Bdmntn+B',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);


        // --- 4. Buat Data Bookings (dengan payment_method) ---
        // Booking oleh Pengguna Biasa 1
        Booking::create([
            'user_id' => $regularUsers[0]->id,
            'field_id' => Field::where('name', 'ASATU Futsal Court A')->first()->id,
            'booking_date' => Carbon::today()->addDays(2)->format('Y-m-d'),
            'start_time' => '19:00:00',
            'end_time' => '20:00:00',
            'total_price' => 250000,
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'payment_method' => 'qris',
            'notes' => 'Penting: Mohon siapkan lapangan bersih sebelum digunakan.',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        // Booking oleh Pengguna Biasa 2
        Booking::create([
            'user_id' => $regularUsers[1]->id,
            'field_id' => Field::where('name', 'ASATU Mini Soccer Field B')->first()->id,
            'booking_date' => Carbon::today()->addDays(3)->format('Y-m-d'),
            'start_time' => '10:00:00',
            'end_time' => '11:00:00',
            'total_price' => 350000,
            'status' => 'pending',
            'payment_status' => 'pending',
            'payment_method' => 'cash',
            'notes' => 'Opsional : Siapkan rompi untuk pertandingan.',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        // Booking oleh Pengguna Biasa 3
        Booking::create([
            'user_id' => $regularUsers[2]->id,
            'field_id' => Field::where('name', 'Badminton Court 1')->first()->id,
            'booking_date' => Carbon::today()->subDays(5)->format('Y-m-d'),
            'start_time' => '15:00:00',
            'end_time' => '16:00:00',
            'total_price' => 100000,
            'status' => 'cancelled',
            'payment_status' => 'failed',
            'payment_method' => 'qris',
            'notes' => 'Opsional : Siapkan raket cadangan untuk teman.',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        // Booking oleh salah satu Admin (contoh: Partner Asatu Arena)
        Booking::create([
            'user_id' => $adminUsers[0]->id,
            'field_id' => Field::where('name', 'Futsal Court Alpha')->first()->id,
            'booking_date' => Carbon::today()->addDays(1)->format('Y-m-d'),
            'start_time' => '20:00:00',
            'end_time' => '21:00:00',
            'total_price' => 200000,
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'payment_method' => 'cash',
            'notes' => 'Penting: Pastikan lapangan sudah siap sebelum digunakan.',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        // Contoh booking tambahan dari user biasa lainnya
        Booking::create([
            'user_id' => $regularUsers[0]->id,
            'field_id' => Field::where('name', 'Badminton Court 2')->first()->id,
            'booking_date' => Carbon::today()->addDays(4)->format('Y-m-d'),
            'start_time' => '09:00:00',
            'end_time' => '10:00:00',
            'total_price' => 90000,
            'status' => 'pending',
            'payment_status' => 'pending',
            'payment_method' => 'qris',
            'notes' => 'Booking untuk pertandingan pagi.',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);


        // --- 5. Buat Data Gallery Images ---
        Gallery::create([
            'venue_id' => $venueAsatu->id,
            'image_url' => 'https://via.placeholder.com/800x600?text=Asatu+Arena+Interior+1',
            'caption' => 'Pemandangan lapangan utama Asatu Arena dari tribun',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Gallery::create([
            'venue_id' => $venueAsatu->id,
            'image_url' => 'https://via.placeholder.com/800x600?text=Asatu+Arena+Locker+Room',
            'caption' => 'Fasilitas ruang ganti yang bersih dan modern di Asatu Arena',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Gallery::create([
            'venue_id' => $venueSportCenter->id,
            'image_url' => 'https://via.placeholder.com/800x600?text=CSC+Badminton+Court+View',
            'caption' => 'Salah satu lapangan bulutangkis di City Sports Center',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Gallery::create([
            'venue_id' => $venueSportCenter->id,
            'image_url' => 'https://via.placeholder.com/800x600?text=CSC+Exterior',
            'caption' => 'Tampilan depan City Sports Center',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Gallery::create([
            'venue_id' => $venueJakartaFutsal->id,
            'image_url' => 'https://via.placeholder.com/800x600?text=JFC+Interior',
            'caption' => 'Interior lapangan di Jakarta Futsal Center',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Gallery::create([
            'venue_id' => $venueBandungTennis->id,
            'image_url' => 'https://via.placeholder.com/800x600?text=BTC+Court',
            'caption' => 'Lapangan Tenis Utama Bandung Tennis Club',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Gallery::create([
            'venue_id' => $venueFutsalMania->id,
            'image_url' => 'https://via.placeholder.com/800x600?text=FutsalMania+View',
            'caption' => 'Pemandangan dari lapangan Futsal Mania Jakarta',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Gallery::create([
            'venue_id' => $venueSemarangMultisport->id,
            'image_url' => 'https://via.placeholder.com/800x600?text=SMA+Volleyball',
            'caption' => 'Lapangan voli di Semarang Multisport Arena',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
        Gallery::create([
            'venue_id' => $venueBadmintonGlory->id,
            'image_url' => 'https://via.placeholder.com/800x600?text=Bdmntn+Glory+Interior',
            'caption' => 'Interior lapangan Badminton Glory Semarang',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Aktifkan kembali pengecekan Foreign Key
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}