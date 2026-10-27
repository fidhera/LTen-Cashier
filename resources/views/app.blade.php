<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <!-- SEO Primary Meta Tags -->
        <title inertia>{{ config('app.name', 'LTen POS') }} - Smart Point of Sale & Cashier Management System</title>
        <meta name="title" content="LTen POS - Modern Cloud & Kiosk Point of Sale System">
        <meta name="description" content="LTen POS adalah aplikasi kasir (Point of Sale) modern, cepat, dan responsif untuk cafe, resto, dan retail. Dilengkapi fitur manajemen menu, diskon loyalty points, checkout QRIS, kalkulasi pajak, dan riwayat pesanan realtime.">
        <meta name="keywords" content="POS, Point of Sale, Aplikasi Kasir, Kasir Cafe, Kasir Restoran, POS Kiosk, Loyalty Points, QRIS, Sistem Kasir Laravel, LTen Cashier">
        <meta name="author" content="LTen POS System">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- PWA / Fullscreen Kiosk Mode Tags -->
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="LTen POS">
        <meta name="theme-color" content="#4f46e5" media="(prefers-color-scheme: light)">
        <meta name="theme-color" content="#0a0a0c" media="(prefers-color-scheme: dark)">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="LTen POS - Smart Point of Sale & Cashier Management">
        <meta property="og:description" content="Aplikasi kasir modern, cepat, dan responsif untuk cafe & resto dengan dukungan offline-ready, barcode/QRIS, dan loyalty rewards.">
        <meta property="og:site_name" content="LTen Cashier">
        <meta property="og:locale" content="{{ str_replace('-', '_', app()->getLocale()) }}">

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="LTen POS - Smart Point of Sale">
        <meta name="twitter:description" content="Aplikasi kasir cafe dan restoran modern berkecepatan tinggi dengan kalkulasi pajak dan loyalitas pelanggan.">

        <!-- Favicon -->
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234f46e5'><path d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'/></svg>">

        <!-- Performance Preconnect & Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link rel="dns-prefetch" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700,800,900&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased text-slate-800 dark:text-neutral-100 bg-slate-100/70 dark:bg-neutral-950 selection:bg-indigo-500 selection:text-white">
        @inertia
    </body>
</html>
