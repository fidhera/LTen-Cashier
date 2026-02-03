<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str; // <--- JANGAN LUPA IMPORT INI

class CategoryController extends Controller
{
    // 1. TAMPILKAN LIST KATEGORI
    // 1. TAMPILKAN LIST KATEGORI + JUMLAH PRODUK
    public function index()
    {
        // withCount('products') adalah magic function Laravel.
        // Dia otomatis membuat kolom baru bernama 'products_count' di setiap data kategori.
        return Inertia::render('Categories/Index', [
            'categories' => Category::withCount('products')->latest()->get()
        ]);
    }

    // 2. TAMPILKAN FORM TAMBAH
    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    // 3. SIMPAN KATEGORI BARU
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        // FITUR BARU: Generate Slug otomatis (Contoh: "Kopi Susu" jadi "kopi-susu")
        Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) // <--- INI SOLUSINYA
        ]);

        return redirect()->route('categories.index')->with('success', 'Category created successfully!');
    }

    // 4. TAMPILKAN FORM EDIT
    public function edit(Category $category)
    {
        return Inertia::render('Categories/Edit', [
            'category' => $category
        ]);
    }

    // 5. UPDATE DATA KATEGORI
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        // Update Slug juga kalau namanya berubah
        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name) // <--- UPDATE SLUG JUGA
        ]);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully!');
    }

    // 6. HAPUS KATEGORI
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->back()->with('success', 'Category deleted successfully!');
    }
}