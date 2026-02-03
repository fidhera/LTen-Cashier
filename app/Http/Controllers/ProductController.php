<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        // Tampilkan produk terbaru
        return Inertia::render('Products/Index', [
            'products' => Product::with('category')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::all()
        ]);
    }

    public function store(Request $request)
    {
        // --- PERBAIKAN BUG 1: Tambahkan 'min:0' ---
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0', // Gak boleh minus
            'stock' => 'required|integer|min:0', // Gak boleh minus
            // GANTI max:2048 JADI max:10240 (10MB)
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imagePath = '/storage/' . $path;
        }

        Product::create([
            'name' => $request->name,
            'category_id' => $request->category_id,
            'price' => $request->price,
            'stock' => $request->stock,
            'image_path' => $imagePath,
            'is_available' => true,
        ]);

        return redirect()->route('products.index')->with('success', 'Product created successfully!');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::all()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        // --- PERBAIKAN BUG 1: Tambahkan 'min:0' ---
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0', // Gak boleh minus
            'stock' => 'required|integer|min:0', // Gak boleh minus
            // GANTI max:2048 JADI max:10240
            'image' => 'nullable|image|max:10240',
        ]);

        $data = [
            'name' => $request->name,
            'category_id' => $request->category_id,
            'price' => $request->price,
            'stock' => $request->stock,
        ];

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                $oldPath = str_replace('/storage/', '', $product->image_path);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image_path'] = '/storage/' . $path;
        }

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {
        // --- PERBAIKAN BUG 2: JANGAN HAPUS GAMBAR JIKA SOFT DELETE ---
        // Kita matikan fitur hapus gambar ini, supaya kalau produk di-restore, gambarnya masih ada.
        // if ($product->image_path) { ... } (INI DIKOMENTARI/DIHAPUS)

        $product->delete(); // Ini akan melakukan Soft Delete (bukan hapus permanen)

        return redirect()->route('products.index')->with('success', 'Product deleted successfully!');
    }
}