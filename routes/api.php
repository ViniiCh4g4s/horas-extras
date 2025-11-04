<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RegistroPontoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rotas públicas (sem autenticação)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas (com autenticação)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Registros de ponto
    Route::apiResource('registros-ponto', RegistroPontoController::class);
});
