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

    if (!currentUser) return <div className="p-10 text-center">Loading...</div>;

    return (
        // UBAH DARI SLATE (BIRU) KE NEUTRAL (HITAM/ABU)
        <div className="flex h-screen bg-gray-50 dark:bg-neutral-950 font-sans text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300">
            {/* SIDEBAR */}
            <aside
                className={`${
                    collapsed ? "w-20" : "w-64"
                } bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 hidden md:flex flex-col z-20 transition-all duration-300 ease-in-out shadow-sm`}
            >
                {/* LOGO & TOGGLE */}
                <div className="h-20 flex items-center justify-between px-4 border-b border-gray-100 dark:border-neutral-800 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {shop_settings?.logo_path ? (
                            <img src={shop_settings.logo_path} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                            <div className="h-10 w-10 min-w-[2.5rem] bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                {shop_settings?.shop_name?.charAt(0).toUpperCase() || "L"}
                            </div>
                        )}
                        {!collapsed && (
                            <div className="transition-opacity duration-300">
                                <h1 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white truncate w-32">
                                    {shop_settings?.shop_name || "LaraPoint"}
                                </h1>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Enterprise POS</p>
                            </div>
                        )}
                    </div>
                    {/* Toggle Collapse */}
                    <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hidden lg:block">
                        {collapsed ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                        )}
                    </button>
                </div>

                {/* MENU ITEMS */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
                    <NavItem collapsed={collapsed} href="/dashboard" icon="grid" label="Dashboard" />

                    {currentUser?.role === "admin" && (
                        <>
                            <NavGroup collapsed={collapsed} icon="box" label="Manage Menu" activeUrls={["/products", "/categories"]}>
                                <NavItem collapsed={collapsed} href="/products" icon="dot" label="Product List" />
                                <NavItem collapsed={collapsed} href="/categories" icon="dot" label="Categories" />
                            </NavGroup>
                            <NavItem collapsed={collapsed} href="/reports" icon="chart" label="Analytics" />
                        </>
                    )}

                    <NavItem collapsed={collapsed} href="/orders" icon="clipboard" label="Order History" />
                    
                    <NavGroup collapsed={collapsed} icon="users" label="Membership" activeUrls={["/customers", "/rewards"]}>
                        <NavItem collapsed={collapsed} href="/customers" icon="dot" label="Customer List" />
                        {currentUser?.role === "admin" && <NavItem collapsed={collapsed} href="/rewards" icon="star" label="Loyalty Rules" />}
                    </NavGroup>

                    {currentUser?.role === "admin" && <NavItem collapsed={collapsed} href="/settings" icon="settings" label="Settings" />}
                </nav>

                {/* FOOTER */}
                <div className="p-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900">
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg mb-2 transition-colors ${collapsed ? 'justify-center' : ''} ${darkMode ? 'bg-neutral-800 text-yellow-400' : 'bg-white border border-gray-200 text-gray-500 hover:text-indigo-600'}`}
                    >
                        {darkMode ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        )}
                        {!collapsed && <span className="text-xs font-bold">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>

                    <div className="mt-2">
                        <Link href="/logout" method="post" as="button" className={`w-full flex items-center gap-3 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors ${collapsed ? 'justify-center' : ''}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-20 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
                    <div className="flex-1">{header}</div>
                    <div className="text-right ml-4">
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser.role || "User"}</p>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8" id="main-content">
                    {children}
                </div>
            </main>
        </div>
    );
}

// --- KOMPONEN PENDUKUNG (Updated Colors) ---
function NavGroup({ icon, label, children, activeUrls = [], collapsed }) {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const isActiveGroup = activeUrls.some((url) => currentPath.startsWith(url));
    const [isOpen, setIsOpen] = useState(isActiveGroup);
    
    useEffect(() => { if(collapsed) setIsOpen(false); }, [collapsed]);

    const icons = {
        box: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>,
        users: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>,
    };

    return (
        <div className="mb-1 relative group">
            <button
                onClick={() => !collapsed && setIsOpen(!isOpen)}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-all duration-200 ${isActiveGroup ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"}`}
            >
                <div className="flex items-center gap-3">
                    <svg className={`w-5 h-5 ${isActiveGroup ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[icon]}</svg>
                    {!collapsed && <span className="font-medium text-sm">{label}</span>}
                </div>
                {!collapsed && (
                    <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                )}
            </button>
            {(isOpen && !collapsed) && <div className="mt-1 ml-4 border-l-2 border-gray-100 dark:border-neutral-800 pl-2 space-y-1">{children}</div>}
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

    const className = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
        active ? "bg-neutral-900 dark:bg-indigo-600 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
    } ${collapsed ? 'justify-center' : ''}`;

    const content = (
        <>
            <svg className={`w-5 h-5 ${active ? "text-white" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[icon]}</svg>
            {!collapsed && <span className="font-medium text-sm">{label}</span>}
        </>
    );

    if (as === "button") return <Link href={href} method={method} as="button" className={className}>{content}</Link>;
    return <Link href={href} className={className}>{content}</Link>;
}