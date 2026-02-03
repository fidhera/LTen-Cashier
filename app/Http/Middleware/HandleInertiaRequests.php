<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting; // Pastikan ini ada

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            
            // 1. KIRIM DATA USER YANG LOGIN
            'auth' => [
                'user' => $request->user(),
            ],

            // 2. KIRIM PESAN FLASH (Sukses/Gagal)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

            // 3. KIRIM SETTING TOKO (GLOBAL)
            'shop_settings' => fn () => Setting::first(),
        ];
    }
}