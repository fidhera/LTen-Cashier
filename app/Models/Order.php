<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_code',
        'user_id',
        'customer_id', // Pastikan ini ada
        'total_amount',
        'tax_amount',
        'grand_total',
        'payment_status',
        'payment_method',
    ];

    // Relasi ke User (Kasir/Admin)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Customer (Pelanggan)
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Relasi ke Item Order
    // PENTING: Nama fungsi ini HARUS 'orderItems' (sesuai yang dipanggil di Controller)
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}