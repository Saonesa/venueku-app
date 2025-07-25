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
        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->string('sport_type')->nullable(); 
            $table->integer('min_price')->nullable();
            $table->integer('max_price')->nullable();
            $table->string('image_url')->nullable();
            $table->text('description')->nullable();
            $table->string('address')->nullable();
            $table->string('contact_instagram')->nullable();
            $table->string('contact_phone')->nullable();
            $table->foreignId('admin_id')->nullable()->constrained('users')->onDelete('set null'); // Partner/admin yang memiliki venue ini
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venues');
    }
};