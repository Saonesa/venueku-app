<?php 

namespace App\Http\Middleware; 

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string ...$roles  // Parameter untuk peran yang diizinkan
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Pastikan user terautentikasi
        if (! $request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Ambil peran user dari database
        $userRole = $request->user()->role;

        // Periksa apakah peran user ada di daftar peran yang diizinkan
        if (! in_array($userRole, $roles)) {
            return response()->json(['message' => 'Unauthorized. Insufficient role.'], 403);
        }

        return $next($request);
    }
}