<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
// use Midtrans\Config; // Dimatikan agar tidak error kunci
// use Midtrans\Snap;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'cart' => 'required|array|min:1',
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|string', 
            'customer_id' => 'nullable|exists:customers,id',
            'cash_amount' => 'nullable|numeric', 
        ]);

        return DB::transaction(function () use ($request) {
            $setting = Setting::first();
            $taxRate = $setting ? ($setting->tax_rate / 100) : 0.11; 
            
            $invoiceCode = 'INV/' . date('Ymd') . '/' . rand(1000, 9999);
            
            // --- BYPASS MIDTRANS ---
            // Kita langsung set 'paid' agar testing lancar tanpa error kunci API
            $initialStatus = 'paid'; 

            $order = Order::create([
                'invoice_code' => $invoiceCode,
                'user_id' => $request->user()->id,
                'customer_id' => $request->customer_id,
                'total_amount' => $request->total_amount,
                'tax_amount' => $request->total_amount * $taxRate,
                'grand_total' => $request->total_amount * (1 + $taxRate),
                'payment_status' => $initialStatus,
                'payment_method' => $request->payment_method,
            ]);

            // Simpan Item
            foreach ($request->cart as $item) {
                $finalPrice = $item['price'] - ($item['discountAmount'] ?? 0);
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['qty'],
                    'unit_price' => $finalPrice,
                    'subtotal' => $finalPrice * $item['qty'],
                ]);

                // Kurangi Stok
                $product = Product::find($item['id']);
                if ($product) $product->decrement('stock', $item['qty']);
            }

            // --- LOGIC POIN ---
            // Proses poin langsung dijalankan karena status otomatis paid
            if ($request->customer_id) {
                $this->handleLoyaltyPoints($request->customer_id, $request->total_amount, $request->cart);
            }

            return redirect()->back()->with('success', $order->load(['orderItems.product', 'customer']));
        });
    }

    // Helper Poin (Sudah diperbaiki agar tidak minus)
    private function handleLoyaltyPoints($customerId, $totalAmount, $cart) {
        $customer = Customer::find($customerId);
        if ($customer) {
            // 1. Kurangi Poin (Redeem)
            $totalPointsCost = 0;
            foreach ($cart as $item) {
                if (isset($item['redeemed']) && $item['redeemed'] == true) {
                    $totalPointsCost += $item['pointsCost'];
                }
            }
            
            // Validasi Server Side
            if ($totalPointsCost > 0) {
                if ($customer->points >= $totalPointsCost) {
                    $customer->decrement('points', $totalPointsCost);
                }
            }

            // 2. Tambah Poin (Earn)
            $pointsEarned = floor($totalAmount / 20000);
            if ($pointsEarned > 0) {
                $customer->increment('points', $pointsEarned);
            }
        }
    }

    public function index()
    {
        $orders = Order::with(['user', 'orderItems.product', 'customer'])->latest()->paginate(10);
        return Inertia::render('Orders/Index', ['orders' => $orders]);
    }
}