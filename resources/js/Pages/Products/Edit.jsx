import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ProductEdit({ auth, product, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name,
        category_id: product.category_id,
        price: product.price,
        stock: product.stock,
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/products/${product.id}`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Product" />
            
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
                        <a href="/products" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm">Cancel</a>
                    </div>

                    {/* Preview Image */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
                            <img src={product.image_path} alt="Current" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                            <input 
                                type="text" 
                                className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                            />
                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <select 
                                className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                value={data.category_id} 
                                onChange={e => setData('category_id', e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price (Rp)</label>
                                <input 
                                    type="number" 
                                    className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                    value={data.price} 
                                    onChange={e => setData('price', e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Stock</label>
                                <input 
                                    type="number" 
                                    className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                    value={data.stock} 
                                    onChange={e => setData('stock', e.target.value)} 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Image (Optional)</label>
                            <input 
                                type="file" 
                                className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-neutral-800 dark:file:text-indigo-400"
                                onChange={e => setData('image', e.target.files[0])} 
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-indigo-500/30 transition-all"
                        >
                            {processing ? 'Updating...' : 'Update Product'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}