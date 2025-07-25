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
        // Menambahkan kolom facilities_details dengan tipe TEXT dan boleh null
        Schema::table('venues', function (Blueprint $table) {
            $table->string('facilities_details')->nullable()->after('address'); // Posisikan setelah 'address'
        });
    }

    /**
     * Reverse the migrations.
     * Metode down() ini akan menghapus kolom jika Anda melakukan rollback.
     */
    public function down(): void
    {
        // Menghapus kolom facilities_details jika di-rollback
        Schema::table('venues', function (Blueprint $table) {
            $table->dropColumn('facilities_details');
        });
    }
};