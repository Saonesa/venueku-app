<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage; // Penting: Import Storage facade
use Illuminate\Validation\ValidationException;
use App\Models\Gallery;
use App\Models\Venue; // Penting: Import Venue model untuk filter

class GalleryController extends Controller
{
    /**
     * Display a listing of the gallery items.
     * PERBAIKAN: Hanya tampilkan item galeri untuk venue yang dikelola admin yang sedang login.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request) // Tambahkan Request $request
    {
        // Eager load relasi 'venue' untuk filter berdasarkan admin_id
        $query = Gallery::with('venue');

        // PERBAIKAN: Filter berdasarkan admin_id dari venue terkait item galeri
        if (auth()->check() && (auth()->user()->role === 'admin' || auth()->user()->role === 'superadmin')) {
            $adminId = auth()->user()->id;
            $query->whereHas('venue', function ($q) use ($adminId) {
                $q->where('admin_id', $adminId);
            });
        }

        $galleryItems = $query->latest()->get();

        return Response::json($galleryItems, 200);
    }

    /**
     * Store a newly created gallery item in storage.
     * PERBAIKAN: Pastikan venue_id yang disubmit milik admin yang login.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'venue_id' => 'required|exists:venues,id',
                'image_url' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'caption' => 'nullable|string|max:255',
            ]);

            // PERBAIKAN: Cek otorisasi venue_id yang disubmit
            $venue = Venue::findOrFail($validatedData['venue_id']);
            if ($venue->admin_id !== auth()->id() && auth()->user()->role !== 'superadmin') {
                return Response::json(['message' => 'Anda tidak memiliki izin untuk menambah item galeri di venue ini.'], 403);
            }

            $imagePath = null;
            if ($request->hasFile('image_url')) {
                $path = $request->file('image_url')->store('public/gallery_images');
                $imagePath = asset(Storage::url($path));
            }

            $newItem = Gallery::create(array_merge($validatedData, [
                'image_url' => $imagePath,
            ]));

            return Response::json(['message' => 'Item galeri berhasil ditambahkan!', 'data' => $newItem], 201);
        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal menambahkan item galeri.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified gallery item in storage.
     * PERBAIKAN: Tambahkan cek otorisasi admin.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id The ID of the gallery item
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $item = Gallery::with('venue')->findOrFail($id); // Eager load venue untuk cek admin_id

            // PERBAIKAN: Authorization Check
            if ($item->venue->admin_id !== auth()->id() && auth()->user()->role !== 'superadmin') {
                return Response::json(['message' => 'Anda tidak memiliki izin untuk mengedit item galeri ini.'], 403);
            }

            $validatedData = $request->validate([
                'venue_id' => 'sometimes|required|exists:venues,id',
                'image_url' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'caption' => 'nullable|string|max:255',
            ]);

            $dataToUpdate = $validatedData;

            if ($request->hasFile('image_url')) {
                 if ($item->image_url && filter_var($item->image_url, FILTER_VALIDATE_URL)) {
                    $old_path_relative = str_replace('/storage/', 'public/', parse_url($item->image_url, PHP_URL_PATH));
                    if (Storage::exists($old_path_relative)) {
                        Storage::delete($old_path_relative);
                    }
                }
                $path = $request->file('image_url')->store('public/gallery_images');
                $dataToUpdate['image_url'] = asset(Storage::url($path));
            } else if ($request->has('image_url') && is_string($request->input('image_url')) && !empty($request->input('image_url'))) {
                $dataToUpdate['image_url'] = $request->input('image_url');
            } else if ($request->has('image_url') && empty($request->input('image_url'))) {
                $dataToUpdate['image_url'] = null;
            }

            $item->update($dataToUpdate);

            return Response::json(['message' => 'Item galeri berhasil diperbarui!', 'data' => $item], 200);
        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal memperbarui item galeri.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified gallery item from storage.
     * PERBAIKAN: Tambahkan cek otorisasi admin.
     *
     * @param  int  $id The ID of the gallery item
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $item = Gallery::with('venue')->findOrFail($id); // Eager load venue untuk cek admin_id

            // PERBAIKAN: Authorization Check
            if ($item->venue->admin_id !== auth()->id() && auth()->user()->role !== 'superadmin') {
                return Response::json(['message' => 'Anda tidak memiliki izin untuk menghapus item galeri ini.'], 403);
            }

            if ($item->image_url && filter_var($item->image_url, FILTER_VALIDATE_URL)) {
                $old_path_relative = str_replace('/storage/', 'public/', parse_url($item->image_url, PHP_URL_PATH));
                if (Storage::exists($old_path_relative)) {
                    Storage::delete($old_path_relative);
                }
            }

            $item->delete();
            
            return Response::json(['message' => 'Item galeri berhasil dihapus!'], 200);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal menghapus item galeri.', 'error' => $e->getMessage()], 500);
        }
    }
}