<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        // Cek apakah role user saat ini SAMA dengan role yang diminta
        if ($request->user()->role !== $role) {
            // Kalau beda, tendang ke Dashboard
            return redirect('/dashboard'); 
        }

        return $next($request);
    }
}