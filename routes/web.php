<?php

use App\Http\Controllers\HorasExtrasController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {

    // Página principal
    Route::get('/', [HorasExtrasController::class, 'index'])->name('home');

    // Dados do funcionário
    Route::post('/horas-extras/dados', [HorasExtrasController::class, 'salvarDados'])->name('horas-extras.dados');

    // Registros de ponto
    Route::post('/horas-extras/registros', [HorasExtrasController::class, 'storeRegistro'])->name('horas-extras.registros.store');
    Route::put('/horas-extras/registros/{id}', [HorasExtrasController::class, 'updateRegistro'])->name('horas-extras.registros.update');
    Route::delete('/horas-extras/registros/{id}', [HorasExtrasController::class, 'destroyRegistro'])->name('horas-extras.registros.destroy');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
