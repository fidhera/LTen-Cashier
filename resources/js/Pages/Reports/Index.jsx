import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Reports({ auth, total_revenue, total_transactions, total_items, daily_sales }) {
    
    const revenue = total_revenue || 0;
    const transactions = total_transactions || 0;
    const items = total_items || 0;
    
    // Pastikan data chart aman & terkonversi ke angka
    const chartData = daily_sales?.map(d => ({
        date: d.date,
        total: Number(d.total) // Paksa jadi number biar grafik tidak error
    })) || [];

    // Cari nilai tertinggi untuk skala grafik (Max Height)
    const maxVal = Math.max(...chartData.map(d => d.total)) || 1;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const formatDateShort = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Analytics" />
            
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Business Analytics</h1>

                {/* --- STAT CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Revenue */}
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-xl text-green-600 dark:text-green-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Today's Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatRupiah(revenue)}</h3>
                        </div>
                    </div>

                    {/* Transactions */}
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-xl text-blue-600 dark:text-blue-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Transactions Today</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{transactions} Trx</h3>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-xl text-purple-600 dark:text-purple-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Menu Items</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{items} Items</h3>
                        </div>
                    </div>
                </div>

                {/* --- CHART CONTAINER BARU --- */}
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Revenue Last 7 Days</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Revenue (IDR)
                        </div>
                    </div>
                    
                    {/* CHART AREA */}
                    <div className="h-64 w-full flex items-end justify-between gap-2 md:gap-4">
                        {chartData.length > 0 ? chartData.map((day, index) => {
                            // Hitung tinggi persentase (Min 5% biar bar tetep nongol dikit kalo 0)
                            const heightPercent = day.total > 0 ? (day.total / maxVal) * 100 : 2; 
                            
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                    
                                    {/* TOOLTIP POPUP (Hanya muncul saat Hover) */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center animate-fade-in-up z-10 w-32">
                                        <div className="bg-gray-800 dark:bg-white text-white dark:text-gray-900 text-xs rounded-lg py-2 px-3 shadow-lg text-center">
                                            <p className="font-bold mb-1">{formatRupiah(day.total)}</p>
                                            <p className="text-[10px] opacity-80">{day.date}</p>
                                        </div>
                                        {/* Panah Tooltip */}
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-800 dark:border-t-white"></div>
                                    </div>

                                    {/* BATANG CHART */}
                                    <div 
                                        style={{ height: `${heightPercent}%` }} 
                                        className={`w-full max-w-[50px] rounded-t-lg transition-all duration-500 ease-out cursor-pointer relative overflow-hidden
                                            ${day.total > 0 
                                                ? 'bg-indigo-500 hover:bg-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                                                : 'bg-gray-100 dark:bg-neutral-800 h-2'}
                                        `}
                                    >
                                        {/* Efek Kilau/Gradient Overlay */}
                                        {day.total > 0 && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                        )}
                                    </div>

                                    {/* Label Tanggal */}
                                    <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-3 font-medium">
                                        {formatDateShort(day.date)}
                                    </p>
                                </div>
                            );
                        }) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                                No sales data available yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}