import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CustomerEdit({ auth, customer }) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer?.name || '',
        phone: customer?.phone || '',
        email: customer?.email || '',
        address: customer?.address || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/customers/${customer.id}`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Pelanggan" />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-neutral-800 transition-colors">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-neutral-800">
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Edit Data Pelanggan</h1>
                            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">Poin saat ini: <span className="font-bold text-amber-500">⭐ {customer?.points || 0} Pts</span></p>
                        </div>
                        <Link 
                            href="/customers" 
                            className="text-xs font-semibold text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all"
                        >
                            Batal
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Nama */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                                Nama Lengkap
                            </label>
                            <input 
                                type="text" 
                                className="w-full rounded-2xl border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 p-3 text-sm font-medium transition-colors" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</div>}
                        </div>

                        {/* Telepon */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                                Nomor Telepon / WhatsApp
                            </label>
                            <input 
                                type="text" 
                                className="w-full rounded-2xl border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 p-3 text-sm font-medium transition-colors" 
                                value={data.phone} 
                                onChange={e => setData('phone', e.target.value)} 
                            />
                            {errors.phone && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</div>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                                Email (Opsional)
                            </label>
                            <input 
                                type="email" 
                                className="w-full rounded-2xl border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 p-3 text-sm font-medium transition-colors" 
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                            />
                            {errors.email && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</div>}
                        </div>

                        {/* Alamat */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                                Alamat Domisili
                            </label>
                            <textarea 
                                className="w-full rounded-2xl border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 p-3 text-sm font-medium transition-colors" 
                                rows="3" 
                                value={data.address} 
                                onChange={e => setData('address', e.target.value)}
                            />
                            {errors.address && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.address}</div>}
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan Perubahan...' : 'Perbarui Data Pelanggan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}