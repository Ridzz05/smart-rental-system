<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    /** GET /api/me — return authenticated user or 401 */
    public function me(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        return response()->json(Auth::user());
    }

    /** POST /api/login */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials, $request->boolean('remember', true))) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        $request->session()->regenerate();
        return response()->json(Auth::user());
    }

    /** POST /api/register */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => 'staff',
        ]);

        Auth::login($user);
        $request->session()->regenerate();
        return response()->json($user, 201);
    }

    /** POST /api/logout */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out']);
    }

    /** PUT /api/me — update name and/or profile_picture */
    public function updateProfile(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $data = $request->validate([
            'name'            => ['sometimes', 'string', 'max:255'],
            'profile_picture' => ['sometimes', 'nullable', 'url', 'max:2048'],
        ]);

        /** @var User $user */
        $user = Auth::user();
        $user->update($data);

        return response()->json($user->fresh());
    }
}
