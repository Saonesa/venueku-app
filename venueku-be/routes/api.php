<?php 

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\FieldController;
use App\Http\Controllers\GalleryController; // Ubah dari VenueGalleryImageController jika sebelumnya berbeda
use App\Http\Controllers\UserController;
use App\Http\Controllers\PartnerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes (tidak memerlukan autentikasi)
Route::get('/venues', [VenueController::class, 'index']);
Route::get('/venues/{id}', [VenueController::class, 'show']);

Route::get('/fields/{id}/schedule', [FieldController::class, 'getSchedule']);
// Route untuk Lapangan Populer
Route::get('/fields/popular', [FieldController::class, 'popular']);

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (memerlukan autentikasi Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Routes untuk user biasa (role 'user')
    // Route::get('/user', function (Request $request) { return $request->user(); }); // Contoh route untuk mendapatkan info user yg login
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/my-orders', [BookingController::class, 'myOrders']);
    Route::get('/profile', [AdminController::class, 'getProfile']); // Profile untuk semua role
    Route::put('/profile', [AdminController::class, 'updateProfile']); // Update profile untuk semua role

    // Routes untuk Admin/Partner (role 'admin' atau 'superadmin')
    Route::prefix('admin')->middleware('role:admin,superadmin')->group(function () {
        Route::get('/dashboard-metrics', [AdminController::class, 'getDashboardMetrics']);
        // Routes untuk mengelola venue
        Route::resource('venues', VenueController::class); // CRUD untuk venue
        // Routes untuk mengelola fields
        Route::resource('fields', FieldController::class); // CRUD untuk fields
        // Routes untuk mengelola gallery
        Route::resource('gallery', GalleryController::class); // CRUD untuk gallery items
        // Routes untuk mengelola bookings
        Route::get('bookings', [BookingController::class, 'index']); // Melihat semua bookings
        Route::put('bookings/{id}/confirm', [BookingController::class, 'confirm']);
        Route::put('bookings/{id}/cancel', [BookingController::class, 'cancel']);
        // Routes untuk mengelola payments
        Route::get('payments', [BookingController::class, 'getPayments']); // Mengambil daftar pembayaran (sudah ada)
        Route::put('payments/{id}', [BookingController::class, 'updatePaymentStatus']); // <-- Rute BARU untuk update status pembayaran
 
    });

    // Routes khusus Superadmin (role 'superadmin')
    Route::prefix('superadmin')->middleware('role:superadmin')->group(function () {
        Route::get('/dashboard-metrics', [AdminController::class, 'getSuperadminDashboardMetrics']); // Bisa sama atau berbeda dengan admin
        Route::resource('users', UserController::class); // CRUD untuk user biasa
        Route::resource('partners', PartnerController::class); // CRUD untuk partner (admin)
        
    });
});