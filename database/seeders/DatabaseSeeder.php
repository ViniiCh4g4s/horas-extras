<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\{App, Hash};

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Só cria o admin fora do ambiente de testes
        if (!App::environment('testing')) {
            $this->createAdminUser();
            $this->call(RegistrosPontoSeeder::class);
        }
    }

    /**
     * Cria o usuário administrador padrão
     */
    private function createAdminUser(): void
    {
        // Cria o usuário administrador padrão (ou recupera se já existir)
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'     => 'Administrador',
                'avatar'   => 'default-1.jpg',
                'password' => Hash::make('password'),
                'cargo'    => 'Desenvolvedor',
                'salario'  => 5000.00,
                'jornada_inicio1' => '08:00',
                'jornada_fim1'    => '12:00',
                'jornada_inicio2' => '13:00',
                'jornada_fim2'    => '17:48',
            ]
        );
    }
}
