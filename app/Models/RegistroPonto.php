<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistroPonto extends Model
{
    protected $table = 'registros_ponto';

    protected $fillable = [
        'user_id',
        'data',
        'observacao',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function periodos()
    {
        return $this->hasMany(Periodo::class);
    }
}
