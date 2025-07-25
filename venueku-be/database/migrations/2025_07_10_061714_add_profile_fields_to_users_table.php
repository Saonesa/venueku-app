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
            // Pastikan kolom-kolom ini ditambahkan
            $table->string('phone_number')->nullable()->after('email');
            $table->date('birth_date')->nullable()->after('phone_number');
            $table->string('gender')->nullable()->after('birth_date');
            $table->string('location')->nullable()->after('gender');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop kolom-kolom ini saat rollback
            $table->dropColumn(['location', 'gender', 'birth_date', 'phone_number']);
        });
    }
};