<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    use HasFactory;

    protected $fillable = [
        'venue_id',
        'name',
        'sport_type',
        'price_per_hour',
        'opening_time',
        'closing_time',
        'photo_url',
    ];

   
    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }


    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}