import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CustomerCreate({ auth }) {
    const { data, setData, put, processing, errors } = useForm({ name: '', phone: '', email: '', address: '' });
    const submit = (e) => { e.preventDefault(); put('/customers'); };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Add Customer" />
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Member</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                        <input type="text" className="w-full rounded-lg border-slate-300" value={data.name} onChange={e => setData('name', e.target.value)} />
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                        <input type="text" className="w-full rounded-lg border-slate-300" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                        <input type="email" className="w-full rounded-lg border-slate-300" value={data.email} onChange={e => setData('email', e.target.value)} />
                    </div>
                    <button type="submit" disabled={processing} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4">{processing ? 'Saving...' : 'Save Customer'}</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}