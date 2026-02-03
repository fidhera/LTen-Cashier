import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CategoryCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({ name: '' });
    const submit = (e) => { e.preventDefault(); post('/categories'); };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Category" />
            
            <div className="max-w-2xl mx-auto">
                {/* CONTAINER CARD - SUDAH FIX DARK MODE */}
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 transition-colors">
                    
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Category</h1>
                        <Link href="/categories" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline">
                            Cancel
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category Name</label>
                            <input 
                                type="text" 
                                className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 p-3 transition-colors"
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                placeholder="e.g. Coffee, Dessert, Promo"
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all"
                        >
                            {processing ? 'Saving...' : 'Save Category'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}