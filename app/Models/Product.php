<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // 1. IMPORT INI

class Product extends Model
{
    use HasFactory, SoftDeletes; // 2. PAKAI DISINI

    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}