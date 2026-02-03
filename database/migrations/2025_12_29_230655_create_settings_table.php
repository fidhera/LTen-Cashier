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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('shop_name');     // Nama Toko (LaraPoint)
            $table->text('address')->nullable(); // Alamat Toko
            $table->string('phone')->nullable(); // No Telp
            $table->integer('tax_rate')->default(11); // Pajak dalam Persen (misal 11)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
