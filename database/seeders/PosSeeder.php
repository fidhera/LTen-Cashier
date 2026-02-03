<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PosSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Admin (Password: password)
        DB::table('users')->insert([
            'name' => 'Kasir Ganteng',
            'email' => 'admin@larapoint.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Buat Kategori
        $catId = DB::table('categories')->insertGetId([
            'name' => 'Burger',
            'slug' => 'burger',
            'icon' => '🍔',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Buat Menu Makanan (Data Dummy)
        $foods = [
            ['Big Mac', 1.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'],
            ['Big Burg', 2.69, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500'],
            ['Double Big', 3.21, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500'],
            ['Origin Burger', 0.99, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500'],
            ['Cheesy Beast', 4.20, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500'],
            ['Chicken Spicy', 2.50, 'https://images.unsplash.com/photo-1619250907583-05f32b719447?w=500'],
        ];

        foreach ($foods as $food) {
            DB::table('products')->insert([
                'category_id' => $catId,
                'name' => $food[0],
                'price' => $food[1],
                'stock' => 100,
                'image_path' => $food[2],
                'is_available' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}