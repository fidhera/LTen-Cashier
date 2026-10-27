import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AuthenticatedLayout({ user, header, children }) {
    const { props } = usePage();
    const shop_settings = props.shop_settings || {};
    const auth = props.auth || {};
    const currentUser = user || auth.user;

    // --- STATE UI ---
    const [collapsed, setCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );
    const [isFullscreen, setIsFullscreen] = useState(false);

    // --- EFFECT DARK MODE ---
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

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
                console.error("Gagal mengaktifkan mode Full Screen:", err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    if (!currentUser) return <div className="p-10 text-center font-medium text-slate-500">Memuat sesi...</div>;

    return (
        <div className="flex h-screen bg-slate-100/70 dark:bg-neutral-950 font-sans text-slate-800 dark:text-gray-100 overflow-hidden transition-colors duration-300">
            {/* SIDEBAR */}
            <aside
                className={`${
                    collapsed ? "w-20" : "w-64"
                } bg-white dark:bg-[#121214] border-r border-slate-200/90 dark:border-neutral-800 hidden md:flex flex-col z-20 transition-all duration-300 ease-in-out shadow-sm`}
            >
                {/* LOGO & TOGGLE */}
                <div className="h-20 flex items-center justify-between px-4 border-b border-slate-100 dark:border-neutral-800/80 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {shop_settings?.logo_path ? (
                            <img src={shop_settings.logo_path} alt="Logo" className="h-10 w-10 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-neutral-700" />
                        ) : (
                            <div className="h-10 w-10 min-w-[2.5rem] bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/20">
                                {shop_settings?.shop_name?.charAt(0).toUpperCase() || "L"}
                            </div>
                        )}
                        {!collapsed && (
                            <div className="transition-opacity duration-300">
                                <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white truncate w-32">
                                    {shop_settings?.shop_name || "LTen POS"}
                                </h1>
                                <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Enterprise POS</p>
                            </div>
                        )}
                    </div>
                    {/* Toggle Collapse */}
                    <button 
                        onClick={() => setCollapsed(!collapsed)} 
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors hidden lg:block"
                        title={collapsed ? "Perlebar Sidebar" : "Perkecil Sidebar"}
                    >
                        {collapsed ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                        )}
                    </button>
                </div>

                {/* MENU ITEMS */}
                <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 custom-scrollbar">
                    <NavItem collapsed={collapsed} href="/dashboard" icon="grid" label="Kasir (POS)" />

                    {currentUser?.role === "admin" && (
                        <>
                            <NavGroup collapsed={collapsed} icon="box" label="Kelola Menu" activeUrls={["/products", "/categories"]}>
                                <NavItem collapsed={collapsed} href="/products" icon="dot" label="Daftar Produk" />
                                <NavItem collapsed={collapsed} href="/categories" icon="dot" label="Kategori Menu" />
                            </NavGroup>
                            <NavItem collapsed={collapsed} href="/reports" icon="chart" label="Laporan Analitik" />
                        </>
                    )}

                    <NavItem collapsed={collapsed} href="/orders" icon="clipboard" label="Riwayat Pesanan" />
                    
                    <NavGroup collapsed={collapsed} icon="users" label="Member & Promo" activeUrls={["/customers", "/rewards"]}>
                        <NavItem collapsed={collapsed} href="/customers" icon="dot" label="Data Pelanggan" />
                        {currentUser?.role === "admin" && <NavItem collapsed={collapsed} href="/rewards" icon="star" label="Loyalty Rules" />}
                    </NavGroup>

                    {currentUser?.role === "admin" && <NavItem collapsed={collapsed} href="/settings" icon="settings" label="Pengaturan Toko" />}
                </nav>

                {/* FOOTER ACTIONS */}
                <div className="p-3.5 border-t border-slate-100 dark:border-neutral-800/80 bg-slate-50/70 dark:bg-neutral-900/60 space-y-1.5">
                    {/* Full Screen Button in Sidebar */}
                    <button 
                        onClick={toggleFullScreen}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${collapsed ? 'justify-center' : ''} ${isFullscreen ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white dark:bg-neutral-800 border border-slate-200/90 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
                        title={isFullscreen ? "Keluar Full Screen" : "Mode Layar Penuh (Kiosk)"}
                    >
                        {isFullscreen ? (
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                        )}
                        {!collapsed && <span className="text-xs font-bold">{isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh (Kiosk)'}</span>}
                    </button>

                    {/* Dark Mode Toggle */}
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${collapsed ? 'justify-center' : ''} ${darkMode ? 'bg-neutral-800 text-yellow-400 border border-neutral-700' : 'bg-white border border-slate-200/90 text-slate-700 hover:text-indigo-600'}`}
                        title={darkMode ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
                    >
                        {darkMode ? (
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        ) : (
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        )}
                        {!collapsed && <span className="text-xs font-bold">{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>}
                    </button>

                    {/* Logout */}
                    <Link 
                        href="/logout" 
                        method="post" 
                        as="button" 
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-slate-500 dark:text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors ${collapsed ? 'justify-center' : ''}`}
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        {!collapsed && <span className="text-xs font-semibold">Keluar Akun</span>}
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-20 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-neutral-800 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
                    <div className="flex-1">{header}</div>
                    
                    <div className="flex items-center gap-3 ml-4">
                        {/* Quick Fullscreen Button in Header */}
                        <button 
                            onClick={toggleFullScreen}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
                                isFullscreen 
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-600/30" 
                                    : "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-200 hover:border-indigo-500 hover:text-indigo-600"
                            }`}
                            title={isFullscreen ? "Keluar dari Layar Penuh" : "Tampilkan Layar Penuh (Kiosk Cafe)"}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                            <span className="hidden sm:inline">{isFullscreen ? "Exit Kiosk" : "Layar Penuh"}</span>
                        </button>

                        <div className="text-right pl-2 border-l border-slate-200 dark:border-neutral-800">
                            <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{currentUser.name}</p>
                            <p className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 capitalize">{currentUser.role || "Kasir"}</p>
                        </div>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar" id="main-content">
                    {children}
                </div>
            </main>
        </div>
    );
}

// --- KOMPONEN PENDUKUNG ---
function NavGroup({ icon, label, children, activeUrls = [], collapsed }) {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const isActiveGroup = activeUrls.some((url) => currentPath.startsWith(url));
    const [isOpen, setIsOpen] = useState(isActiveGroup);
    
    useEffect(() => { if (collapsed) setIsOpen(false); }, [collapsed]);

    const icons = {
        box: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>,
        users: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>,
    };

    return (
        <div className="mb-1 relative group">
            <button
                onClick={() => !collapsed && setIsOpen(!isOpen)}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-xl transition-all duration-200 ${isActiveGroup ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold" : "text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800/70 hover:text-slate-900 dark:hover:text-white"}`}
            >
                <div className="flex items-center gap-3">
                    <svg className={`w-5 h-5 shrink-0 ${isActiveGroup ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-neutral-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[icon]}</svg>
                    {!collapsed && <span className="font-semibold text-sm">{label}</span>}
                </div>
                {!collapsed && (
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                )}
            </button>
            {(isOpen && !collapsed) && <div className="mt-1 ml-4 border-l-2 border-indigo-100 dark:border-neutral-800 pl-2 space-y-1">{children}</div>}
        </div>
    );
}

function NavItem({ href, icon, label, method = "get", as, collapsed }) {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    let active = currentPath === href;
    if (href !== "/dashboard" && currentPath.startsWith(href)) active = true;

    const icons = {
        grid: <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>,
        clipboard: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>,
        settings: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>,
        logout: <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>,
        chart: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>,
        dot: <circle cx="12" cy="12" r="3"></circle>,
        star: <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
    };

    const className = `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
        active 
            ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20" 
            : "text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800/70 hover:text-slate-900 dark:hover:text-white"
    } ${collapsed ? 'justify-center' : ''}`;

    const content = (
        <>
            <svg className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:text-neutral-500 dark:group-hover:text-white"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[icon]}</svg>
            {!collapsed && <span className="font-semibold text-sm">{label}</span>}
        </>
    );

    if (as === "button") return <Link href={href} method={method} as="button" className={className}>{content}</Link>;
    return <Link href={href} className={className}>{content}</Link>;
}