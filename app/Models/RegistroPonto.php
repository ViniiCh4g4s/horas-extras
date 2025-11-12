<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RegistroPonto extends Model
{
    protected $table = 'registros_ponto';

    protected $fillable = [
        'user_id',
        'data',
        'observacao',
    ];

    protected $casts = [
        'data' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function periodos(): HasMany
    {
        return $this->hasMany(Periodo::class, 'registro_ponto_id');
    }
}
