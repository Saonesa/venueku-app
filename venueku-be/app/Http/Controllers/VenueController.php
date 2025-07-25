<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage; // Import Storage facade
use Illuminate\Validation\ValidationException; // Import ValidationException
use App\Models\Venue; // Import model Venue
use App\Models\User; // PERBAIKAN: Import model User
use App\Models\Field; // Diperlukan jika ada relasi atau penggunaan Field model
use App\Models\Booking; // Diperlukan jika ada relasi atau penggunaan Booking model
use Carbon\Carbon;

class VenueController extends Controller
{
    /**
     * Display a listing of the venues.
     * Supports filtering by 'city' and 'sport'.
     * Filters by admin_id if the user is an authenticated admin/superadmin.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Venue::query();

        // Filter by admin_id if the user is an admin or superadmin
        // Ini akan membatasi hasil hanya untuk venue yang dikelola oleh admin yang sedang login
        if (auth()->check() && (auth()->user()->role === 'admin' || auth()->user()->role === 'superadmin')) {
            $query->where('admin_id', auth()->user()->id);
        }

        // Filter by city (location)
        if ($request->has('city')) {
            $query->where('location', 'like', '%' . $request->query('city') . '%');
        }

        // Filter by sport type
        if ($request->has('sport')) {
            $query->where('sport_type', 'like', '%' . $request->query('sport') . '%');
        }

        // Pastikan kolom-kolom yang diperlukan frontend selalu ada
        $venues = $query->select(
            'id', 'admin_id', 'name', 'location', 'sport_type', 'min_price', 'max_price',
            'description', 'address', 'facilities_details',
            'contact_instagram', 'contact_phone', 'image_url', 'qris_image_url'
        )->get();

        return Response::json($venues, 200); // 200 OK
    }

    /**
     * Store a newly created venue in storage.
     * Automatically associates the venue with the authenticated admin.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validasi data yang masuk dari frontend AdminVenuePage
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'sport_type' => 'required|string|max:255',
                'min_price' => 'required|numeric|min:0',
                'max_price' => 'required|numeric|min:0|gte:min_price',
                'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Untuk upload foto utama
                'description' => 'nullable|string',
                'address' => 'nullable|string|max:255',
                'facilities_details' => 'nullable|string',
                'contact_instagram' => 'nullable|string|max:255',
                'contact_phone' => 'nullable|string|max:255',
                'qris_image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Untuk upload QRIS
            ]);

            $imagePath = null;
            // Handle image_url upload (foto utama venue)
            if ($request->hasFile('image_url')) {
                $path = $request->file('image_url')->store('public/venue_images');
                $imagePath = asset(Storage::url($path));
            }

            $qrisImagePath = null;
            // Handle qris_image_url upload
            if ($request->hasFile('qris_image_url')) {
                $path = $request->file('qris_image_url')->store('public/qris_images');
                $qrisImagePath = asset(Storage::url($path));
            }

            // Buat venue baru dan secara OTOMATIS mengisi admin_id
            $venue = Venue::create(array_merge($validatedData, [
                'admin_id' => auth()->id(), // Mengaitkan venue dengan admin yang sedang login
                'image_url' => $imagePath, // Menggunakan path gambar yang disimpan
                'qris_image_url' => $qrisImagePath, // Menggunakan path QRIS yang disimpan
            ]));

            return Response::json(['message' => 'Venue created successfully', 'data' => $venue], 201); // 201 Created

        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal membuat venue', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified venue.
     * Eager loads related fields and gallery images.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        
        $venue = Venue::with(['fields.venue', 'galleryImages'])->find($id);

        if (!$venue) {
            return Response::json(['message' => 'Venue not found'], 404);
        }

        $responseData = $venue->toArray();

        // PERBAIKAN: Hapus logika pengubahan nama 'price_per_hour' menjadi 'price'
        // Biarkan 'price_per_hour' tetap dengan nama aslinya
        $responseData['fields'] = collect($responseData['fields'])->map(function($fieldArray) {
            return $fieldArray;
        })->toArray();



        $responseData['qris_image_url'] = $venue->qris_image_url;
        $responseData['facilities'] = $venue->facilities_details;

        // Hitung operatingHours dari fields terkait
        $operatingHours = [];
        if ($venue->fields->isNotEmpty()){
            $earliestOpenTime = $venue->fields->min('opening_time');
            $latestCloseTime = $venue->fields->max('closing_time');
            if ($earliestOpenTime && $latestCloseTime) {
                $hoursRange = Carbon::parse($earliestOpenTime)->format('H:i') . ' - ' . Carbon::parse($latestCloseTime)->format('H:i');
                $daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
                foreach ($daysOfWeek as $day) {
                    $operatingHours[] = ['day' => $day, 'hours' => $hoursRange];
                }
            }
        }
        $responseData['operatingHours'] = $operatingHours;

        $responseData['contactInfo'] = [
            'instagram' => $venue->contact_instagram,
            'phone' => $venue->contact_phone,
        ];
        $responseData['galleryImages'] = $venue->galleryImages->map(fn($img) => $img->image_url)->toArray();
        $responseData['imageUrl'] = $venue->image_url;


        return Response::json($responseData, 200);
    
    }

    /**
     * Update the specified venue in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $venue = Venue::findOrFail($id);

            // PERBAIKAN: Authorization Check - Pastikan admin yang login memiliki izin untuk mengedit venue ini
            if ($venue->admin_id !== auth()->id() && auth()->user()->role !== 'superadmin') {
                return Response::json(['message' => 'Anda tidak memiliki izin untuk mengedit venue ini.'], 403); // 403 Forbidden
            }

            // Validasi input
            // Menggunakan array_filter dan array_keys untuk membuat data yang divalidasi sesuai dengan field yang dikirim
            $validationRules = [
                'name' => 'sometimes|required|string|max:255',
                'location' => 'sometimes|required|string|max:255',
                'sport_type' => 'sometimes|required|string|max:255',
                'min_price' => 'sometimes|required|numeric|min:0',
                'max_price' => 'sometimes|required|numeric|min:0|gte:min_price',
                'image_url' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Untuk upload file foto utama
                'description' => 'sometimes|nullable|string',
                'address' => 'sometimes|nullable|string|max:255',
                'facilities_details' => 'sometimes|nullable|string',
                'contact_instagram' => 'sometimes|nullable|string|max:255',
                'contact_phone' => 'sometimes|nullable|string|max:255',
                'qris_image_url' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Untuk upload file QRIS
            ];

            // Filter rules based on what's present in the request (except files)
            $rulesToValidate = array_filter($validationRules, function($key) use ($request) {
                // Return rule if key exists in request or if it's a file field (which requires hasFile check)
                return $request->has($key) || str_contains($key, '_url'); // simple check for file fields
            }, ARRAY_FILTER_USE_KEY);
            
            $validatedData = $request->validate($rulesToValidate);


            // PERBAIKAN: Penanganan File Upload yang Robust untuk Update
            // Inisialisasi array untuk menyimpan data yang akan diupdate
            $dataToUpdate = [];

            // Iterasi melalui validatedData, tambahkan ke dataToUpdate
            foreach ($validatedData as $key => $value) {
                if (!in_array($key, ['image_url', 'qris_image_url'])) { // Kecuali field file, tambahkan langsung
                    $dataToUpdate[$key] = $value;
                }
            }
            
            // Handle image_url upload (foto utama venue)
            if ($request->hasFile('image_url')) {
                // Hapus foto lama jika ada
                if ($venue->image_url && filter_var($venue->image_url, FILTER_VALIDATE_URL)) {
                    $old_path_relative = str_replace('/storage/', 'public/', parse_url($venue->image_url, PHP_URL_PATH));
                    if (Storage::exists($old_path_relative)) {
                        Storage::delete($old_path_relative);
                    }
                }
                $path = $request->file('image_url')->store('public/venue_images');
                $dataToUpdate['image_url'] = asset(Storage::url($path));
            } else if ($request->has('image_url') && is_string($request->input('image_url')) && !empty($request->input('image_url'))) {
                // Jika frontend mengirim kembali URL lama sebagai string, masukkan ke dataToUpdate
                $dataToUpdate['image_url'] = $request->input('image_url');
            } else if ($request->has('image_url') && empty($request->input('image_url'))) {
                // Jika frontend mengirimkan 'image_url' dengan nilai kosong (misal: untuk menghapus gambar)
                $dataToUpdate['image_url'] = null;
            }


            // Handle qris_image_url upload
            if ($request->hasFile('qris_image_url')) {
                // Hapus foto lama jika ada
                if ($venue->qris_image_url && filter_var($venue->qris_image_url, FILTER_VALIDATE_URL)) {
                    $old_path_relative = str_replace('/storage/', 'public/', parse_url($venue->qris_image_url, PHP_URL_PATH));
                    if (Storage::exists($old_path_relative)) {
                        Storage::delete($old_path_relative);
                    }
                }
                $path = $request->file('qris_image_url')->store('public/qris_images');
                $dataToUpdate['qris_image_url'] = asset(Storage::url($path));
            } else if ($request->has('qris_image_url') && is_string($request->input('qris_image_url')) && !empty($request->input('qris_image_url'))) {
                $dataToUpdate['qris_image_url'] = $request->input('qris_image_url');
            } else if ($request->has('qris_image_url') && empty($request->input('qris_image_url'))) {
                 $dataToUpdate['qris_image_url'] = null;
            }


            $venue->update($dataToUpdate); // Gunakan $dataToUpdate

            return Response::json(['message' => 'Venue updated successfully', 'data' => $venue], 200); // 200 OK

        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal memperbarui venue', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified venue from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $venue = Venue::findOrFail($id);

            // PERBAIKAN: Authorization Check - Pastikan admin yang login memiliki izin untuk menghapus venue ini
            if ($venue->admin_id !== auth()->id() && auth()->user()->role !== 'superadmin') {
                return Response::json(['message' => 'Anda tidak memiliki izin untuk menghapus venue ini.'], 403); // 403 Forbidden
            }

            // Hapus file gambar terkait jika ada
            if ($venue->image_url && filter_var($venue->image_url, FILTER_VALIDATE_URL)) {
                $old_path_relative = str_replace('/storage/', 'public/', parse_url($venue->image_url, PHP_URL_PATH));
                if (Storage::exists($old_path_relative)) {
                    Storage::delete($old_path_relative);
                }
            }
            if ($venue->qris_image_url && filter_var($venue->qris_image_url, FILTER_VALIDATE_URL)) {
                $old_path_relative = str_replace('/storage/', 'public/', parse_url($venue->qris_image_url, PHP_URL_PATH));
                if (Storage::exists($old_path_relative)) {
                    Storage::delete($old_path_relative);
                }
            }

            $venue->delete();

            return Response::json(['message' => 'Venue deleted successfully'], 200);

        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal menghapus venue', 'error' => $e->getMessage()], 500);
        }
    }
}