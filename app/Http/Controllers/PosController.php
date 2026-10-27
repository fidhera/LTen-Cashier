<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Reward;
use Inertia\Inertia;

class PosController extends Controller
{
    /**
     * Menampilkan antarmuka kasir utama (POS Dashboard).
     * Memuat produk aktif berserta kategori, daftar kategori, pelanggan, dan promo loyalitas.
     */
    public function index()
    {
        return Inertia::render('Dashboard', [
            'products' => Product::with('category')->where('is_available', true)->get(),
            'categories' => Category::all(),
            'customers' => Customer::orderBy('name')->get(),
            'rewards' => Reward::with('product')->get(),
        ]);
    }
}
