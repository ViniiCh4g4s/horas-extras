<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'cargo' => 'nullable|string|max:255',
            'salario' => 'nullable|numeric|min:0',
            'jornada_inicio_1' => 'nullable|date_format:H:i',
            'jornada_fim_1' => 'nullable|date_format:H:i',
            'jornada_inicio_2' => 'nullable|date_format:H:i',
            'jornada_fim_2' => 'nullable|date_format:H:i',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'cargo' => $request->cargo,
            'salario' => $request->salario ?? 0,
            'jornada_inicio_1' => $request->jornada_inicio_1 ?? '08:00',
            'jornada_fim_1' => $request->jornada_fim_1 ?? '12:00',
            'jornada_inicio_2' => $request->jornada_inicio_2 ?? '13:00',
            'jornada_fim_2' => $request->jornada_fim_2 ?? '17:48',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'cargo' => 'nullable|string|max:255',
            'salario' => 'nullable|numeric|min:0',
            'jornada_inicio_1' => 'nullable|date_format:H:i',
            'jornada_fim_1' => 'nullable|date_format:H:i',
            'jornada_inicio_2' => 'nullable|date_format:H:i',
            'jornada_fim_2' => 'nullable|date_format:H:i',
        ]);

        $user = $request->user();
        $user->update($request->only([
            'name',
            'cargo',
            'salario',
            'jornada_inicio_1',
            'jornada_fim_1',
            'jornada_inicio_2',
            'jornada_fim_2',
        ]));

        return response()->json($user);
    }
}
