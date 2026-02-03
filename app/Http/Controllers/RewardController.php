<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RewardController extends Controller
{
    public function index()
    {
        // Tampilkan daftar reward beserta nama produknya
        return Inertia::render('Rewards/Index', [
            'rewards' => Reward::with('product')->get()
        ]);
    }

    public function create()
    {
        // Kita butuh daftar produk untuk dipilih di dropdown
        return Inertia::render('Rewards/Create', [
            'products' => Product::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'min_points' => 'required|numeric|min:1',
            'discount_percentage' => 'required|numeric|min:1|max:100',
        ]);

        Reward::create($request->all());

        return redirect()->route('rewards.index')->with('success', 'Reward rule created successfully!');
    }

    public function destroy(Reward $reward)
    {
        $reward->delete();
        return redirect()->back()->with('success', 'Reward rule deleted!');
    }
}