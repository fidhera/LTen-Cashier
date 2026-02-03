import React, { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { QRCodeCanvas } from "qrcode.react"; // 1. IMPORT QR CODE

export default function Dashboard({ products, categories, customers, rewards }) {
    const { auth, flash, shop_settings } = usePage().props;
    const currentUser = auth?.user || { name: "Guest", role: "cashier" };

    // --- STATE UI ---
    const [cartWidth, setCartWidth] = useState(450);
    
    // --- STATE DATA ---
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products || []);
    const [activeCategory, setActiveCategory] = useState("All");

    // --- CUSTOMER & PAYMENT STATE ---
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerInput, setCustomerInput] = useState("");
    const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
    
    // Payment Logic
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountPaid, setAmountPaid] = useState(""); 
    
    // --- MODAL & LOADING ---
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- 2. STATE BARU UNTUK QR POPUP ---
    const [showQRModal, setShowQRModal] = useState(false); 
    const [tempInvoiceCode, setTempInvoiceCode] = useState("");

    // --- LOGIC SUKSES ---
    useEffect(() => {
        if (flash?.success) {
            const orderData = flash.success;
            setLastOrder(orderData);
            setShowReceipt(true);
            setShowQRModal(false); // Tutup QR jika sukses
            resetCart();
            setIsProcessing(false);
        }
    }, [flash]);

    const resetCart = () => {
        setCart([]);
        setSelectedCustomer(null);
        setCustomerInput("");
        setAmountPaid("");
        setPaymentMethod("cash");
    };

    // --- FILTER PRODUK ---
    useEffect(() => {
        let result = products || [];
        if (activeCategory !== "All") {
            result = result.filter(p => p.category_id === activeCategory || p.category?.name === activeCategory);
        }
        if (searchQuery) {
            result = result.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        setFilteredProducts(result);
    }, [searchQuery, activeCategory, products]);

    // --- CART LOGIC ---
    const addToCart = (product) => {
        if (product.stock <= 0) return alert("Stok Habis!");
        const existingItem = cart.find((item) => item.id === product.id && !item.redeemed);
        if (existingItem) {
            if (existingItem.qty + 1 > product.stock) return alert("Stok tidak mencukupi!");
            setCart(cart.map((item) => item.id === product.id && !item.redeemed ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...product, qty: 1, redeemed: false, discountAmount: 0, pointsCost: 0 }]);
        }
    };

    const updateQuantity = (index, change) => {
        setCart(cart.map((item, i) => i === index ? { ...item, qty: Math.max(1, item.qty + change) } : item));
    };

    const removeItem = (index) => setCart(cart.filter((_, i) => i !== index));

    // --- LOYALTY LOGIC ---
    const customerPoints = selectedCustomer ? selectedCustomer.points || 0 : 0;
    const usedPointsInCart = cart.reduce((sum, item) => sum + (item.redeemed ? item.pointsCost : 0), 0);
    const remainingPoints = customerPoints - usedPointsInCart;

    const handleRedeem = (cartIndex, reward) => {
        if (remainingPoints < reward.min_points) {
            alert(`Poin tidak cukup! Sisa: ${remainingPoints}, Butuh: ${reward.min_points}`);
            return;
        }
        setCart(cart.map((item, i) => i === cartIndex ? { 
            ...item, 
            redeemed: true, 
            discountAmount: item.price * (reward.discount_percentage / 100), 
            pointsCost: reward.min_points, 
            rewardId: reward.id 
        } : item));
    };

    // --- CUSTOMER SEARCH ---
    const safeCustomers = customers || []; 
    const filteredCustomers = safeCustomers.filter(c => 
        c.name.toLowerCase().includes(customerInput.toLowerCase()) || 
        (c.phone && c.phone.includes(customerInput))
    );
    const selectCustomer = (customer) => { setSelectedCustomer(customer); setCustomerInput(customer.name); setShowCustomerSuggestions(false); };
    const clearCustomer = () => { setSelectedCustomer(null); setCustomerInput(""); };

    // --- TOTAL CALCULATION ---
    const taxRate = shop_settings ? shop_settings.tax_rate / 100 : 0.11;
    const subtotalRaw = cart.reduce((sum, item) => sum + (item.price - item.discountAmount) * item.qty, 0);
    const taxRaw = subtotalRaw * taxRate;
    const totalRaw = Math.round(subtotalRaw + taxRaw);
    const changeAmount = (amountPaid && paymentMethod === 'cash') ? (parseFloat(amountPaid) - totalRaw) : 0;

    // --- 3. PEMISAHAN LOGIC TOMBOL ---
    
    // A. Fungsi Pengecekan Awal (Saat Tombol "Process Payment" Diklik)
    const handlePreCheckout = () => {
        if (cart.length === 0) return alert("Cart kosong!");
        
        // Jika CASH: Cek uang cukup dulu, lalu langsung proses
        if (paymentMethod === 'cash') {
            if(amountPaid < totalRaw) return alert("Uang pembayaran kurang!");
            submitOrderToBackend(); 
        } 
        // Jika QRIS: Tampilkan Modal QR Dulu
        else {
            const dummyInv = 'INV/' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '/' + Math.floor(Math.random() * 1000);
            setTempInvoiceCode(dummyInv);
            setShowQRModal(true); 
        }
    };

    // B. Fungsi Kirim ke Backend (Saat "Simulate Success" atau Cash)
    const submitOrderToBackend = () => {
        setIsProcessing(true);
        router.post("/checkout", { 
            cart, 
            total_amount: subtotalRaw, 
            payment_method: paymentMethod, 
            customer_id: selectedCustomer?.id,
            cash_amount: amountPaid 
        }, {
            preserveScroll: true, 
            onError: (errors) => { 
                console.error("ERROR LOG:", errors);
                if (errors.msg) alert(errors.msg); 
                else alert("Gagal memproses transaksi!"); 
                setIsProcessing(false); 
                setShowQRModal(false);
            }
        });
    };

    const formatRupiah = (number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);

    return (
        <AuthenticatedLayout user={currentUser}>
            <Head title="POS Transaction" />

            {/* --- 4. MODAL BARU: QRIS POPUP (TIDAK MENGGANGGU LAYOUT UTAMA) --- */}
            {showQRModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center">
                        <div className="bg-white p-6 border-b">
                            <h3 className="font-bold text-gray-800 text-xl">Scan QRIS</h3>
                            <p className="text-sm text-gray-500">Total: {formatRupiah(totalRaw)}</p>
                        </div>
                        
                        <div className="p-8 flex justify-center bg-gray-50">
                            <div className="p-3 bg-white rounded-xl shadow-sm border">
                                {/* GENERATOR QR CODE */}
                                <QRCodeCanvas 
                                    value={`PAYMENT FOR: ${tempInvoiceCode} | TOTAL: ${totalRaw}`} 
                                    size={200}
                                />
                            </div>
                        </div>

                        <div className="p-6 space-y-3">
                            <p className="text-xs text-gray-400 mb-4 animate-pulse">Menunggu pembayaran...</p>
                            
                            {/* Tombol Simulasi Sukses */}
                            <button onClick={submitOrderToBackend} disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all">
                                {isProcessing ? "Verifying..." : "Simulate Success (Sudah Scan)"}
                            </button>
                            
                            <button onClick={() => setShowQRModal(false)} className="w-full text-gray-400 text-sm hover:text-gray-600">
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL STRUK (RECEIPT) - KODE LAMA --- */}
            {showReceipt && lastOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-neutral-800">
                        <div className="bg-green-500 p-6 text-center">
                            <h3 className="text-white font-bold text-2xl">Payment Success!</h3>
                            <p className="text-green-100">{lastOrder.invoice_code}</p>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="space-y-2 border-b border-dashed border-gray-200 dark:border-neutral-700 pb-4">
                                {lastOrder.order_items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                                        <span>{item.product.name} x{item.quantity}</span>
                                        <span className="font-bold">{formatRupiah(item.subtotal)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2">
                                <span>Total Paid</span>
                                <span>{formatRupiah(lastOrder.grand_total)}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-xs font-bold uppercase bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-white">
                                    Method: {lastOrder.payment_method}
                                </span>
                            </div>
                            {lastOrder.payment_method === 'cash' && (
                                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                    <span>Change (Kembalian)</span>
                                    <span>{formatRupiah(amountPaid - lastOrder.grand_total)}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-neutral-950 flex gap-3">
                            <button onClick={() => window.print()} className="flex-1 bg-white dark:bg-neutral-800 border dark:border-neutral-700 text-gray-700 dark:text-white py-3 rounded-xl font-bold hover:shadow-md transition-all">Print</button>
                            <button onClick={() => setShowReceipt(false)} className="flex-1 bg-neutral-900 dark:bg-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-md transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- LAYOUT UTAMA (KODE LAMA ANDA YANG RAPI) --- */}
            <div className="flex h-full overflow-hidden bg-gray-50 dark:bg-neutral-950">
                {/* 1. AREA PRODUK (KIRI) */}
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0 bg-gray-50 dark:bg-neutral-950">
                        <div className="relative w-96">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
                            <input type="text" className="w-full bg-white dark:bg-neutral-900 pl-10 pr-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 border-none shadow-sm text-gray-900 dark:text-white transition-colors" placeholder="Search menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-700 dark:text-white">{currentUser.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser.role}</p>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {/* TAB KATEGORI */}
                        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
                            <button onClick={() => setActiveCategory("All")} className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeCategory === "All" ? "bg-neutral-900 dark:bg-indigo-600 text-white scale-105 shadow-md" : "bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 shadow-sm"}`}>All Menu</button>
                            {categories && categories.map((cat) => (
                                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat.id ? "bg-neutral-900 dark:bg-indigo-600 text-white scale-105 shadow-md" : "bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 shadow-sm"}`}>{cat.name}</button>
                            ))}
                        </div>

                        {/* GRID MENU */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                            {filteredProducts.map((product) => {
                                const reward = rewards.find(r => r.product_id === product.id);
                                const isRedeemable = selectedCustomer && reward && remainingPoints >= reward.min_points;
                                const discountedPrice = reward ? (product.price * (100 - reward.discount_percentage) / 100) : product.price;

                                return (
                                    <div key={product.id} onClick={() => product.stock > 0 && addToCart(product)} 
                                        className={`group relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
                                        ${product.stock <= 0 ? "opacity-60 grayscale" : ""} 
                                        ${isRedeemable ? "ring-2 ring-yellow-400 dark:ring-yellow-500 shadow-yellow-100 dark:shadow-none" : "border border-gray-100 dark:border-neutral-800 shadow-sm"}`}
                                    >
                                        <div className="aspect-[4/3] w-full bg-gray-100 dark:bg-neutral-800 relative overflow-hidden">
                                            <img src={product.image_path} alt={product.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                                            {product.stock > 0 && <div className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm text-gray-900 dark:text-white">{product.stock} left</div>}
                                            {product.stock <= 0 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xs backdrop-blur-[2px]">OUT OF STOCK</div>}
                                            {isRedeemable && <div className="absolute top-3 left-3 bg-yellow-400 text-neutral-900 px-3 py-1 rounded-full text-xs font-extrabold shadow-lg animate-pulse">⭐ TUKAR {reward.min_points}</div>}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-gray-800 dark:text-white text-lg truncate mb-1">{product.name}</h3>
                                            {isRedeemable ? (
                                                <div className="flex flex-col"><span className="text-gray-400 text-xs line-through">{formatRupiah(product.price)}</span><div className="flex items-center gap-2"><span className="text-xl font-black text-indigo-600 dark:text-yellow-400">{reward.discount_percentage === 100 ? "FREE" : formatRupiah(discountedPrice)}</span><span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Promo</span></div></div>
                                            ) : (
                                                <p className="text-xl font-bold text-gray-900 dark:text-gray-200">{formatRupiah(product.price)}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. AREA KERANJANG (KANAN) */}
                <aside style={{ width: `${cartWidth}px` }} className="bg-white dark:bg-neutral-900 flex flex-col z-30 shadow-2xl h-full border-l border-gray-100 dark:border-neutral-800 shrink-0 transition-none">
                    <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-neutral-800 shrink-0">
                        <h2 className="font-bold text-xl text-gray-800 dark:text-white">Current Order</h2>
                        <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">{cart.length} Items</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-neutral-600">
                                <p className="font-medium">Keranjang Kosong</p>
                            </div>
                        ) : (
                            cart.map((item, index) => {
                                const eligibleReward = rewards.find((r) => r.product_id === item.id);
                                return (
                                    <div key={index} className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all ${item.redeemed ? "border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800" : "border-gray-100 bg-gray-50 dark:bg-neutral-800/50 dark:border-neutral-700"}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm mb-1">{item.name}</h4>
                                                {item.redeemed ? (
                                                    <div className="flex gap-2 items-center"><p className="text-gray-400 text-xs line-through">{formatRupiah(item.price)}</p><p className="text-green-600 dark:text-green-400 font-bold text-sm">{formatRupiah(item.price - item.discountAmount)}</p></div>
                                                ) : (
                                                    <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{formatRupiah(item.price)}</p>
                                                )}
                                            </div>
                                            <button onClick={() => removeItem(index)} className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1">✕</button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg px-2 h-8 shadow-sm">
                                                <button onClick={() => updateQuantity(index, -1)} className="text-gray-600 hover:text-red-500 font-bold w-6 dark:text-gray-400">-</button>
                                                <span className="text-xs font-bold w-6 text-center text-gray-900 dark:text-white">{item.qty}</span>
                                                <button onClick={() => updateQuantity(index, 1)} className="text-gray-600 hover:text-blue-600 font-bold w-6 dark:text-gray-400">+</button>
                                            </div>
                                            {selectedCustomer && eligibleReward && !item.redeemed && (
                                                <button onClick={() => handleRedeem(index, eligibleReward)} disabled={remainingPoints < eligibleReward.min_points} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm ${remainingPoints >= eligibleReward.min_points ? "bg-yellow-400 text-neutral-900 hover:bg-yellow-500" : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-neutral-700"}`}>
                                                    {remainingPoints >= eligibleReward.min_points ? `Claim` : "Kurang Poin"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="p-6 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 shrink-0 z-40">
                        {/* 3. CUSTOMER SELECTOR (SAFE CHECK ADDED) */}
                        <div className="mb-4 relative">
                            <label className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase"><span>Customer</span>{selectedCustomer && <span className="text-indigo-600 dark:text-yellow-400">Wallet: {remainingPoints} Pts</span>}</label>
                            <div className="relative">
                                <input type="text" placeholder="Ketik nama pelanggan..." className="w-full bg-gray-50 dark:bg-neutral-800 text-sm rounded-xl border-none p-3 pl-10 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" value={customerInput} onChange={(e) => { setCustomerInput(e.target.value); setShowCustomerSuggestions(true); if(e.target.value === '') setSelectedCustomer(null); }} onFocus={() => setShowCustomerSuggestions(true)} />
                                <span className="absolute left-3 top-3 text-gray-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></span>
                                {selectedCustomer && <button onClick={clearCustomer} className="absolute right-3 top-3 text-gray-400 hover:text-red-500">✕</button>}
                            </div>
                            {showCustomerSuggestions && customerInput && !selectedCustomer && (
                                <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50 p-1">
                                    {filteredCustomers.length > 0 ? filteredCustomers.map((cust) => (
                                        <div key={cust.id} onClick={() => selectCustomer(cust)} className="p-3 hover:bg-indigo-50 dark:hover:bg-neutral-700 cursor-pointer rounded-lg flex justify-between items-center group"><div><p className="font-bold text-sm text-gray-700 dark:text-white">{cust.name}</p><p className="text-xs text-gray-400">{cust.phone || "-"}</p></div><span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">⭐ {cust.points}</span></div>
                                    )) : <div className="p-3 text-sm text-gray-400 text-center">Tidak ditemukan.</div>}
                                </div>
                            )}
                        </div>

                        {/* PAYMENT METHOD */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <button onClick={() => setPaymentMethod('cash')} className={`py-2 px-3 rounded-lg text-sm font-bold border transition-all ${paymentMethod === 'cash' ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-neutral-800 dark:border-neutral-700'}`}>
                                💵 Cash
                            </button>
                            <button onClick={() => setPaymentMethod('midtrans')} className={`py-2 px-3 rounded-lg text-sm font-bold border transition-all ${paymentMethod === 'midtrans' ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-neutral-800 dark:border-neutral-700'}`}>
                                💳 QRIS / Online
                            </button>
                        </div>

                        {/* CASH INPUT */}
                        {paymentMethod === 'cash' && (
                            <div className="mb-4 p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Uang Diterima</span>
                                    <input type="number" className="w-32 text-right bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg py-1 px-2 text-sm font-bold text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500" 
                                        placeholder="0" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} />
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Kembalian:</span>
                                    <span className={`font-bold ${changeAmount < 0 ? 'text-red-500' : 'text-green-600'}`}>{formatRupiah(changeAmount)}</span>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-end mb-4">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">Total Tagihan</span>
                            <span className="text-2xl font-black text-gray-800 dark:text-white">{formatRupiah(totalRaw)}</span>
                        </div>
                        
                        {/* 5. TOMBOL UTAMA (MENGGUNAKAN LOGIC BARU) */}
                        <button onClick={handlePreCheckout} disabled={isProcessing || cart.length === 0} className={`w-full py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex justify-center items-center gap-2 ${isProcessing || cart.length === 0 ? "bg-gray-100 dark:bg-neutral-800 text-gray-400 cursor-not-allowed" : "bg-neutral-900 dark:bg-indigo-600 text-white hover:scale-[1.02]"}`}>
                            {isProcessing ? "Processing..." : (paymentMethod === 'midtrans' ? "Generate QRIS" : "Process Payment")}
                        </button>
                    </div>
                </aside>
            </div>
        </AuthenticatedLayout>
    );
}