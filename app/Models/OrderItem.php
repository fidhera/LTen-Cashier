<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $guarded = [];

    // Relasi: Item ini milik Order siapa?
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Relasi: Item ini produknya apa? (Untuk ambil nama & gambar)
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}