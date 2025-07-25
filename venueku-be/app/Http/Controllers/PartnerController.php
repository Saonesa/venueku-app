<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Venue; // Penting: Import model Venue untuk membuat/mengaitkan venue
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class PartnerController extends Controller
{
    /**
     * Display a listing of partners (users with role 'admin').
     * Mengimplementasikan paginasi dan sorting dari terbaru, dengan eager loading managed venues.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10); // Jumlah item per halaman
        $page = $request->query('page', 1);       // Ambil halaman dari query param, default 1

        $partners = User::where('role', 'admin')
                        ->with('managedVenues') // Eager load relasi managedVenues
                        ->orderBy('created_at', 'desc') // Urutkan dari terbaru ke terlama
                        ->paginate($perPage, ['*'], 'page', $page); // Menggunakan paginasi

        // Format data untuk frontend (sudah termasuk data paginasi dari paginate())
        // Relasi managedVenues akan otomatis ada di setiap objek partner
        $formattedPartners = $partners->through(function($partner) {
            return [
                'id' => $partner->id,
                'name' => $partner->name,
                'email' => $partner->email,
                // Mengambil nama venue dari relasi managedVenues
                // Asumsi: satu admin mengelola satu atau beberapa venue, kita ambil yang pertama atau list semua
                'venue_names' => $partner->managedVenues->pluck('name')->toArray(), // Mengambil array nama venue
                'role' => $partner->role,
                'phone_number' => $partner->phone_number,
                'birth_date' => $partner->birth_date ? Carbon::parse($partner->birth_date)->format('Y-m-d') : null,
                'gender' => $partner->gender,
                'location' => $partner->location,
            ];
        });

        // paginate() sudah mengembalikan struktur yang benar dengan 'data', 'current_page', dll.
        // kita hanya perlu mengganti koleksi 'data' dengan yang sudah diformat.
        return Response::json($formattedPartners, 200);
    }

    /**
     * Store a newly created partner (user with role 'admin') and a new Venue for them.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'venueName' => 'required|string|max:255|unique:venues,name', // Venue name wajib dan harus unik
            ]);

            // Buat partner (user dengan role 'admin')
            $partner = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role' => 'admin', // Hardcode role sebagai 'admin'
            ]);

            // Buat venue baru dan kaitkan dengan admin_id dari partner yang baru dibuat
            Venue::create([
                'name' => $validatedData['venueName'],
                'admin_id' => $partner->id, // Mengaitkan venue dengan partner ini
                // Isi kolom venue lainnya dengan nilai default atau minta di frontend jika perlu
                'location' => 'Lokasi Default',
                'sport_type' => 'Multi Sport',
                'min_price' => 0,
                'max_price' => 0,
                'description' => 'Deskripsi default venue.',
                'address' => 'Alamat default venue.',
                'facilities_details' => 'Fasilitas default.',
                'contact_instagram' => null,
                'contact_phone' => null,
                'image_url' => null,
                'qris_image_url' => null,
            ]);

            return Response::json(['message' => 'Partner dan Venue berhasil ditambahkan!', 'data' => $partner], 201);
        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal menambahkan partner.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified partner in storage.
     * Hanya memperbarui data partner (nama, email, password opsional).
     * VenueName tidak diperbarui di sini, karena venue diatur di halaman manajemen venue.
     */
    public function update(Request $request, $id)
    {
        try {
            $partner = User::where('role', 'admin')->findOrFail($id);

            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$partner->id,
                'password' => 'nullable|string|min:8', // Password opsional saat update
            ]);

            // Update password jika ada dan tidak kosong
            if (isset($validatedData['password']) && !empty($validatedData['password'])) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            } else {
                unset($validatedData['password']); // Jangan update password jika tidak disediakan
            }

            // Perbarui data partner (user)
            $partner->update($validatedData);

            return Response::json(['message' => 'Partner berhasil diperbarui!', 'data' => $partner], 200);
        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal memperbarui partner.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified partner from storage.
     */
    public function destroy($id)
    {
        try {
            $partner = User::where('role', 'admin')->findOrFail($id);

            // Pencegahan: Superadmin tidak bisa menghapus dirinya sendiri jika dia juga 'admin'
            if ($partner->id === auth()->id() && auth()->user()->role === 'superadmin') {
                return Response::json(['message' => 'Superadmin tidak dapat menghapus akunnya sendiri melalui halaman ini.'], 403);
            }

            // PERHATIAN: Jika partner (admin) ini dihapus, venue yang dikelolanya
            // akan kehilangan admin_id-nya. Pastikan foreign key constraint di migration Anda
            // pada admin_id di tabel venues memiliki onDelete('set null').
            // Jika Anda ingin venue terhapus juga, gunakan onDelete('cascade').

            $partner->delete();

            return Response::json(['message' => 'Partner berhasil dihapus!'], 200);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal menghapus partner.', 'error' => $e->getMessage()], 500);
        }
    }
}