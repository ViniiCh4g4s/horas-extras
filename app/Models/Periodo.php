<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Periodo extends Model
{
    protected $table = 'periodos';

    protected $fillable = [
        'registro_ponto_id',
        'data_entrada',
        'entrada',
        'data_saida',
        'saida',
    ];

    protected $casts = [
        'data_entrada' => 'date',
        'data_saida' => 'date',
    ];

    public function registroPonto(): BelongsTo
    {
        return $this->belongsTo(RegistroPonto::class, 'registro_ponto_id');
    }
}
