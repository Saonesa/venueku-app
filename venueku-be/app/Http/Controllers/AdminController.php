<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Auth; // Pastikan Auth diimpor
use Illuminate\Validation\ValidationException;
use App\Models\Booking;
use App\Models\Field;
use App\Models\User;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Get dashboard metrics for admin/partner.
     * Ini mengambil data metrik dari database (tidak ada perubahan).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSuperadminDashboardMetrics()
    {
        try {
            // Total Registered Users (role 'user')
            $totalUsers = User::where('role', 'user')->count();

            // Total Registered Partners (role 'admin')
            $totalPartners = User::where('role', 'admin')->count();

            // Overall Revenue (all time, from paid bookings)
            $overallRevenue = Booking::whereIn('payment_status', ['paid', 'completed'])->sum('total_price');

            $metrics = [
                'totalUsers' => $totalUsers,
                'totalPartners' => $totalPartners,
                'overallRevenue' => $overallRevenue,
            ];
            return Response::json($metrics, 200); // 200 OK
        } catch (\Exception $e) {
            return Response::json(['message' => 'Failed to retrieve superadmin metrics', 'error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Get dashboard metrics for the authenticated admin/partner.
     * Ini mengambil data metrik dari database berdasarkan admin/partner yang sedang login.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDashboardMetrics()
    {
        try {
            $now = Carbon::now();
            $adminId = auth()->id(); 
            $userRole = auth()->user()->role; 

            
            $isSuperadmin = ($userRole === 'superadmin');

            $totalBookingsTodayQuery = Booking::whereDate('booking_date', $now->toDateString());

            
            if (!$isSuperadmin) {
                $totalBookingsTodayQuery->whereHas('field.venue', function ($q) use ($adminId) {
                    $q->where('admin_id', $adminId);
                });
            }
            $totalBookingsToday = $totalBookingsTodayQuery->count();


           
            $activeFieldsQuery = Field::whereHas('bookings', function($query) use ($now) {
                                    $query->whereIn('status', ['confirmed', 'pending', 'paid']) // Status booking yang dianggap aktif
                                          ->whereDate('booking_date', $now->toDateString())     // Untuk booking di hari ini
                                          ->whereTime('start_time', '<=', $now->format('H:i:s')) // Jam mulai booking sudah lewat atau sedang berlangsung
                                          ->whereTime('end_time', '>=', $now->format('H:i:s')); // Jam selesai booking belum lewat atau sedang berlangsung
                                });

            if (!$isSuperadmin) {
                $activeFieldsQuery->whereHas('venue', function ($q) use ($adminId) {
                    $q->where('admin_id', $adminId);
                });
            }
            $activeFields = $activeFieldsQuery->count();


            
            $revenueThisMonthQuery = Booking::whereMonth('created_at', $now->month)
                                            ->whereYear('created_at', $now->year)
                                            ->whereIn('payment_status', ['paid', 'completed']);


            if (!$isSuperadmin) {
                $revenueThisMonthQuery->whereHas('field.venue', function ($q) use ($adminId) {
                    $q->where('admin_id', $adminId);
                });
            }
            $revenueThisMonth = $revenueThisMonthQuery->sum('total_price');


            $metrics = [
                'totalBookingsToday' => $totalBookingsToday,
                'activeFields' => $activeFields,
                'revenueThisMonth' => $revenueThisMonth,
            ];

            return Response::json($metrics, 200); // 200 OK
        } catch (\Exception $e) {
            // Tangani jika ada error saat mengambil metrik
            return Response::json(['message' => 'Failed to retrieve dashboard metrics', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get the profile of the authenticated user (admin/partner/regular user).
     * Mengambil data profil dari user yang sedang login.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile(Request $request)
    {
        try {
            $user = $request->user(); // Dapatkan user yang sedang login

            if (!$user) {
                return Response::json(['message' => 'Unauthenticated.'], 401);
            }

            // Mengembalikan data profil user
            return Response::json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'venueName' => $user->venue_name ?? null, // Akan null untuk user tanpa venue
                'birthDate' => $user->birth_date ? Carbon::parse($user->birth_date)->format('Y-m-d') : null,
                'gender' => $user->gender,
                'phoneNumber' => $user->phone_number,
                'location' => $user->location,
            ], 200); // 200 OK
        } catch (\Exception $e) {
            // Tangani jika ada error saat mengambil profil (misal: user object tidak lengkap)
            return Response::json(['message' => 'Failed to retrieve profile', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the profile of the authenticated user.
     * Memperbarui data profil dari user yang sedang login.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user(); // Dapatkan user yang sedang login

            if (!$user) {
                return Response::json(['message' => 'Unauthenticated.'], 401);
            }

            // Validasi data yang masuk
            $request->validate([
                'name' => 'required|string|max:255',
                'phoneNumber' => 'nullable|string|max:20',
                'birthDate' => 'nullable|date',
                'gender' => 'nullable|string|max:50',
                'location' => 'nullable|string|max:255',
            ]);

            // Update properti user
            $user->name = $request->name;
            $user->phone_number = $request->phoneNumber;
            $user->birth_date = $request->birthDate;
            $user->gender = $request->gender;
            $user->location = $request->location;
            $user->save(); // Simpan perubahan ke database

            return Response::json(['message' => 'Profile updated successfully', 'user' => $user], 200); // 200 OK
        } catch (ValidationException $e) {
            // Tangani error validasi
            return Response::json(['message' => 'Validation Error', 'errors' => $e->errors()], 422); // 422 Unprocessable Entity
        } catch (\Exception $e) {
            // Tangani error umum lainnya
            return Response::json(['message' => 'Failed to update profile', 'error' => $e->getMessage()], 500); // 500 Internal Server Error
        }
    }
}