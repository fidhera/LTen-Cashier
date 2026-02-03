<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'slug' // <--- PASTIKAN INI ADA!
    ];

    // Relasi ke Produk (Satu Kategori punya Banyak Produk)
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}