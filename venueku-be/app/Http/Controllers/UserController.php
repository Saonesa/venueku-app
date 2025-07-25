<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display a listing of regular users (role 'user').
     * Implements pagination.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Pastikan route ini diakses oleh Superadmin
        // Middleware atau Gate/Policy harus menangani otorisasi ini.
        // Contoh: $this->authorize('viewAny', User::class);

        $perPage = $request->query('per_page', 10);
        $page = $request->query('page', 1);

        $users = User::where('role', 'user')
                     ->orderBy('created_at', 'desc')
                     ->paginate($perPage, ['*'], 'page', $page);

        // paginate() sudah mengembalikan struktur yang benar: { data: [...], current_page: ..., dll. }
        return Response::json($users, 200);
    }

    /**
     * Store a newly created regular user in storage (by Superadmin).
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
            ]);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role' => 'user', // Hardcode role sebagai 'user'
            ]);

            return Response::json(['message' => 'Pengguna berhasil ditambahkan!', 'data' => $user], 201);
        } catch (ValidationException $e) {
            return Response::json([
                'message' => 'Validasi Gagal',
                'errors' => $e->errors() // Laravel secara otomatis memberikan array errors
            ], 422);
        } catch (\Exception $e) {
            // Konsistenkan format error untuk error umum
            return Response::json([
                'message' => 'Terjadi kesalahan saat menambahkan pengguna.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified regular user in storage (by Superadmin).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id The ID of the user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            // Pastikan hanya user dengan role 'user' yang bisa diupdate melalui endpoint ini
            $userToUpdate = User::where('role', 'user')->findOrFail($id);

            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$userToUpdate->id,
                'password' => 'nullable|string|min:8', // Password opsional
            ]);

            if (isset($validatedData['password']) && !empty($validatedData['password'])) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            } else {
                unset($validatedData['password']); // Hapus key password jika kosong
            }

            $userToUpdate->update($validatedData);

            return Response::json(['message' => 'Pengguna berhasil diperbarui!', 'data' => $userToUpdate], 200);
        } catch (ValidationException $e) {
            return Response::json([
                'message' => 'Validasi Gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Konsistenkan format error untuk error umum
            return Response::json([
                'message' => 'Terjadi kesalahan saat memperbarui pengguna.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified regular user from storage (by Superadmin).
     *
     * @param  int  $id The ID of the user
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            // Pastikan hanya user dengan role 'user' yang bisa dihapus melalui endpoint ini
            $userToDelete = User::where('role', 'user')->findOrFail($id);
            $userToDelete->delete();

            return Response::json(['message' => 'Pengguna berhasil dihapus!'], 200);
        } catch (\Exception $e) {
            // Konsistenkan format error untuk error umum
            return Response::json([
                'message' => 'Terjadi kesalahan saat menghapus pengguna.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}