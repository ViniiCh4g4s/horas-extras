<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class RegistrosPontoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'viniciuschagas1008@outlook.com')->first();

        if (!$user) {
            $this->command->error('User viniciuschagas1008@outlook.com not found. Run DatabaseSeeder first.');
            return;
        }

        $registros = [
            ['data' => '2025-04-01', 'periodos' => [
                ['data_entrada' => '2025-04-01', 'entrada' => '08:00', 'data_saida' => '2025-04-01', 'saida' => '12:00'],
                ['data_entrada' => '2025-04-01', 'entrada' => '13:00', 'data_saida' => '2025-04-01', 'saida' => '18:04'],
            ]],
            ['data' => '2025-04-05', 'periodos' => [
                ['data_entrada' => '2025-04-05', 'entrada' => '09:30', 'data_saida' => '2025-04-05', 'saida' => '14:09'],
                ['data_entrada' => '2025-04-05', 'entrada' => '22:24', 'data_saida' => '2025-04-06', 'saida' => '00:42'],
            ]],
            ['data' => '2025-04-08', 'periodos' => [
                ['data_entrada' => '2025-04-08', 'entrada' => '08:00', 'data_saida' => '2025-04-08', 'saida' => '12:00'],
                ['data_entrada' => '2025-04-08', 'entrada' => '13:00', 'data_saida' => '2025-04-08', 'saida' => '19:41'],
            ]],
            ['data' => '2025-04-13', 'periodos' => [
                ['data_entrada' => '2025-04-13', 'entrada' => '20:11', 'data_saida' => '2025-04-13', 'saida' => '23:32'],
            ]],
            ['data' => '2025-04-17', 'periodos' => [
                ['data_entrada' => '2025-04-17', 'entrada' => '08:00', 'data_saida' => '2025-04-17', 'saida' => '12:00'],
                ['data_entrada' => '2025-04-17', 'entrada' => '13:00', 'data_saida' => '2025-04-17', 'saida' => '21:36'],
            ]],
            ['data' => '2025-04-23', 'periodos' => [
                ['data_entrada' => '2025-04-23', 'entrada' => '07:10', 'data_saida' => '2025-04-23', 'saida' => '12:00'],
                ['data_entrada' => '2025-04-23', 'entrada' => '13:00', 'data_saida' => '2025-04-23', 'saida' => '17:48'],
            ]],
            ['data' => '2025-04-26', 'periodos' => [
                ['data_entrada' => '2025-04-26', 'entrada' => '15:26', 'data_saida' => '2025-04-26', 'saida' => '19:20'],
            ]],
            ['data' => '2025-04-30', 'periodos' => [
                ['data_entrada' => '2025-04-30', 'entrada' => '08:00', 'data_saida' => '2025-04-30', 'saida' => '12:00'],
                ['data_entrada' => '2025-04-30', 'entrada' => '13:00', 'data_saida' => '2025-04-30', 'saida' => '17:48'],
                ['data_entrada' => '2025-04-30', 'entrada' => '18:28', 'data_saida' => '2025-04-30', 'saida' => '19:53'],
            ]],
            ['data' => '2025-05-19', 'periodos' => [
                ['data_entrada' => '2025-05-19', 'entrada' => '07:09', 'data_saida' => '2025-05-19', 'saida' => '12:00'],
                ['data_entrada' => '2025-05-19', 'entrada' => '13:00', 'data_saida' => '2025-05-19', 'saida' => '17:48'],
            ]],
            ['data' => '2025-05-22', 'periodos' => [
                ['data_entrada' => '2025-05-22', 'entrada' => '08:00', 'data_saida' => '2025-05-22', 'saida' => '12:00'],
                ['data_entrada' => '2025-05-22', 'entrada' => '13:00', 'data_saida' => '2025-05-22', 'saida' => '17:48'],
                ['data_entrada' => '2025-05-22', 'entrada' => '19:19', 'data_saida' => '2025-05-22', 'saida' => '22:30'],
            ]],
            ['data' => '2025-06-05', 'periodos' => [
                ['data_entrada' => '2025-06-05', 'entrada' => '08:00', 'data_saida' => '2025-06-05', 'saida' => '12:00'],
                ['data_entrada' => '2025-06-05', 'entrada' => '13:00', 'data_saida' => '2025-06-05', 'saida' => '17:48'],
                ['data_entrada' => '2025-06-05', 'entrada' => '19:06', 'data_saida' => '2025-06-05', 'saida' => '21:47'],
            ]],
            ['data' => '2025-06-26', 'periodos' => [
                ['data_entrada' => '2025-06-26', 'entrada' => '05:45', 'data_saida' => '2025-06-26', 'saida' => '12:00'],
                ['data_entrada' => '2025-06-26', 'entrada' => '13:00', 'data_saida' => '2025-06-26', 'saida' => '20:37'],
            ]],
            ['data' => '2025-07-28', 'periodos' => [
                ['data_entrada' => '2025-07-28', 'entrada' => '08:00', 'data_saida' => '2025-07-28', 'saida' => '12:00'],
                ['data_entrada' => '2025-07-28', 'entrada' => '13:00', 'data_saida' => '2025-07-29', 'saida' => '03:44'],
            ]],
            ['data' => '2025-07-29', 'periodos' => [
                ['data_entrada' => '2025-07-29', 'entrada' => '08:00', 'data_saida' => '2025-07-29', 'saida' => '12:00'],
                ['data_entrada' => '2025-07-29', 'entrada' => '13:00', 'data_saida' => '2025-07-30', 'saida' => '15:30'],
            ]],
            ['data' => '2025-07-31', 'periodos' => [
                ['data_entrada' => '2025-07-31', 'entrada' => '08:00', 'data_saida' => '2025-07-31', 'saida' => '12:00'],
                ['data_entrada' => '2025-07-31', 'entrada' => '13:00', 'data_saida' => '2025-08-01', 'saida' => '00:14'],
            ]],
            ['data' => '2025-08-21', 'periodos' => [
                ['data_entrada' => '2025-08-21', 'entrada' => '08:00', 'data_saida' => '2025-08-21', 'saida' => '12:00'],
                ['data_entrada' => '2025-08-21', 'entrada' => '13:00', 'data_saida' => '2025-08-21', 'saida' => '22:01'],
            ]],
            ['data' => '2025-08-22', 'periodos' => [
                ['data_entrada' => '2025-08-22', 'entrada' => '08:00', 'data_saida' => '2025-08-22', 'saida' => '12:00'],
                ['data_entrada' => '2025-08-22', 'entrada' => '13:00', 'data_saida' => '2025-08-22', 'saida' => '20:56'],
            ]],
            ['data' => '2025-08-30', 'periodos' => [
                ['data_entrada' => '2025-08-30', 'entrada' => '10:58', 'data_saida' => '2025-08-31', 'saida' => '00:14'],
            ]],
            ['data' => '2025-09-06', 'periodos' => [
                ['data_entrada' => '2025-09-06', 'entrada' => '07:29', 'data_saida' => '2025-09-06', 'saida' => '12:12'],
            ]],
            ['data' => '2025-09-11', 'periodos' => [
                ['data_entrada' => '2025-09-11', 'entrada' => '08:00', 'data_saida' => '2025-09-11', 'saida' => '12:00'],
                ['data_entrada' => '2025-09-11', 'entrada' => '13:00', 'data_saida' => '2025-09-11', 'saida' => '18:23'],
            ]],
            ['data' => '2025-09-19', 'periodos' => [
                ['data_entrada' => '2025-09-19', 'entrada' => '08:00', 'data_saida' => '2025-09-19', 'saida' => '12:00'],
                ['data_entrada' => '2025-09-19', 'entrada' => '13:00', 'data_saida' => '2025-09-19', 'saida' => '17:48'],
                ['data_entrada' => '2025-09-19', 'entrada' => '17:54', 'data_saida' => '2025-09-19', 'saida' => '20:28'],
            ]],
            ['data' => '2025-09-22', 'periodos' => [
                ['data_entrada' => '2025-09-22', 'entrada' => '08:00', 'data_saida' => '2025-09-22', 'saida' => '12:00'],
                ['data_entrada' => '2025-09-22', 'entrada' => '13:00', 'data_saida' => '2025-09-22', 'saida' => '18:30'],
            ]],
            ['data' => '2025-09-23', 'periodos' => [
                ['data_entrada' => '2025-09-23', 'entrada' => '08:00', 'data_saida' => '2025-09-23', 'saida' => '12:00'],
                ['data_entrada' => '2025-09-23', 'entrada' => '13:00', 'data_saida' => '2025-09-23', 'saida' => '18:20'],
            ]],
            ['data' => '2025-09-27', 'periodos' => [
                ['data_entrada' => '2025-09-27', 'entrada' => '14:23', 'data_saida' => '2025-09-27', 'saida' => '18:21'],
                ['data_entrada' => '2025-09-27', 'entrada' => '20:19', 'data_saida' => '2025-09-27', 'saida' => '23:13'],
            ]],
            ['data' => '2025-09-29', 'periodos' => [
                ['data_entrada' => '2025-09-29', 'entrada' => '08:00', 'data_saida' => '2025-09-29', 'saida' => '12:00'],
                ['data_entrada' => '2025-09-29', 'entrada' => '13:00', 'data_saida' => '2025-09-29', 'saida' => '22:26'],
            ]],
            ['data' => '2025-09-30', 'periodos' => [
                ['data_entrada' => '2025-09-30', 'entrada' => '08:00', 'data_saida' => '2025-09-30', 'saida' => '12:00'],
                ['data_entrada' => '2025-09-30', 'entrada' => '13:00', 'data_saida' => '2025-09-30', 'saida' => '18:23'],
            ]],
            ['data' => '2025-10-03', 'periodos' => [
                ['data_entrada' => '2025-10-03', 'entrada' => '08:00', 'data_saida' => '2025-10-03', 'saida' => '12:00'],
                ['data_entrada' => '2025-10-03', 'entrada' => '13:00', 'data_saida' => '2025-10-03', 'saida' => '19:15'],
            ]],
            ['data' => '2025-10-06', 'periodos' => [
                ['data_entrada' => '2025-10-06', 'entrada' => '08:00', 'data_saida' => '2025-10-06', 'saida' => '12:00'],
                ['data_entrada' => '2025-10-06', 'entrada' => '13:00', 'data_saida' => '2025-10-06', 'saida' => '18:37'],
            ]],
            ['data' => '2025-10-08', 'periodos' => [
                ['data_entrada' => '2025-10-08', 'entrada' => '08:00', 'data_saida' => '2025-10-08', 'saida' => '12:00'],
                ['data_entrada' => '2025-10-08', 'entrada' => '13:00', 'data_saida' => '2025-10-08', 'saida' => '17:48'],
            ]],
            ['data' => '2025-10-09', 'periodos' => [
                ['data_entrada' => '2025-10-09', 'entrada' => '08:00', 'data_saida' => '2025-10-09', 'saida' => '12:00'],
                ['data_entrada' => '2025-10-09', 'entrada' => '13:00', 'data_saida' => '2025-10-09', 'saida' => '17:48'],
            ]],
            ['data' => '2025-10-13', 'periodos' => [
                ['data_entrada' => '2025-10-13', 'entrada' => '07:21', 'data_saida' => '2025-10-13', 'saida' => '12:00'],
                ['data_entrada' => '2025-10-13', 'entrada' => '13:00', 'data_saida' => '2025-10-13', 'saida' => '18:32'],
            ]],
            ['data' => '2025-10-14', 'periodos' => [
                ['data_entrada' => '2025-10-14', 'entrada' => '08:00', 'data_saida' => '2025-10-14', 'saida' => '12:00'],
                ['data_entrada' => '2025-10-14', 'entrada' => '13:00', 'data_saida' => '2025-10-14', 'saida' => '17:48'],
            ]],
            ['data' => '2025-11-12', 'periodos' => [
                ['data_entrada' => '2025-11-12', 'entrada' => '08:00', 'data_saida' => '2025-11-12', 'saida' => '12:00'],
                ['data_entrada' => '2025-11-12', 'entrada' => '13:00', 'data_saida' => '2025-11-12', 'saida' => '21:48'],
            ]],
        ];

        foreach ($registros as $registroData) {
            $registro = $user->registrosPonto()->create([
                'data' => $registroData['data'],
                'observacao' => null,
            ]);

            foreach ($registroData['periodos'] as $periodoData) {
                $registro->periodos()->create($periodoData);
            }
        }

        $this->command->info('✅ 33 registros de ponto com seus períodos foram criados com sucesso!');
    }
}
