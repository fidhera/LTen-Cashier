import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CustomerIndex({ auth, customers }) {
    const { flash } = usePage().props;
    const handleDelete = (id) => {
        if (confirm('Delete this customer?')) router.delete(`/customers/${id}`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Customers" />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
                    <Link href="/customers/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">+ Add Member</Link>
                </div>
                
                {flash.success && <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-xl mb-6">{flash.success}</div>}
                
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                    <table className="w-full text-left bg-white dark:bg-neutral-900">
                        <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="p-5">Name</th>
                                <th className="p-5">Phone</th>
                                <th className="p-5">Email</th>
                                <th className="p-5">Address</th> 
                                <th className="p-5 text-center">Points</th>
                                <th className="p-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                            {customers.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-400 dark:text-gray-500">No customers yet.</td></tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="p-5 font-bold text-gray-900 dark:text-white">{customer.name}</td>
                                        <td className="p-5 text-gray-500 dark:text-gray-400 text-sm">{customer.phone || '-'}</td>
                                        <td className="p-5 text-gray-500 dark:text-gray-400 text-sm">{customer.email || '-'}</td>
                                        <td className="p-5 text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs" title={customer.address}>{customer.address || '-'}</td>
                                        <td className="p-5 text-center">
                                            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-800">
                                                ⭐ {customer.points || 0}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center">
                                            <button onClick={() => handleDelete(customer.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-bold text-xs bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-800">
                                                Delete
                                            </button>
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