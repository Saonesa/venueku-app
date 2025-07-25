<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User; // Penting: Import model User
// use App\Models\Venue; // Hapus import Venue karena tidak lagi dikelola di AuthController
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon; // Pastikan Carbon diimpor jika digunakan untuk format tanggal di respon

class AuthController extends Controller
{
    /**
     * Handle user registration.
     * PERBAIKAN: Hanya mengizinkan pendaftaran dengan role 'user'.
     */
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed', // 'confirmed' artinya ada password_confirmation
                'role' => 'required|string|in:user', // PERBAIKAN: Hanya izinkan 'user'
                // PERBAIKAN: Hapus validasi 'venueName' karena tidak lagi relevan untuk register publik
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user', // PERBAIKAN: Selalu set role ke 'user' secara manual
                // PERBAIKAN: Hapus 'venue_name' dari sini
                // 'venue_name' => $request->venueName,
            ]);

            // PERBAIKAN: Sederhanakan response user data
            // Cukup ambil user dari DB (jika perlu field lain yang tidak ada di $fillable)
            // Atau langsung gunakan $user->toArray() jika $fillable sudah mencakup semua yang ingin direturn
            $responseUser = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                // PERBAIKAN: Hapus 'venue_name' dari response
                // 'venue_name' => $user->venue_name,
                // PERBAIKAN: Jika 'phone_number', 'birth_date', 'gender', 'location' adalah kolom di tabel users
                // dan Anda ingin mereka di respon login/register, pastikan mereka di $fillable atau dapat diakses langsung.
                // Disarankan menggunakan Laravel API Resources untuk respon API yang rapi.
                'phone_number' => $user->phone_number ?? null, // Asumsi ini ada di tabel users
                'birth_date' => $user->birth_date ? Carbon::parse($user->birth_date)->format('Y-m-d') : null, // Asumsi ini ada di tabel users
                'gender' => $user->gender ?? null, // Asumsi ini ada di tabel users
                'location' => $user->location ?? null, // Asumsi ini ada di tabel users
            ];


            $token = $user->createToken('auth_token')->plainTextToken;

            return Response::json(['message' => 'User registered successfully', 'token' => $token, 'user' => $responseUser], 201);
        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Registration failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle user login.
     */
    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (!Auth::attempt($credentials)) {
                return Response::json(['message' => 'Invalid credentials'], 401);
            }

            $user = Auth::user(); // Dapatkan user yang berhasil login

            // PERBAIKAN: Sederhanakan response user data
            // Jika Anda ingin eager load managedVenues untuk admin di login, lakukan di sini
            // if ($user->role === 'admin' || $user->role === 'superadmin') {
            //     $user->load('managedVenues');
            // }

            $responseUser = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone_number' => $user->phone_number ?? null,
                'birth_date' => $user->birth_date ? Carbon::parse($user->birth_date)->format('Y-m-d') : null,
                'gender' => $user->gender ?? null,
                'location' => $user->location ?? null,
            ];

            $token = $user->createToken('auth_token')->plainTextToken;

            return Response::json(['message' => 'Login successful', 'token' => $token, 'user' => $responseUser], 200);
        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Login failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return Response::json(['message' => 'Logged out successfully'], 200);
    }
}