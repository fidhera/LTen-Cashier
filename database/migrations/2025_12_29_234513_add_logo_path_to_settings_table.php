<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('settings', 'logo_path')) {
            Schema::table('settings', function (Blueprint $table) {
                $table->string('logo_path')->nullable()->after('tax_rate');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('settings', 'logo_path')) {
            Schema::table('settings', function (Blueprint $table) {
                $table->dropColumn('logo_path');
            });
        }
    }
};