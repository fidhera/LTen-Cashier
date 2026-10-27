import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RewardCreate({ auth, products = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        min_points: '',
        discount_percentage: 100 // Default 100% (Gratis)
    });

    const submit = (e) => { 
        e.preventDefault(); 
        post('/rewards'); 
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tambah Loyalty Rule" />

            <div className="max-w-xl mx-auto">
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-neutral-800 transition-colors">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-neutral-800">
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Tambah Aturan Reward</h1>
                            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Tentukan poin yang dibutuhkan untuk mendapatkan diskon menu</p>
                        </div>
                        <Link 
                            href="/rewards" 
                            className="text-xs font-semibold text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all"
                        >
                            Batal
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Pilih Produk Target */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                                Produk Target
                            </label>
                            <select 
                                className="w-full rounded-2xl border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-sm font-medium p-3 transition-colors" 
                                value={data.product_id} 
                                onChange={e => setData('product_id', e.target.value)}
                            >
                                <option value="">-- Pilih Produk Menu --</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
                                ))}
                            </select>
                            {errors.product_id && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.product_id}</div>}
                        </div>

                        {/* Syarat Poin */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                                Poin Dibutuhkan (Biaya Redeem)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-3.5 text-amber-500 text-sm">⭐</span>
                                <input 
                                    type="number" 
                                    min="1"
                                    className="w-full rounded-2xl border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 pl-10 pr-4 py-3 text-sm font-medium transition-colors" 
                                    placeholder="Contoh: 20" 
                                    value={data.min_points} 
                                    onChange={e => setData('min_points', e.target.value)} 
                                />
                            </div>
                            {errors.min_points && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.min_points}</div>}
                        </div>

                        {/* Diskon (%) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                                Persentase Diskon (1 - 100%)
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="relative w-32">
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max="100" 
                                        className="w-full rounded-2xl border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 p-3 text-sm font-bold text-center transition-colors" 
                                        value={data.discount_percentage} 
                                        onChange={e => setData('discount_percentage', e.target.value)} 
                                    />
                                    <span className="absolute right-3.5 top-3.5 text-slate-400 font-bold text-sm">%</span>
                                </div>
                                <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                                    {Number(data.discount_percentage) === 100 ? "🎉 Menu Gratis (100% Free)" : `Potongan harga ${data.discount_percentage}%`}
                                </span>
                            </div>
                            {errors.discount_percentage && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.discount_percentage}</div>}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan Aturan...' : 'Simpan Aturan Loyalty'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}