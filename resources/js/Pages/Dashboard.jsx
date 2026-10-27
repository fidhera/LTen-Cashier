import React, { useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { QRCodeCanvas } from "qrcode.react";

export default function Dashboard({ products = [], categories = [], customers = [], rewards = [] }) {
    const { auth, flash, shop_settings } = usePage().props;
    const currentUser = auth?.user || { name: "Guest", role: "cashier" };

    // --- STATE UI ---
    const [cartWidth] = useState(450);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
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
    const [receiptCashPaid, setReceiptCashPaid] = useState(0);
    
    // --- MODAL & LOADING ---
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- QR POPUP STATE ---
    const [showQRModal, setShowQRModal] = useState(false); 
    const [tempInvoiceCode, setTempInvoiceCode] = useState("");

    // --- EFFECT FULLSCREEN LISTENER ---
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error("Gagal mode Fullscreen:", err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // --- LOGIC SUKSES CHECKOUT ---
    useEffect(() => {
        if (flash?.success) {
            const orderData = flash.success;
            setLastOrder(orderData);
            setShowReceipt(true);
            setShowQRModal(false);
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

    // --- FILTER PRODUK BERDASARKAN KATEGORI & PENCARIAN ---
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
        if (product.stock <= 0) return alert("Stok Produk Habis!");
        const existingItem = cart.find((item) => item.id === product.id && !item.redeemed);
        if (existingItem) {
            if (existingItem.qty + 1 > product.stock) {
                return alert(`Stok tidak mencukupi! Tersisa: ${product.stock}`);
            }
            setCart(cart.map((item) => item.id === product.id && !item.redeemed ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...product, qty: 1, redeemed: false, discountAmount: 0, pointsCost: 0 }]);
        }
    };

    const updateQuantity = (index, change) => {
        const item = cart[index];
        if (!item) return;
        const newQty = item.qty + change;
        if (newQty <= 0) {
            removeItem(index);
            return;
        }
        if (newQty > item.stock) {
            return alert(`Stok tidak mencukupi! Maksimal: ${item.stock}`);
        }
        setCart(cart.map((it, i) => i === index ? { ...it, qty: newQty } : it));
    };

    const removeItem = (index) => setCart(cart.filter((_, i) => i !== index));

    // --- LOYALTY & REWARD LOGIC ---
    const customerPoints = selectedCustomer ? selectedCustomer.points || 0 : 0;
    const usedPointsInCart = cart.reduce((sum, item) => sum + (item.redeemed ? item.pointsCost : 0), 0);
    const remainingPoints = customerPoints - usedPointsInCart;

    const handleRedeem = (cartIndex, reward) => {
        if (remainingPoints < reward.min_points) {
            alert(`Poin tidak mencukupi! Sisa: ${remainingPoints}, Butuh: ${reward.min_points}`);
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

    const cancelRedeem = (cartIndex) => {
        setCart(cart.map((item, i) => i === cartIndex ? {
            ...item,
            redeemed: false,
            discountAmount: 0,
            pointsCost: 0,
            rewardId: null
        } : item));
    };

    // --- CUSTOMER SEARCH ---
    const safeCustomers = customers || []; 
    const filteredCustomers = safeCustomers.filter(c => 
        c.name.toLowerCase().includes(customerInput.toLowerCase()) || 
        (c.phone && c.phone.includes(customerInput))
    );
    const selectCustomer = (customer) => { 
        setSelectedCustomer(customer); 
        setCustomerInput(customer.name); 
        setShowCustomerSuggestions(false); 
    };
    const clearCustomer = () => { 
        setSelectedCustomer(null); 
        setCustomerInput(""); 
    };

    // --- TOTAL & TAX CALCULATION ---
    const taxRate = shop_settings?.tax_rate ? shop_settings.tax_rate / 100 : 0.11;
    const subtotalRaw = cart.reduce((sum, item) => sum + (item.price - item.discountAmount) * item.qty, 0);
    const taxRaw = Math.round(subtotalRaw * taxRate);
    const totalRaw = Math.round(subtotalRaw + taxRaw);
    const numericCashPaid = parseFloat(amountPaid) || 0;
    const changeAmount = (paymentMethod === 'cash' && amountPaid !== '') ? (numericCashPaid - totalRaw) : 0;

    // --- CHECKOUT PROCESS ---
    const handlePreCheckout = () => {
        if (cart.length === 0) return alert("Keranjang belanja masih kosong!");
        
        // Validasi jika metode CASH
        if (paymentMethod === 'cash') {
            if (!amountPaid || isNaN(numericCashPaid) || numericCashPaid < totalRaw) {
                return alert("Uang pembayaran tunai kurang dari total tagihan!");
            }
            setReceiptCashPaid(numericCashPaid);
            submitOrderToBackend(); 
        } 
        // Jika metode QRIS
        else {
            const dummyInv = 'INV/' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '/' + Math.floor(1000 + Math.random() * 9000);
            setTempInvoiceCode(dummyInv);
            setShowQRModal(true); 
        }
    };

    const submitOrderToBackend = () => {
        setIsProcessing(true);
        router.post("/checkout", { 
            cart, 
            total_amount: subtotalRaw, 
            payment_method: paymentMethod, 
            customer_id: selectedCustomer?.id,
            cash_amount: paymentMethod === 'cash' ? numericCashPaid : null
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

    const formatRupiah = (number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number || 0);

    const safeRewards = rewards || [];

    return (
        <AuthenticatedLayout user={currentUser}>
            <Head title="POS Cashier" />

            {/* --- MODAL QRIS POPUP --- */}
            {showQRModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center border border-slate-200 dark:border-neutral-800">
                        <div className="p-6 border-b border-slate-100 dark:border-neutral-800">
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">Pembayaran QRIS</h3>
                            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">Total Tagihan: <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{formatRupiah(totalRaw)}</span></p>
                        </div>
                        
                        <div className="p-8 flex justify-center bg-slate-50 dark:bg-neutral-950">
                            <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-200">
                                <QRCodeCanvas 
                                    value={`QRIS:${tempInvoiceCode}|AMOUNT:${totalRaw}`} 
                                    size={200}
                                />
                            </div>
                        </div>

                        <div className="p-6 space-y-3">
                            <p className="text-xs text-slate-500 dark:text-neutral-400 animate-pulse font-medium">Menunggu scan & pembayaran pelanggan...</p>
                            
                            <button 
                                onClick={submitOrderToBackend} 
                                disabled={isProcessing} 
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                            >
                                {isProcessing ? "Memproses..." : "Konfirmasi Pembayaran Selesai"}
                            </button>
                            
                            <button 
                                onClick={() => setShowQRModal(false)} 
                                className="w-full text-slate-500 dark:text-neutral-400 text-sm hover:text-slate-700 dark:hover:text-neutral-200 py-1 font-semibold"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL STRUK (RECEIPT) --- */}
            {showReceipt && lastOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-neutral-800">
                        <div className="bg-emerald-600 p-6 text-center text-white">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="font-extrabold text-2xl">Transaksi Sukses!</h3>
                            <p className="text-emerald-100 text-xs mt-0.5 font-medium">{lastOrder.invoice_code}</p>
                        </div>
                        
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-2 border-b border-dashed border-slate-200 dark:border-neutral-700 pb-3">
                                {(lastOrder.order_items || lastOrder.orderItems || []).map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm text-slate-700 dark:text-neutral-300">
                                        <span className="truncate pr-2 font-medium">{item.product?.name || item.name} x{item.quantity}</span>
                                        <span className="font-bold shrink-0 text-slate-900 dark:text-white">{formatRupiah(item.subtotal)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between text-slate-600 dark:text-neutral-400">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{formatRupiah(lastOrder.total_amount)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-neutral-400">
                                    <span>Pajak ({shop_settings?.tax_rate || 11}%)</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{formatRupiah(lastOrder.tax_amount)}</span>
                                </div>
                                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-neutral-800">
                                    <span>Total Tagihan</span>
                                    <span className="text-indigo-600 dark:text-indigo-400">{formatRupiah(lastOrder.grand_total)}</span>
                                </div>
                            </div>

                            <div className="text-center pt-1">
                                <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-slate-800 dark:text-neutral-200">
                                    Metode: {lastOrder.payment_method?.toUpperCase()}
                                </span>
                            </div>

                            {lastOrder.payment_method === 'cash' && (
                                <div className="space-y-1.5 pt-3 border-t border-dashed border-slate-200 dark:border-neutral-700 text-sm">
                                    <div className="flex justify-between text-slate-600 dark:text-neutral-400">
                                        <span>Uang Diterima</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(lastOrder.cash_amount || receiptCashPaid)}</span>
                                    </div>
                                    <div className="flex justify-between font-black text-emerald-600 dark:text-emerald-400">
                                        <span>Kembalian</span>
                                        <span>{formatRupiah(lastOrder.change_amount !== undefined ? lastOrder.change_amount : ((lastOrder.cash_amount || receiptCashPaid) - lastOrder.grand_total))}</span>
                                    </div>
                                </div>
                            )}

                            {lastOrder.customer && (
                                <div className="text-xs text-center text-slate-600 dark:text-neutral-400 border-t border-slate-100 dark:border-neutral-800 pt-2 font-medium">
                                    Pelanggan: <span className="font-bold text-slate-900 dark:text-white">{lastOrder.customer.name}</span> (Poin: {lastOrder.customer.points})
                                </div>
                            )}

                            {shop_settings?.footer_message && (
                                <p className="text-xs text-center text-slate-400 dark:text-neutral-500 italic pt-1">{shop_settings.footer_message}</p>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-neutral-950 flex gap-3 border-t border-slate-100 dark:border-neutral-800">
                            <button onClick={() => window.print()} className="flex-1 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-white py-3 rounded-xl font-bold hover:shadow-md transition-all">
                                🖨️ Cetak Struk
                            </button>
                            <button onClick={() => setShowReceipt(false)} className="flex-1 bg-slate-900 dark:bg-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-md transition-all">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- LAYOUT UTAMA CASHIER POS --- */}
            <div className="flex h-full overflow-hidden bg-slate-100/70 dark:bg-neutral-950">
                {/* 1. AREA PRODUK & KATALOG (KIRI) */}
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0 bg-slate-100/80 dark:bg-neutral-950 backdrop-blur-md border-b border-slate-200/70 dark:border-neutral-800">
                        <div className="relative w-96">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </span>
                            <input 
                                type="text" 
                                className="w-full bg-white dark:bg-neutral-900 pl-11 pr-4 py-3 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 border border-slate-200/90 dark:border-neutral-800 shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400 transition-all" 
                                placeholder="Cari menu produk..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* Tombol Fullscreen Kiosk Mode */}
                            <button 
                                onClick={toggleFullScreen}
                                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 shadow-sm ${
                                    isFullscreen 
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-600/30" 
                                        : "bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-200 hover:border-indigo-500 hover:text-indigo-600"
                                }`}
                                title={isFullscreen ? "Keluar Layar Penuh" : "Mode Layar Penuh (Kiosk Cafe)"}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                                <span className="hidden sm:inline">{isFullscreen ? "Exit Kiosk" : "Layar Penuh (Kiosk)"}</span>
                            </button>

                            <div className="text-right hidden md:block pl-3 border-l border-slate-200 dark:border-neutral-800">
                                <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{currentUser.name}</p>
                                <p className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 capitalize">{currentUser.role || 'Kasir'}</p>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                        {/* TAB KATEGORI */}
                        <div className="flex gap-2.5 mb-6 overflow-x-auto pb-2 no-scrollbar">
                            <button 
                                onClick={() => setActiveCategory("All")} 
                                className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold whitespace-nowrap transition-all shadow-sm ${activeCategory === "All" ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-slate-900/20 dark:shadow-indigo-600/30 scale-105" : "bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200/90 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800"}`}
                            >
                                Semua Menu
                            </button>
                            {categories && categories.map((cat) => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => setActiveCategory(cat.id)} 
                                    className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold whitespace-nowrap transition-all shadow-sm ${activeCategory === cat.id ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-slate-900/20 dark:shadow-indigo-600/30 scale-105" : "bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200/90 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800"}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* GRID DAFTAR PRODUK */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                            {filteredProducts.map((product) => {
                                const reward = safeRewards.find(r => r.product_id === product.id);
                                const isRedeemable = selectedCustomer && reward && remainingPoints >= reward.min_points;
                                const discountedPrice = reward ? (product.price * (100 - reward.discount_percentage) / 100) : product.price;

                                return (
                                    <div 
                                        key={product.id} 
                                        onClick={() => product.stock > 0 && addToCart(product)} 
                                        className={`group relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
                                        ${product.stock <= 0 ? "opacity-60 grayscale cursor-not-allowed" : ""} 
                                        ${isRedeemable ? "ring-2 ring-amber-400 dark:ring-amber-500 shadow-amber-100 dark:shadow-none" : "border border-slate-200/90 dark:border-neutral-800 shadow-sm"}`}
                                    >
                                        <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-neutral-800 relative overflow-hidden">
                                            {product.image_path ? (
                                                <img src={product.image_path} alt={product.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-neutral-700 text-4xl">
                                                    🍽️
                                                </div>
                                            )}
                                            {product.stock > 0 && (
                                                <div className="absolute top-3 right-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm text-slate-800 dark:text-white border border-slate-200/60 dark:border-neutral-700">
                                                    {product.stock} tersisa
                                                </div>
                                            )}
                                            {product.stock <= 0 && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-extrabold text-xs tracking-wider backdrop-blur-[2px]">
                                                    STOK HABIS
                                                </div>
                                            )}
                                            {isRedeemable && (
                                                <div className="absolute top-3 left-3 bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-xs font-black shadow-lg animate-pulse">
                                                    ⭐ TUKAR {reward.min_points} PTS
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-extrabold text-slate-900 dark:text-white text-base truncate mb-1">{product.name}</h3>
                                            {isRedeemable ? (
                                                <div className="flex flex-col">
                                                    <span className="text-slate-400 dark:text-neutral-500 text-xs line-through font-semibold">{formatRupiah(product.price)}</span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-lg font-black text-indigo-600 dark:text-amber-400">
                                                            {reward.discount_percentage === 100 ? "GRATIS" : formatRupiah(discountedPrice)}
                                                        </span>
                                                        <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold px-2 py-0.5 rounded-lg uppercase">Promo</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-lg font-black text-slate-900 dark:text-neutral-100">{formatRupiah(product.price)}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. AREA KERANJANG ORDER (KANAN) */}
                <aside style={{ width: `${cartWidth}px` }} className="bg-white dark:bg-neutral-900 flex flex-col z-30 shadow-2xl h-full border-l border-slate-200/90 dark:border-neutral-800 shrink-0">
                    <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 dark:border-neutral-800 shrink-0">
                        <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Pesanan Saat Ini</h2>
                        <span className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 text-xs font-bold px-3 py-1 rounded-full">{cart.length} Item</span>
                    </div>

                    {/* LIST ITEM DI KERANJANG */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-neutral-600">
                                <span className="text-4xl mb-2">🛒</span>
                                <p className="font-bold text-sm text-slate-600 dark:text-neutral-400">Keranjang Belanja Kosong</p>
                                <p className="text-xs text-slate-400 mt-1">Pilih menu di samping untuk menambahkan</p>
                            </div>
                        ) : (
                            cart.map((item, index) => {
                                const eligibleReward = safeRewards.find((r) => r.product_id === item.id);
                                return (
                                    <div key={index} className={`flex flex-col gap-2.5 p-4 rounded-2xl border transition-all ${item.redeemed ? "border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-800" : "border-slate-200/80 bg-slate-50/70 dark:bg-neutral-800/50 dark:border-neutral-700/80"}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-2">
                                                <h4 className="font-extrabold text-slate-900 dark:text-neutral-100 text-sm leading-tight">{item.name}</h4>
                                                {item.redeemed ? (
                                                    <div className="flex gap-2 items-center mt-1">
                                                        <span className="text-slate-400 text-xs line-through font-semibold">{formatRupiah(item.price)}</span>
                                                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{formatRupiah(item.price - item.discountAmount)}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm mt-1">{formatRupiah(item.price)}</p>
                                                )}
                                            </div>
                                            <button onClick={() => removeItem(index)} className="text-slate-400 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-400 p-1">✕</button>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl px-2 h-8 shadow-sm">
                                                <button onClick={() => updateQuantity(index, -1)} className="text-slate-600 hover:text-rose-500 font-bold w-6 dark:text-neutral-300">-</button>
                                                <span className="text-xs font-black w-6 text-center text-slate-900 dark:text-white">{item.qty}</span>
                                                <button onClick={() => updateQuantity(index, 1)} className="text-slate-600 hover:text-indigo-600 font-bold w-6 dark:text-neutral-300">+</button>
                                            </div>

                                            {selectedCustomer && eligibleReward && !item.redeemed && (
                                                <button 
                                                    onClick={() => handleRedeem(index, eligibleReward)} 
                                                    disabled={remainingPoints < eligibleReward.min_points} 
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm ${remainingPoints >= eligibleReward.min_points ? "bg-amber-400 text-slate-900 hover:bg-amber-500" : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-neutral-800"}`}
                                                >
                                                    {remainingPoints >= eligibleReward.min_points ? `Klaim (${eligibleReward.min_points} Pts)` : "Poin Kurang"}
                                                </button>
                                            )}

                                            {item.redeemed && (
                                                <button 
                                                    onClick={() => cancelRedeem(index)} 
                                                    className="text-[11px] font-bold text-rose-500 hover:text-rose-600 underline"
                                                >
                                                    Batal Diskon
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* FOOTER & CHECKOUT PANEL */}
                    <div className="p-6 bg-white dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-800 shrink-0 z-40">
                        {/* PILIH PELANGGAN (MEMBERSHIP & LOYALTY) */}
                        <div className="mb-4 relative">
                            <label className="flex justify-between text-xs font-bold text-slate-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                                <span>Pelanggan</span>
                                {selectedCustomer && (
                                    <span className="text-indigo-600 dark:text-amber-400 font-extrabold">Dompet: {remainingPoints} Pts</span>
                                )}
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Ketik nama atau nomor telp..." 
                                    className="w-full bg-slate-50 dark:bg-neutral-800 text-sm font-semibold rounded-2xl border border-slate-200 dark:border-neutral-700 p-3 pl-10 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400" 
                                    value={customerInput} 
                                    onChange={(e) => { 
                                        setCustomerInput(e.target.value); 
                                        setShowCustomerSuggestions(true); 
                                        if (e.target.value === '') setSelectedCustomer(null); 
                                    }} 
                                    onFocus={() => setShowCustomerSuggestions(true)} 
                                />
                                <span className="absolute left-3.5 top-3.5 text-slate-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                                {selectedCustomer && (
                                    <button onClick={clearCustomer} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-rose-500">✕</button>
                                )}
                            </div>

                            {showCustomerSuggestions && customerInput && !selectedCustomer && (
                                <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-2xl shadow-2xl max-h-48 overflow-y-auto z-50 p-1.5 custom-scrollbar">
                                    {filteredCustomers.length > 0 ? filteredCustomers.map((cust) => (
                                        <div 
                                            key={cust.id} 
                                            onClick={() => selectCustomer(cust)} 
                                            className="p-3 hover:bg-indigo-50 dark:hover:bg-neutral-700/60 cursor-pointer rounded-xl flex justify-between items-center group transition-colors"
                                        >
                                            <div>
                                                <p className="font-extrabold text-sm text-slate-900 dark:text-white">{cust.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-neutral-400">{cust.phone || "-"}</p>
                                            </div>
                                            <span className="text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 px-2.5 py-1 rounded-full">
                                                ⭐ {cust.points || 0} Pts
                                            </span>
                                        </div>
                                    )) : (
                                        <div className="p-3 text-xs text-slate-500 dark:text-neutral-400 text-center font-medium">Pelanggan tidak ditemukan.</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* PILIHAN METODE PEMBAYARAN */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <button 
                                onClick={() => setPaymentMethod('cash')} 
                                className={`py-2.5 px-3 rounded-2xl text-sm font-bold border transition-all ${paymentMethod === 'cash' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'}`}
                            >
                                💵 Tunai (Cash)
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('qris')} 
                                className={`py-2.5 px-3 rounded-2xl text-sm font-bold border transition-all ${paymentMethod === 'qris' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300'}`}
                            >
                                💳 QRIS
                            </button>
                        </div>

                        {/* INPUT UANG TUNAI JIKA METODE CASH */}
                        {paymentMethod === 'cash' && (
                            <div className="mb-4 p-3.5 bg-slate-50 dark:bg-neutral-800/70 rounded-2xl border border-slate-200/90 dark:border-neutral-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Uang Diterima</span>
                                    <input 
                                        type="number" 
                                        className="w-36 text-right bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl py-1.5 px-3 text-sm font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                                        placeholder="0" 
                                        value={amountPaid} 
                                        onChange={(e) => setAmountPaid(e.target.value)} 
                                    />
                                </div>
                                <div className="flex justify-between items-center text-sm pt-1 border-t border-slate-200/70 dark:border-neutral-700/70">
                                    <span className="text-slate-600 dark:text-neutral-400 font-medium">Kembalian:</span>
                                    <span className={`font-black ${changeAmount < 0 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>{formatRupiah(changeAmount)}</span>
                                </div>
                            </div>
                        )}

                        {/* RINGKASAN SUB & TOTAL */}
                        <div className="space-y-1.5 mb-4 text-xs text-slate-600 dark:text-neutral-400">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold text-slate-900 dark:text-white">{formatRupiah(subtotalRaw)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Pajak ({shop_settings?.tax_rate || 11}%)</span>
                                <span className="font-semibold text-slate-900 dark:text-white">{formatRupiah(taxRaw)}</span>
                            </div>
                            <div className="flex justify-between items-end pt-2 border-t border-slate-200/80 dark:border-neutral-800">
                                <span className="text-sm font-extrabold text-slate-800 dark:text-neutral-200">Total Tagihan</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white">{formatRupiah(totalRaw)}</span>
                            </div>
                        </div>
                        
                        {/* TOMBOL PROSES CHECKOUT */}
                        <button 
                            onClick={handlePreCheckout} 
                            disabled={isProcessing || cart.length === 0} 
                            className={`w-full py-4 rounded-2xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex justify-center items-center gap-2 ${isProcessing || cart.length === 0 ? "bg-slate-200 dark:bg-neutral-800 text-slate-400 cursor-not-allowed shadow-none" : "bg-slate-900 dark:bg-indigo-600 text-white hover:scale-[1.01]"}`}
                        >
                            {isProcessing ? "Memproses Transaksi..." : (paymentMethod === 'qris' ? "Generate QRIS" : "Bayar Sekarang")}
                        </button>
                    </div>
                </aside>
            </div>
        </AuthenticatedLayout>
    );
}