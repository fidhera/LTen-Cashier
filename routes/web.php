<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\PosController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // 1. DASHBOARD UTAMA (POS KASIR)
    Route::get('/dashboard', [PosController::class, 'index'])->name('dashboard');

    // 2. TRANSAKSI (CHECKOUT & RIWAYAT PESANAN)
    Route::post('/checkout', [OrderController::class, 'store'])->name('checkout');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');

    // 3. MENU KASIR (PELANGGAN)
    Route::resource('customers', CustomerController::class);

    // 4. PROFILE
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 5. ADMIN GROUP (KHUSUS ROLE ADMIN)
    Route::middleware(['role:admin'])->group(function () {
        Route::resource('products', ProductController::class);
        Route::resource('categories', CategoryController::class);
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
        Route::resource('rewards', RewardController::class);
    });

});

require __DIR__.'/auth.php';