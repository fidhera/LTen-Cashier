<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Ubah tipe kolom jadi STRING agar bisa menampung 'midtrans', 'qris', dll.
            // Kita kasih panjang 50 karakter biar aman.
            $table->string('payment_method', 50)->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Kembalikan ke enum jika di-rollback (Opsional)
            // $table->enum('payment_method', ['cash'])->change();
        });
    }
};