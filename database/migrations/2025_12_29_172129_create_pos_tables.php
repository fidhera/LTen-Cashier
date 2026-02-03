<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Settings (Toko)
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('store_name');
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('logo_path')->nullable(); // Untuk logo struk
            $table->integer('tax_percentage')->default(0); // Misal 11%
            $table->integer('service_charge')->default(0); 
            $table->timestamps();
        });

        // 2. Tabel Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique(); // burger-enak
            $table->string('icon')->nullable(); // Class icon atau path gambar
            $table->timestamps();
        });

        // 3. Tabel Products
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('price', 15, 2); // Pakai decimal untuk uang! (15 digit, 2 desimal)
            $table->integer('stock')->default(0);
            $table->string('image_path')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        // 4. Tabel Orders (Transaksi)
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_code')->unique(); // INV-20250101-001
            // User ID diambil dari tabel users bawaan Laravel (kasir)
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
            $table->decimal('total_amount', 15, 2);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('service_charge', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2);
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
            $table->enum('payment_method', ['cash', 'qris', 'transfer'])->default('cash');
            $table->timestamps();
        });

        // 5. Tabel Order Items (Detail Menu yg dibeli)
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade'); // Jgn dihapus kalau produk dihapus (opsional, tp aman cascade dlu buat dev)
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2); // Harga saat transaksi terjadi (penting utk sejarah)
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();
        });

        // 6. Tabel Payments (Integrasi Gateway)
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('external_id')->nullable(); // ID dari Midtrans/Xendit
            $table->string('payment_link')->nullable();
            $table->string('payment_type')->nullable(); // gopay, shopeepay
            $table->string('status')->default('pending');
            $table->json('payload')->nullable(); // Simpan response lengkap gateway
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('settings');
    }
};