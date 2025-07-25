<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Models\Booking;
use App\Models\Field;
use App\Models\User;
use App\Models\Venue; // Penting: Import Venue model untuk eager load dan filter
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    /**
     * Store a newly created booking in storage (User-facing).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validate incoming request data
            $request->validate([
                'fieldId' => 'required|exists:fields,id',
                'date' => 'required|date_format:Y-m-d',
                'time' => 'required|string', // Format: "HH:mm - HH:mm"
                'price' => 'required|numeric',
                'paymentMethod' => 'required|string|in:qris,cash',
                'notes' => 'nullable|string|max:500',
            ]);

            $field = Field::find($request->fieldId);
            if (!$field) {
                return Response::json(['message' => 'Field not found'], 404);
            }

            // Parse time slot
            list($startTimeStr, $endTimeStr) = explode(' - ', $request->time);
            $bookingDate = Carbon::parse($request->date);
            $startTime = Carbon::parse($request->date . ' ' . $startTimeStr);
            $endTime = Carbon::parse($request->date . ' ' . $endTimeStr);

            // Cek tanggal & waktu tidak di masa lalu
            if ($bookingDate->isPast() && !$bookingDate->isToday()) {
                return Response::json(['message' => 'Cannot book a date in the past.'], 400);
            }
            if ($bookingDate->isToday() && $startTime->isPast()) {
                return Response::json(['message' => 'Cannot book a time slot in the past for today.'], 400);
            }

            // Cek bentrok booking
            $overlappingBooking = Booking::where('field_id', $request->fieldId)
                ->where('booking_date', $bookingDate->format('Y-m-d'))
                ->where('status', '!=', 'cancelled')
                ->where(function ($query) use ($startTime, $endTime) {
                    $query->where('start_time', '<', $endTime->format('H:i:s'))
                        ->where('end_time', '>', $startTime->format('H:i:s'));
                })
                ->first();

            if ($overlappingBooking) {
                return Response::json(['message' => 'The selected time slot is already booked or overlaps with an existing booking.'], 409);
            }

            // Tambahkan platform fee
            $platformFee = 6000;
            $totalPrice = $request->price + $platformFee;

            // Simpan booking
            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'field_id' => $request->fieldId,
                'booking_date' => $bookingDate->format('Y-m-d'),
                'start_time' => $startTime->format('H:i:s'),
                'end_time' => $endTime->format('H:i:s'),
                'total_price' => $totalPrice,
                'status' => 'pending', // Default booking status
                'payment_status' => 'pending', // Default payment status
                'payment_method' => $request->paymentMethod,
                'notes' => $request->notes,
            ]);

            return Response::json(['message' => 'Booking created successfully', 'booking' => $booking], 201);

        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Failed to create booking', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display a listing of bookings for the authenticated user (User-facing).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function myOrders(Request $request)
    {
        // Retrieve bookings for the authenticated user, eager load related data
        $bookings = Booking::where('user_id', $request->user()->id)
                            ->with(['field.venue', 'user'])
                            ->orderBy('booking_date', 'desc')
                            ->orderBy('start_time', 'desc')
                            ->get();

        // Format data to match frontend expectations (MyOrdersPage.jsx)
        $formattedBookings = $bookings->map(function($booking) {
            return [
                'id' => $booking->id,
                'venue' => $booking->field->venue->name ?? 'N/A',
                'field' => $booking->field->name ?? 'N/A',
                'dateTime' => Carbon::parse($booking->booking_date)->format('Y-m-d') . ', ' .
                              Carbon::parse($booking->start_time)->format('H:i A') . ' - ' .
                              Carbon::parse($booking->end_time)->format('H:i A'),
                'user' => $booking->user->name ?? 'N/A',
                'status' => $booking->status,
                'paymentStatus' => $booking->payment_status,
                'totalPrice' => $booking->total_price,
                'userId' => $booking->user_id,
                'paymentMethod' => $booking->payment_method,
                'notes' => $booking->notes,
            ];
        });

        return Response::json($formattedBookings, 200);
    }

    /**
     * Display a listing of all bookings (Admin/Partner-facing).
     * Supports filtering by 'field_name', 'status', and 'user_name'.
     * PERBAIKAN: Hanya tampilkan booking untuk venue yang dikelola admin yang sedang login.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'field.venue']);

        // PERBAIKAN: Filter berdasarkan admin_id dari venue terkait booking
        if (auth()->check() && (auth()->user()->role === 'admin' || auth()->user()->role === 'superadmin')) {
            $adminId = auth()->user()->id;
            $query->whereHas('field.venue', function ($q) use ($adminId) {
                $q->where('admin_id', $adminId);
            });
        }

        // Filter by field name
        if ($request->has('field_name')) {
            $fieldName = $request->query('field_name');
            $query->whereHas('field', function ($q) use ($fieldName) {
                $q->where('name', 'like', '%' . $fieldName . '%');
            });
        }

        // Filter by booking status
        if ($request->has('status')) {
            $status = $request->query('status');
            $query->where('status', $status);
        }

        // Filter by user name
        if ($request->has('user_name')) {
            $userName = $request->query('user_name');
            $query->whereHas('user', function ($q) use ($userName) {
                $q->where('name', 'like', '%' . $userName . '%');
            });
        }

        $bookings = $query->latest()->get();

        // Format data for AdminBookingManagementPage.jsx
        $formattedBookings = $bookings->map(function($booking) {
            return [
                'id' => $booking->id,
                'venue_name' => $booking->field->venue->name ?? 'N/A',
                'field_name' => $booking->field->name ?? 'N/A',
                'booking_date' => Carbon::parse($booking->booking_date)->format('Y-m-d'),
                'start_time' => Carbon::parse($booking->start_time)->format('H:i:s'),
                'end_time' => Carbon::parse($booking->end_time)->format('H:i:s'),
                'user_name' => $booking->user->name ?? 'N/A',
                'status' => $booking->status,
                'payment_status' => $booking->payment_status,
                'total_price' => $booking->total_price,
                'payment_method' => $booking->payment_method,
                'notes' => $booking->notes,
            ];
        });

        return Response::json($formattedBookings, 200);
    }

    /**
     * Confirm a specific booking.
     * Updates booking status to 'confirmed' and payment_status to 'paid'.
     * PERBAIKAN: Tambahkan cek otorisasi admin.
     *
     * @param  int  $id The ID of the booking
     * @return \Illuminate\Http\JsonResponse
     */
    public function confirm($id)
    {
        try {
            $booking = Booking::with('field.venue')->findOrFail($id); // Eager load untuk cek admin_id

            // PERBAIKAN: Authorization check
            if (auth()->check() && ($booking->field->venue->admin_id !== auth()->id() && auth()->user()->role !== 'superadmin')) {
                return Response::json(['message' => 'Anda tidak memiliki izin untuk mengkonfirmasi pemesanan ini.'], 403);
            }

            $booking->status = 'confirmed';
            $booking->payment_status = 'paid';
            $booking->save();

            return Response::json(['message' => 'Pemesanan berhasil dikonfirmasi!', 'data' => $booking], 200);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal mengkonfirmasi pemesanan.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Cancel a specific booking.
     * Updates booking status to 'cancelled'.
     * PERBAIKAN: Tambahkan cek otorisasi admin.
     *
     * @param  int  $id The ID of the booking
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancel($id)
    {
        try {
            $booking = Booking::with('field.venue')->findOrFail($id); // Eager load untuk cek admin_id

            // PERBAIKAN: Authorization check
            if (auth()->check() && ($booking->field->venue->admin_id !== auth()->id() && auth()->user()->role !== 'superadmin')) {
                return Response::json(['message' => 'Anda tidak memiliki izin untuk membatalkan pemesanan ini.'], 403);
            }

            $booking->status = 'cancelled';
            $booking->save();

            return Response::json(['message' => 'Pemesanan berhasil dibatalkan!', 'data' => $booking], 200);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal membatalkan pemesanan.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display a listing of payments/transactions (Admin/Partner-facing).
     * Filters by 'status', 'user_name', and 'field_name'.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPayments(Request $request)
    {
        $query = Booking::with(['user', 'field.venue']);

        // PERBAIKAN: Filter berdasarkan admin_id dari venue terkait payment
        if (auth()->check() && (auth()->user()->role === 'admin' || auth()->user()->role === 'superadmin')) {
            $adminId = auth()->user()->id;
            $query->whereHas('field.venue', function ($q) use ($adminId) {
                $q->where('admin_id', $adminId);
            });
        }

        // Filter berdasarkan payment_status
        if ($request->has('status')) {
            $query->where('payment_status', $request->query('status'));
        }
        // Filter berdasarkan user name
        if ($request->has('user_name')) {
            $userName = $request->query('user_name');
            $query->whereHas('user', function ($q) use ($userName) {
                $q->where('name', 'like', '%' . $userName . '%');
            });
        }
        // Filter berdasarkan field name
        if ($request->has('field_name')) {
            $fieldName = $request->query('field_name');
            $query->whereHas('field', function ($q) use ($fieldName) {
                $q->where('name', 'like', '%' . $fieldName . '%');
            });
        }

        $payments = $query->latest()->get();

        // Format data untuk AdminPaymentManagementPage.jsx
        $formattedPayments = $payments->map(function($booking) {
            return [
                'id' => $booking->id, // Gunakan ID booking sebagai transaction ID
                'user_name' => $booking->user->name ?? 'N/A',
                'venue_name' => $booking->field->venue->name ?? 'N/A',
                'field_name' => $booking->field->name ?? 'N/A',
                'booking_date' => Carbon::parse($booking->booking_date)->format('Y-m-d'),
                'total_price' => $booking->total_price,
                'payment_status' => $booking->payment_status,
                'payment_method' => $booking->payment_method,
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
            ];
        });

        return Response::json($formattedPayments, 200);
    }

    /**
     * Update the payment status of a specific booking/transaction.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id The ID of the booking/transaction
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePaymentStatus(Request $request, $id)
    {
        try {
            $booking = Booking::with('field.venue')->findOrFail($id); // Eager load untuk cek admin_id

            // PERBAIKAN: Authorization check
            if (auth()->check() && ($booking->field->venue->admin_id !== auth()->id() && auth()->user()->role !== 'superadmin')) {
                return Response::json(['message' => 'Anda tidak memiliki izin untuk memperbarui status pembayaran ini.'], 403);
            }

            $validatedData = $request->validate([
                'payment_status' => 'required|string|in:pending,paid,failed,completed,cancelled', // Status yang diizinkan
            ]);

            $booking->payment_status = $validatedData['payment_status'];
            $booking->save();

            return Response::json(['message' => 'Status pembayaran berhasil diperbarui!', 'data' => $booking], 200);

        } catch (ValidationException $e) {
            return Response::json(['message' => 'Validasi Gagal', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return Response::json(['message' => 'Gagal memperbarui status pembayaran.', 'error' => $e->getMessage()], 500);
        }
    }
}