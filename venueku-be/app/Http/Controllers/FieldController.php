<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage; 
use Illuminate\Validation\ValidationException;
use App\Models\Field;
use App\Models\User;
use App\Models\Venue; 
use App\Models\Booking; 
use Carbon\Carbon;

class FieldController extends Controller
{
    /**
     * Display a listing of the fields.
     * PERBAIKAN: Hanya tampilkan field untuk venue yang dikelola admin yang sedang login.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Eager load relasi 'venue' untuk filter berdasarkan admin_id
        $query = Field::with('venue');

        // PERBAIKAN: Filter berdasarkan admin_id dari venue terkait field
        if (auth()->check() && (auth()->user()->role === 'admin' || auth()->user()->role === 'superadmin')) {
            $adminId = auth()->user()->id;
            $query->whereHas('venue', function ($q) use ($adminId) {
                $q->where('admin_id', $adminId);
            });
        }

        // Anda bisa menambahkan filter lain jika diperlukan (misal: berdasarkan nama field, sport_type)
        // if ($request->has('name')) { ... }

        $fields = $query->get();

        return Response::json($fields, 200);
    }

    /**
     * Store a newly created field in storage.
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
                'name' => 'required|string|max:255',
                'sport_type' => 'required|string|max:255',
                'price_per_hour' => 'required|numeric|min:0',
                'opening_time' => 'nullable|date_format:H:i:s',
                'closing_time' => 'nullable|date_format:H:i:s',
                'photo_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Jika menerima file
            ]);

            // PERBAIKAN: Cek otorisasi venue_id yang disubmit
            $venue = Venue::findOrFail($validatedData['venue_id']);
            if ($venue->admin_id !== auth()->id() && auth()->user()->role !== 'superadmin') {
                return Response::json(['message' => 'Anda tidak memiliki izin untuk menambah field di venue ini.'], 403);
            }

            $imagePath = null;
            if ($request->hasFile('photo_url')) { // Sesuaikan nama field file jika berbeda (misal: 'photo')
                $path = $request->file('photo_url')->store('public/field_photos'); // Simpan di folder field_photos
                $imagePath = asset(Storage::url($path));
            }

            $newField = Field::create(array_merge($validatedData, [
                'photo_url' => $imagePath, // Gunakan path gambar yang disimpan
            ]));

            return Response::json(['message' => 'Field added successfully', 'data' => $newField], 201); // Konsistensi: return 'data'
        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal menambah field', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified field in storage.
     * PERBAIKAN: Tambahkan cek otorisasi admin.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id The ID of the field
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $field = Field::with('venue')->findOrFail($id); // Eager load venue untuk cek admin_id

            // PERBAIKAN: Authorization Check
            if ($field->venue->admin_id !== auth()->id() && auth()->user()->role !== 'superadmin') {
                return Response::json(['message' => 'Anda tidak memiliki izin untuk mengedit field ini.'], 403);
            }

            $validatedData = $request->validate([
                'venue_id' => 'sometimes|required|exists:venues,id',
                'name' => 'sometimes|required|string|max:255',
                'sport_type' => 'sometimes|required|string|max:255',
                'price_per_hour' => 'sometimes|required|numeric|min:0',
                'opening_time' => 'nullable|date_format:H:i:s',
                'closing_time' => 'nullable|date_format:H:i:s',
                'photo_url' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Jika menerima file
            ]);

            $dataToUpdate = $validatedData;

            if ($request->hasFile('photo_url')) { // Sesuaikan nama field file jika berbeda
               if ($field->photo_url && filter_var($field->photo_url, FILTER_VALIDATE_URL)) {
                    $old_path_relative = str_replace('/storage/', 'public/', parse_url($field->photo_url, PHP_URL_PATH));
                    if (Storage::exists($old_path_relative)) {
                        Storage::delete($old_path_relative);
                    }
                }
                $path = $request->file('photo_url')->store('public/field_photos');
                $dataToUpdate['photo_url'] = asset(Storage::url($path));
            } else if ($request->has('photo_url') && is_string($request->input('photo_url')) && !empty($request->input('photo_url'))) {
                // Jika frontend mengirim URL lama sebagai string, masukkan kembali
                $dataToUpdate['photo_url'] = $request->input('photo_url');
            } else if ($request->has('photo_url') && empty($request->input('photo_url'))) {
                // Jika frontend mengirim kosong untuk menghapus gambar
                $dataToUpdate['photo_url'] = null;
            }


            $field->update($dataToUpdate);

            return Response::json(['message' => 'Field updated successfully', 'data' => $field], 200);
        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal memperbarui field', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified field from storage.
     * PERBAIKAN: Tambahkan cek otorisasi admin.
     *
     * @param  int  $id The ID of the field
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $field = Field::with('venue')->findOrFail($id); // Eager load venue untuk cek admin_id

            // PERBAIKAN: Authorization Check
            if ($field->venue->admin_id !== auth()->id() && auth()->user()->role !== 'superadmin') {
                return Response::json(['message' => 'Anda tidak memiliki izin untuk menghapus field ini.'], 403);
            }

           if ($field->photo_url && filter_var($field->photo_url, FILTER_VALIDATE_URL)) {
                $old_path_relative = str_replace('/storage/', 'public/', parse_url($field->photo_url, PHP_URL_PATH));
                if (Storage::exists($old_path_relative)) {
                    Storage::delete($old_path_relative);
                }
            }

            $field->delete();

            return Response::json(['message' => 'Field deleted successfully'], 200);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal menghapus field', 'error' => $e->getMessage()], 500);
        }
    }
    /**
     * Get availability schedule for a specific field on a given date.
     * PERBAIKAN: Fungsi ini dipindahkan ke FieldController.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $fieldId The ID of the field
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSchedule(Request $request, $fieldId)
    {
        // Validate 'date' parameter
        $date = $request->query('date');
        if (!$date) {
            return Response::json(['message' => 'Date parameter is required.'], 400); // 400 Bad Request
        }

        // Find the field
        $field = Field::find($fieldId);
        if (!$field) {
            return Response::json(['message' => 'Field not found.'], 404); // 404 Not Found
        }

        // Parse the requested booking date
        $bookingDate = Carbon::parse($date)->format('Y-m-d');

        // Get existing bookings for this field on this specific date
        $existingBookings = Booking::where('field_id', $fieldId)
                                   ->where('booking_date', $bookingDate)
                                   ->where('status', '!=', 'cancelled') // Consider only non-cancelled bookings
                                   ->get();

        $slots = [];
        // Define start and end times for the field based on its operating hours
        $startTime = Carbon::parse($field->opening_time);
        $endTime = Carbon::parse($field->closing_time);

        // Generate time slots hourly
        while ($startTime->lessThan($endTime)) {
            $slotEndTime = $startTime->copy()->addHour();
            // Adjust the end time of the last slot if it goes beyond closing time
            if ($slotEndTime->greaterThan($endTime)) {
                $slotEndTime = $endTime->copy();
            }

            $isAvailable = true;
            // Check for overlap with any existing bookings
            foreach ($existingBookings as $booking) {
                $bookedStart = Carbon::parse($booking->start_time);
                $bookedEnd = Carbon::parse($booking->end_time);

                // Overlap condition:
                // (Slot starts before booked ends AND Slot ends after booked starts)
                if (
                    ($startTime->lessThan($bookedEnd) && $slotEndTime->greaterThan($bookedStart))
                ) {
                    $isAvailable = false;
                    break;
                }
            }

            $slots[] = [
                'id' => uniqid(), // Unique ID for the slot (useful for frontend keys)
                'time' => $startTime->format('H:i') . ' - ' . $slotEndTime->format('H:i'),
                'price' => $field->price_per_hour,
                'isAvailable' => $isAvailable
            ];

            $startTime->addHour(); // Move to the next hour slot
        }

        return Response::json($slots, 200); // 200 OK
    }

    /**
     * Display a listing of popular fields based on booking count.
     * Mengambil lapangan yang memiliki jumlah booking terbanyak.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function popular(Request $request)
    {
        $popularFields = Field::query()
            ->select('fields.*') // Pilih semua kolom field
            ->leftJoin('bookings', 'fields.id', '=', 'bookings.field_id') 
            ->with('venue')
            ->selectRaw('COUNT(bookings.id) as total_bookings_count') 
            ->groupBy(
                'fields.id', 'fields.venue_id', 'fields.name', 'fields.sport_type', 'fields.price_per_hour',
                'fields.opening_time', 'fields.closing_time', 'fields.photo_url',
                'fields.created_at', 'fields.updated_at'
            )
            ->orderByDesc('total_bookings_count') // Urutkan dari yang paling banyak booking
            ->take(8) // Ambil 8 lapangan teratas, sesuaikan jika perlu
            ->get();

        return Response::json($popularFields, 200);
    }

}