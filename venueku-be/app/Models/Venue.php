<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'sport_type',
        'min_price',
        'max_price',
        'image_url',
        'description',
        'address',
        'facilities_details',
        'contact_instagram',
        'contact_phone',
        'qris_image_url',
        'admin_id'
    ];

   
    public function fields()
    {
        return $this->hasMany(Field::class);
    }

    // Relasi: Sebuah Venue memiliki banyak VenueGalleryImages
    public function galleryImages()
    {
        return $this->hasMany(Gallery::class);
    }

    // Relasi: Sebuah Venue dimiliki oleh satu Admin (User)
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}