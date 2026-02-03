<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        return Inertia::render('Customers/Index', [
            'customers' => Customer::latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        Customer::create($request->all());
        return redirect()->route('customers.index')->with('success', 'Customer added successfully!');
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Customers/Edit', ['customer' => $customer]);
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $customer->update($request->all());
        return redirect()->route('customers.index')->with('success', 'Customer updated successfully!');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->back()->with('success', 'Customer deleted successfully!');
    }
}