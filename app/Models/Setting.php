<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    // INI YANG KURANG TADI
    // Kita kasih izin kolom-kolom ini buat di-update
    protected $fillable = [
        'shop_name',
        'address',
        'phone',
        'tax_rate',
        'logo_path',
        'footer_message',
    ];
}