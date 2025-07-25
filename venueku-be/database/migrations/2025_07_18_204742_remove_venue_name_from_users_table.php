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
        Schema::table('users', function (Blueprint $table) {
            // Periksa apakah kolom 'venue_name' ada sebelum mencoba menghapusnya
            if (Schema::hasColumn('users', 'venue_name')) {
                $table->dropColumn('venue_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Saat rollback, tambahkan kembali kolomnya (misal sebagai nullable string)
            // Sesuaikan tipe data dan batasan jika sebelumnya berbeda
            $table->string('venue_name')->nullable()->after('email'); // Sesuaikan posisi jika perlu
        });
    }
};