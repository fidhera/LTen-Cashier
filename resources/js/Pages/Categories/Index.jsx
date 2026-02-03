import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CategoryIndex({ auth, categories }) {
    const { flash } = usePage().props;
    const handleDelete = (id) => {
        if (confirm('Are you sure? All products in this category might be affected.')) {
            router.delete(`/categories/${id}`);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Categories" />
            
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Organize your menu structure</p>
                    </div>
                    <Link href="/categories/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all">
                        + Add Category
                    </Link>
                </div>

                {flash.success && (
                    <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6">
                        {flash.success}
                    </div>
                )}

                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-semibold w-16 text-center">#</th>
                                <th className="p-5 font-semibold">Category Name</th>
                                <th className="p-5 font-semibold text-center">Total Products</th>
                                <th className="p-5 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-400 dark:text-gray-500">
                                        No categories yet.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category, index) => (
                                    <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="p-5 text-center text-gray-400 dark:text-gray-600 font-mono text-xs">
                                            {index + 1}
                                        </td>
                                        <td className="p-5">
                                            <span className="font-bold text-gray-900 dark:text-white text-base block">{category.name}</span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">/{category.slug || category.name.toLowerCase()}</span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-900/30">
                                                {category.products_count || 0} Items
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex justify-center gap-3">
                                                <Link href={`/categories/${category.id}/edit`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">
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