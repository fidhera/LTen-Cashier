import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RewardCreate({ auth, products }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        min_points: '',
        discount_percentage: 100 // Default Gratis
    });

    const submit = (e) => { e.preventDefault(); post('/rewards'); };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Reward" />
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-xl font-bold text-slate-800 mb-6">Setup New Reward</h1>
                <form onSubmit={submit} className="space-y-4">
                    
                    {/* Pilih Produk */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Product Target</label>
                        <select className="w-full rounded-lg border-slate-300" value={data.product_id} onChange={e => setData('product_id', e.target.value)}>
                            <option value="">-- Select Product --</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        {errors.product_id && <div className="text-red-500 text-xs">{errors.product_id}</div>}
                    </div>

                    {/* Syarat Poin */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Points Required (Cost)</label>
                        <input type="number" className="w-full rounded-lg border-slate-300" placeholder="e.g. 20" value={data.min_points} onChange={e => setData('min_points', e.target.value)} />
                    </div>

                    {/* Diskon (%) */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Discount Percentage (1-100)</label>
                        <div className="flex items-center gap-2">
                            <input type="number" min="1" max="100" className="w-24 rounded-lg border-slate-300" value={data.discount_percentage} onChange={e => setData('discount_percentage', e.target.value)} />
                            <span className="text-slate-500 text-sm">% (100 = Free Item)</span>
                        </div>
                    </div>

                    <button type="submit" disabled={processing} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold mt-4">Save Rule</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}