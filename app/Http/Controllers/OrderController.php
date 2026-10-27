<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Menyimpan transaksi pesanan baru dari kasir POS.
     * Meliputi perhitungan pajak, pemotongan stok otomatis, dan penambahan loyalty points.
     */
    public function store(Request $request)
    {
        $request->validate([
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.qty' => 'required|integer|min:1',
            'cart.*.price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string', 
            'customer_id' => 'nullable|exists:customers,id',
            'cash_amount' => 'nullable|numeric|min:0', 
        ]);

        return DB::transaction(function () use ($request) {
            $setting = Setting::first();
            $taxRate = $setting && isset($setting->tax_rate) ? ($setting->tax_rate / 100) : 0.11; 
            
            $totalAmount = (float)$request->total_amount;
            $taxAmount = round($totalAmount * $taxRate);
            $grandTotal = round($totalAmount + $taxAmount);

            // Validasi uang tunai jika metode adalah cash
            if ($request->payment_method === 'cash') {
                $cashAmount = (float)($request->cash_amount ?? 0);
                if ($cashAmount < $grandTotal) {
                    throw ValidationException::withMessages([
                        'msg' => 'Nominal uang tunai kurang dari total pembayaran tagihan!'
                    ]);
                }
            }

            $invoiceCode = 'INV/' . date('Ymd') . '/' . rand(1000, 9999);
            $initialStatus = 'paid'; 

            $order = Order::create([
                'invoice_code' => $invoiceCode,
                'user_id' => $request->user()->id,
                'customer_id' => $request->customer_id,
                'total_amount' => $totalAmount,
                'tax_amount' => $taxAmount,
                'grand_total' => $grandTotal,
                'payment_status' => $initialStatus,
                'payment_method' => $request->payment_method,
            ]);

            // Simpan Item & Kurangi Stok Secara Otomatis
            foreach ($request->cart as $item) {
                $product = Product::find($item['id']);
                $requestedQty = (int)$item['qty'];

                if (!$product || $product->stock < $requestedQty) {
                    $name = $product ? $product->name : ($item['name'] ?? 'Produk');
                    $avail = $product ? $product->stock : 0;
                    throw ValidationException::withMessages([
                        'msg' => "Stok produk '{$name}' tidak mencukupi (Tersisa: {$avail}, Diminta: {$requestedQty})!"
                    ]);
                }

                $discountAmount = isset($item['discountAmount']) ? (float)$item['discountAmount'] : 0;
                $finalPrice = max(0, (float)$item['price'] - $discountAmount);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $requestedQty,
                    'unit_price' => $finalPrice,
                    'subtotal' => $finalPrice * $requestedQty,
                ]);

                // Pemotongan stok otomatis
                $product->decrement('stock', $requestedQty);
            }

            // --- PROSES LOYALTY POINTS PELANGGAN ---
            if ($request->customer_id) {
                $this->handleLoyaltyPoints($request->customer_id, $totalAmount, $request->cart);
            }

            // Lampirkan informasi kembalian dan uang cash untuk struk belanja
            $cashAmount = $request->cash_amount ? (float)$request->cash_amount : null;
            $order->cash_amount = $cashAmount;
            $order->change_amount = ($cashAmount && $cashAmount >= $order->grand_total)
                ? round($cashAmount - $order->grand_total)
                : 0;

            return redirect()->back()->with('success', $order->load(['orderItems.product', 'customer']));
        });
    }

    /**
     * Helper perhitungan dan penyesuaian loyalty point pelanggan.
     */
    private function handleLoyaltyPoints($customerId, $totalAmount, $cart)
    {
        $customer = Customer::find($customerId);
        if (!$customer) {
            return;
        }

        // 1. Kurangi Poin (Redeem Promo)
        $totalPointsCost = 0;
        foreach ($cart as $item) {
            if (!empty($item['redeemed']) && !empty($item['pointsCost'])) {
                $totalPointsCost += (int)$item['pointsCost'];
            }
        }
        
        if ($totalPointsCost > 0) {
            if ($customer->points >= $totalPointsCost) {
                $customer->decrement('points', $totalPointsCost);
            } else {
                throw ValidationException::withMessages([
                    'msg' => "Poin pelanggan ({$customer->points} pts) tidak mencukupi untuk redeem promo ({$totalPointsCost} pts)!"
                ]);
            }
        }

        // 2. Tambah Poin (Earn Reward): 1 poin per kelipatan Rp 20.000 belanja
        $pointsEarned = (int)floor($totalAmount / 20000);
        if ($pointsEarned > 0) {
            $customer->increment('points', $pointsEarned);
        }
    }

    /**
     * Menampilkan riwayat seluruh transaksi.
     */
    public function index()
    {
        $orders = Order::with(['user', 'orderItems.product', 'customer'])->latest()->paginate(10);
        return Inertia::render('Orders/Index', ['orders' => $orders]);
    }
}