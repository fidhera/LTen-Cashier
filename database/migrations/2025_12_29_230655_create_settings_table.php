<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Hapus tabel settings cacat bawaan dari pos_tables
        Schema::dropIfExists('settings');

        // 2. Bikin tabel settings yang lengkap dan sempurna
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('shop_name')->default('LTen Store');
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->integer('tax_rate')->default(11);
            $table->string('logo_path')->nullable(); // Logo path sekalian ditaruh sini
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};