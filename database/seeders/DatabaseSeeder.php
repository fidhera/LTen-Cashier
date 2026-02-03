<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Panggil seeder setting biar Settings Toko gak kosong
        $this->call(SettingSeeder::class);

        // 1. Akun ADMIN (Si Bos)
        User::create([
            'name' => 'Si Bos Admin',
            'email' => 'admin@example.com',
            'role' => 'admin', 
            'password' => Hash::make('password'),
        ]);

        // 2. Akun KASIR (Karyawan)
        User::create([
            'name' => 'Kasir Andalan',
            'email' => 'kasir@example.com',
            'role' => 'cashier',
            'password' => Hash::make('password'),
        ]);
    }
}