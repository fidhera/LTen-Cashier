<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run()
    {
        Setting::create([
            'shop_name' => 'LaraPoint POS',
            'address' => 'Jl. Teknologi No. 10, Jakarta',
            'phone' => '0812-3456-7890',
            'tax_rate' => 11, // Default 11%
        ]);
    }
}