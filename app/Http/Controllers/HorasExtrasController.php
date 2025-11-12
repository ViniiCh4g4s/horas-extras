<?php

namespace App\Http\Controllers;

use App\Models\RegistroPonto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HorasExtrasController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $registros = $user->registrosPonto()->with('periodos')->orderBy('data', 'desc')->get();

        // Formatar as datas para o formato esperado pelo frontend
        $registrosFormatados = $registros->map(function ($registro) {
            return [
                'id' => $registro->id,
                'data' => $registro->data->format('Y-m-d'),
                'observacao' => $registro->observacao,
                'periodos' => $registro->periodos->map(function ($periodo) {
                    return [
                        'id' => $periodo->id,
                        'data_entrada' => $periodo->data_entrada->format('Y-m-d'),
                        'entrada' => substr($periodo->entrada, 0, 5), // Remove segundos (HH:MM)
                        'data_saida' => $periodo->data_saida->format('Y-m-d'),
                        'saida' => substr($periodo->saida, 0, 5), // Remove segundos (HH:MM)
                    ];
                }),
            ];
        });

        return Inertia::render('HorasExtras/Index', [
            'dados' => [
                'nome' => $user->name,
                'cargo' => $user->cargo,
                'salario' => $user->salario,
                'jornadaInicio1' => $user->jornada_inicio1,
                'jornadaFim1' => $user->jornada_fim1,
                'jornadaInicio2' => $user->jornada_inicio2,
                'jornadaFim2' => $user->jornada_fim2,
            ],
            'registros' => $registrosFormatados,
        ]);
    }

    public function salvarDados(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'salario' => 'required|numeric|min:0',
            'jornadaInicio1' => 'required',
            'jornadaFim1' => 'required',
            'jornadaInicio2' => 'required',
            'jornadaFim2' => 'required',
        ]);

        auth()->user()->update([
            'name' => $validated['nome'],
            'cargo' => $validated['cargo'],
            'salario' => $validated['salario'],
            'jornada_inicio1' => $validated['jornadaInicio1'],
            'jornada_fim1' => $validated['jornadaFim1'],
            'jornada_inicio2' => $validated['jornadaInicio2'],
            'jornada_fim2' => $validated['jornadaFim2'],
        ]);

        return back();
    }

    public function storeRegistro(Request $request)
    {
        $validated = $request->validate([
            'data' => 'required|date',
            'observacao' => 'nullable|string',
            'periodos' => 'required|array|min:1',
            'periodos.*.data_entrada' => 'required|date',
            'periodos.*.entrada' => 'required',
            'periodos.*.data_saida' => 'required|date',
            'periodos.*.saida' => 'required',
        ]);

        $registro = auth()->user()->registrosPonto()->create([
            'data' => $validated['data'],
            'observacao' => $validated['observacao'],
        ]);

        foreach ($validated['periodos'] as $periodo) {
            $registro->periodos()->create([
                'data_entrada' => $periodo['data_entrada'],
                'entrada' => $periodo['entrada'],
                'data_saida' => $periodo['data_saida'],
                'saida' => $periodo['saida'],
            ]);
        }

        return back();
    }

    public function updateRegistro(Request $request, $id)
    {
        $validated = $request->validate([
            'data' => 'required|date',
            'observacao' => 'nullable|string',
            'periodos' => 'required|array|min:1',
            'periodos.*.data_entrada' => 'required|date',
            'periodos.*.entrada' => 'required',
            'periodos.*.data_saida' => 'required|date',
            'periodos.*.saida' => 'required',
        ]);

        $registro = auth()->user()->registrosPonto()->findOrFail($id);

        $registro->update([
            'data' => $validated['data'],
            'observacao' => $validated['observacao'],
        ]);

        $registro->periodos()->delete();

        foreach ($validated['periodos'] as $periodo) {
            $registro->periodos()->create([
                'data_entrada' => $periodo['data_entrada'],
                'entrada' => $periodo['entrada'],
                'data_saida' => $periodo['data_saida'],
                'saida' => $periodo['saida'],
            ]);
        }

        return back();
    }

    public function destroyRegistro($id)
    {
        $registro = auth()->user()->registrosPonto()->findOrFail($id);
        $registro->delete();

        return back();
    }
}
