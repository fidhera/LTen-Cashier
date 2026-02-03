<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('settings', function (Blueprint $table) {
            // Menambah kolom untuk menyimpan path gambar logo (boleh kosong/nullable)
            $table->string('logo_path')->nullable()->after('tax_rate');
        });
    }

    public function down()
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn('logo_path');
        });
    }
};
