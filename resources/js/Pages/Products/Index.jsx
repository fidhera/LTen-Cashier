import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ProductIndex({ auth, products }) {
    const { flash } = usePage().props;
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/products/${id}`);
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Product List" />
            
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your food and beverage items</p>
                    </div>
                    <Link href="/products/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2">
                        <span>+ Add New Product</span>
                    </Link>
                </div>

                {/* Flash Message */}
                {flash.success && (
                    <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                        {flash.success}
                    </div>
                )}

                {/* Table Container */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                    <table className="w-full text-left border-collapse bg-white dark:bg-neutral-900">
                        {/* Table Head */}
                        <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-semibold">Image</th>
                                <th className="p-5 font-semibold">Name</th>
                                <th className="p-5 font-semibold">Category</th>
                                <th className="p-5 font-semibold">Price</th>
                                <th className="p-5 font-semibold text-center">Stock</th>
                                <th className="p-5 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        
                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400 dark:text-gray-500">
                                        No products found. Start by adding one!
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="p-5">
                                            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-neutral-800 overflow-hidden border border-gray-200 dark:border-neutral-700">
                                                {product.image_path ? (
                                                    <img src={product.image_path} alt={product.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5 font-bold text-gray-900 dark:text-white">
                                            {product.name}
                                        </td>
                                        <td className="p-5 text-sm">
                                            <span className="bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-neutral-700">
                                                {product.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="p-5 font-medium text-gray-900 dark:text-gray-200">
                                            {formatRupiah(product.price)}
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${product.stock > 10 ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex justify-center gap-3">
                                                <Link href={`/products/${product.id}/edit`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors border border-red-100 dark:border-red-800">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}