<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'setting' => Setting::first()
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'shop_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'tax_rate' => 'required|integer|min:0|max:100',
            'footer_message' => 'nullable|string|max:500', // <--- VALIDASI BARU
            'logo' => 'nullable|image|max:2048',
        ]);

        $setting = Setting::first();
        
        // Ambil data termasuk footer_message
        $data = $request->only(['shop_name', 'address', 'phone', 'tax_rate', 'footer_message']);

        // LOGIKA UPLOAD GAMBAR
        if ($request->hasFile('logo')) {
            // 1. Hapus logo lama jika ada
            if ($setting->logo_path) {
                $oldPath = str_replace('/storage/', '', $setting->logo_path);
                Storage::disk('public')->delete($oldPath);
            }
            // 2. Simpan logo baru
            $path = $request->file('logo')->store('settings', 'public');
            // 3. Simpan path-nya ke database
            $data['logo_path'] = '/storage/' . $path;
        }

        $setting->update($data);

        return redirect()->back()->with('success', 'Shop settings updated successfully!');
    }
}