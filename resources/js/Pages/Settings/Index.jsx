import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SettingsIndex({ auth, setting }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        shop_name: setting?.shop_name || '',
        shop_address: setting?.shop_address || '',
        phone: setting?.phone || '',
        logo: null,
        tax_rate: setting?.tax_rate || 0,
        footer_message: setting?.footer_message || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/settings');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Shop Settings" />
            
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shop Settings</h1>
                    
                    <form onSubmit={submit} className="space-y-6">
                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Shop Logo</label>
                            <div className="flex items-center gap-4">
                                {setting?.logo_path && (
                                    <img src={setting.logo_path} alt="Logo" className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-neutral-700" />
                                )}
                                <input 
                                    type="file" 
                                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-neutral-800 dark:file:text-indigo-400"
                                    onChange={e => setData('logo', e.target.files[0])} 
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, or GIF. Max 2MB.</p>
                        </div>

                        {/* Shop Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Shop Name</label>
                            <input type="text" className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" value={data.shop_name} onChange={e => setData('shop_name', e.target.value)} />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Shop Address</label>
                            <textarea className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" rows="3" value={data.shop_address} onChange={e => setData('shop_address', e.target.value)}></textarea>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                            <input type="text" className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                        </div>

                        {/* Tax */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tax Rate (%)</label>
                            <input type="number" className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" value={data.tax_rate} onChange={e => setData('tax_rate', e.target.value)} />
                        </div>

                        {/* Footer Message */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Receipt Footer Message</label>
                            <input type="text" className="w-full rounded-xl border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" value={data.footer_message} onChange={e => setData('footer_message', e.target.value)} />
                        </div>

                        <button type="submit" disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-indigo-500/30 transition-all">
                            {processing ? 'Saving...' : 'Save Settings'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}