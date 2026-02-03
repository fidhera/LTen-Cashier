<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // 1. Hitung Omzet HARI INI
        $todayRevenue = Order::whereDate('created_at', Carbon::today())
            ->where('payment_status', 'paid')
            ->sum('grand_total');

        // 2. Hitung Transaksi HARI INI
        $todayTransactions = Order::whereDate('created_at', Carbon::today())
            ->where('payment_status', 'paid')
            ->count();

        // 3. Hitung Total Menu
        $totalItems = Product::count();

        // 4. Data Grafik 7 Hari Terakhir
        // Kita ambil data mentah dari DB
        $rawSales = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(grand_total) as total')
            )
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        // Kita format ulang agar tanggal yang KOSONG tetap muncul dengan nilai 0
        $formattedSales = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            
            // Cari data di rawSales yang tanggalnya cocok
            // Kita pakai strict comparison di tanggal string
            $sale = $rawSales->first(function($item) use ($date) {
                return $item->date == $date;
            });

            $formattedSales[] = [
                'date' => $date,
                'total' => $sale ? floatval($sale->total) : 0 // Paksa float agar JS membacanya sebagai angka
            ];
        }

        return Inertia::render('Reports/Index', [
            'total_revenue' => $todayRevenue,
            'total_transactions' => $todayTransactions,
            'total_items' => $totalItems,
            'daily_sales' => $formattedSales
        ]);
    }
}