<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('rewards', function (Blueprint $table) {
        $table->id();
        // Produk mana yang dapat promo?
        $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();

        // Berapa poin yang dibutuhkan user? (Misal: 20)
        $table->integer('min_points');

        // Berapa persen diskonnya? (100 = Gratis, 50 = Setengah Harga)
        $table->integer('discount_percentage')->default(100);

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rewards');
    }
};
