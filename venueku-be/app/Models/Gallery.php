<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $table = 'gallery'; 

    protected $fillable = [
        'venue_id',
        'image_url',
        'caption'
    ];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }
}