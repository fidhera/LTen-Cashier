import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ProductCreate({ auth, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        price: '',
        stock: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/products');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Add Product" />
            
            <div className="max-w-2xl mx-auto">
                {/* CONTAINER UTAMA: SUDAH FIX DARK MODE */}
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 transition-colors">
                    
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
                        <Link href="/products" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline">
                            Cancel
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                            <input 
                                type="text" 
                                className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 p-3 transition-colors"
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                placeholder="e.g. Americano"
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <select 
                                className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 p-3 transition-colors"
                                value={data.category_id} 
                                onChange={e => setData('category_id', e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <div className="text-red-500 text-xs mt-1">{errors.category_id}</div>}
                        </div>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price (Rp)</label>
                                <input 
                                    type="number" 
                                    className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 p-3 transition-colors"
                                    value={data.price} 
                                    onChange={e => setData('price', e.target.value)} 
                                    placeholder="0"
                                />
                                {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Stock</label>
                                <input 
                                    type="number" 
                                    className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 p-3 transition-colors"
                                    value={data.stock} 
                                    onChange={e => setData('stock', e.target.value)} 
                                    placeholder="0"
                                />
                                {errors.stock && <div className="text-red-500 text-xs mt-1">{errors.stock}</div>}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Product Image</label>
                            <input 
                                type="file" 
                                className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 dark:file:bg-indigo-900/20 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/40 cursor-pointer transition-colors"
                                onChange={e => setData('image', e.target.files[0])} 
                            />
                            {errors.image && <div className="text-red-500 text-xs mt-1">{errors.image}</div>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-indigo-500/30 transition-all"
                        >
                            {processing ? 'Saving...' : 'Save Product'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}