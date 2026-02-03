import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function OrderHistory({ orders }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user || { name: 'User', role: 'cashier' };

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <AuthenticatedLayout user={currentUser}>
            <Head title="Order History" />

            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Transaction History</h1>

                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="p-5">Invoice</th>
                                <th className="p-5">Date</th>
                                <th className="p-5">Customer</th>
                                <th className="p-5">Cashier</th>
                                <th className="p-5">Total</th>
                                <th className="p-5 text-center">Items</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
                            {orders.data.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <td className="p-5 font-bold text-gray-900 dark:text-white">
                                        {order.invoice_code}
                                        <div className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 inline-block px-2 py-0.5 rounded ml-2 border border-green-100 dark:border-green-800">
                                            {order.payment_method}
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(order.created_at)}
                                    </td>
                                    <td className="p-5 text-sm">
                                        {order.customer ? (
                                            <div>
                                                <span className="font-bold text-indigo-600 dark:text-indigo-400 block">{order.customer.name}</span>
                                                <span className="text-xs text-gray-400">Phone: {order.customer.phone || '-'}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">Guest</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {order.user?.name || 'Unknown'}
                                    </td>
                                    <td className="p-5 font-bold text-gray-900 dark:text-white">
                                        {formatRupiah(order.grand_total)}
                                    </td>
                                    <td className="p-5 text-center text-sm text-gray-500 dark:text-gray-400">
                                        {order.order_items?.length || 0} Items
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Pagination */}
                    {orders.links && (
                        <div className="p-4 border-t border-gray-100 dark:border-neutral-800 flex justify-center gap-2 bg-gray-50 dark:bg-neutral-900">
                            {orders.links.map((link, i) => (
                                link.url ? (
                                    <a key={i} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-gray-900 dark:bg-indigo-600 text-white' : 'bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'}`} />
                                ) : (
                                    <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-3 py-1 text-gray-300 dark:text-gray-600 text-sm" />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}