<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegistroPonto;
use App\Models\Periodo;
use Illuminate\Http\Request;

class RegistroPontoController extends Controller
{
    public function index(Request $request)
    {
        $registros = $request->user()
            ->registrosPonto()
            ->with('periodos')
            ->orderBy('data', 'desc')
            ->get();

        return response()->json($registros);
    }

    public function store(Request $request)
    {
        $request->validate([
            'data' => 'required|date',
            'observacao' => 'nullable|string',
            'periodos' => 'required|array|min:1',
            'periodos.*.data_entrada' => 'required|date',
            'periodos.*.entrada' => 'required|date_format:H:i',
            'periodos.*.data_saida' => 'required|date',
            'periodos.*.saida' => 'required|date_format:H:i',
        ]);

        $registro = $request->user()->registrosPonto()->create([
            'data' => $request->data,
            'observacao' => $request->observacao,
        ]);

        foreach ($request->periodos as $periodoData) {
            $registro->periodos()->create($periodoData);
        }

        return response()->json($registro->load('periodos'), 201);
    }

    public function show(Request $request, $id)
    {
        $registro = $request->user()
            ->registrosPonto()
            ->with('periodos')
            ->findOrFail($id);

        return response()->json($registro);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'data' => 'required|date',
            'observacao' => 'nullable|string',
            'periodos' => 'required|array|min:1',
            'periodos.*.data_entrada' => 'required|date',
            'periodos.*.entrada' => 'required|date_format:H:i',
            'periodos.*.data_saida' => 'required|date',
            'periodos.*.saida' => 'required|date_format:H:i',
        ]);

        $registro = $request->user()->registrosPonto()->findOrFail($id);

        $registro->update([
            'data' => $request->data,
            'observacao' => $request->observacao,
        ]);

        // Deletar períodos antigos e criar novos
        $registro->periodos()->delete();

        foreach ($request->periodos as $periodoData) {
            $registro->periodos()->create($periodoData);
        }

        return response()->json($registro->load('periodos'));
    }

    public function destroy(Request $request, $id)
    {
        $registro = $request->user()->registrosPonto()->findOrFail($id);
        $registro->delete();

        return response()->json([
            'message' => 'Registro deletado com sucesso',
        ]);
    }
}
