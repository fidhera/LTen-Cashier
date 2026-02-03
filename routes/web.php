<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RewardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Reward; // Import Model Reward

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // 1. DASHBOARD (POS) - Update: Kirim Data Rewards
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'products' => Product::with('category')->where('is_available', true)->get(),
            'categories' => Category::all(),
            'customers' => Customer::all(), 
            // KIRIM ATURAN PROMO KE FRONTEND
            'rewards' => Reward::with('product')->get(), 
        ]);
    })->name('dashboard');

    // 2. TRANSAKSI
    Route::post('/checkout', [OrderController::class, 'store'])->name('checkout');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');

    // 3. MENU KASIR
    Route::resource('customers', CustomerController::class);

    // 4. PROFILE
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 5. ADMIN GROUP
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