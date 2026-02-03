import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RewardIndex({ auth, rewards }) {
    const { flash } = usePage().props;
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Loyalty Rules" />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loyalty Rewards</h1>
                    <Link href="/rewards/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md">+ Add Rule</Link>
                </div>
                
                {flash.success && <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-xl mb-6">{flash.success}</div>}
                
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                    <table className="w-full text-left bg-white dark:bg-neutral-900">
                        <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="p-5">Product Target</th>
                                <th className="p-5">Points Cost</th>
                                <th className="p-5">Benefit</th>
                                <th className="p-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                            {rewards.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-400 dark:text-gray-500">No rules yet.</td></tr>
                            ) : (
                                rewards.map((rule) => (
                                    <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="p-5 font-bold text-gray-900 dark:text-white">{rule.product?.name}</td>
                                        <td className="p-5 text-orange-600 dark:text-orange-400 font-bold">⭐ {rule.min_points} Pts</td>
                                        <td className="p-5">
                                            {rule.discount_percentage === 100 ? (
                                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">GRATIS (Free)</span>
                                            ) : (
                                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-800">Diskon {rule.discount_percentage}%</span>
                                            )}
                                        </td>
                                        <td className="p-5 text-center">
                                            <button onClick={() => router.delete(`/rewards/${rule.id}`)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold text-xs hover:underline">Delete</button>
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