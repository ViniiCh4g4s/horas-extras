<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Periodo extends Model
{
    protected $fillable = [
        'registro_ponto_id',
        'data_entrada',
        'entrada',
        'data_saida',
        'saida',
    ];

    protected function casts(): array
    {
        return [
            'data_entrada' => 'date',
            'data_saida' => 'date',
        ];
    }

    public function registroPonto()
    {
        return $this->belongsTo(RegistroPonto::class);
    }
}
