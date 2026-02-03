<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reward extends Model
{
    protected $fillable = ['product_id', 'min_points', 'discount_percentage'];

    // Relasi biar kita tahu produk apa yang didiskon
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}