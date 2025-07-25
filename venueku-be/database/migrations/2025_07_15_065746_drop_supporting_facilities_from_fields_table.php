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
        // Menghapus kolom supporting_facilities
        Schema::table('fields', function (Blueprint $table) {
            $table->dropColumn('supporting_facilities');
        });
    }

    /**
     * Reverse the migrations.
     * Metode down() ini akan mengembalikan kolom jika Anda melakukan rollback.
     */
    public function down(): void
    {
        // Menambah kembali kolom supporting_facilities jika di-rollback
        Schema::table('fields', function (Blueprint $table) {
            $table->string('supporting_facilities')->nullable()->after('photo_url'); // Menambahkannya kembali setelah photo_url
        });
    }
};