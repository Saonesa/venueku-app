<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Menambahkan kolom 'notes' dengan tipe TEXT dan boleh null
        Schema::table('bookings', function (Blueprint $table) {
            $table->text('notes')->nullable()->after('payment_method'); // Posisikan setelah 'payment_method'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Menghapus kolom 'notes' jika di-rollback
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('notes');
        });
    }
};