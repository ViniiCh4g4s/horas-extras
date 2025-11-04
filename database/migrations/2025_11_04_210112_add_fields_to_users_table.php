<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('cargo')->nullable();
            $table->decimal('salario', 10, 2)->default(0);
            $table->time('jornada_inicio_1')->default('08:00:00');
            $table->time('jornada_fim_1')->default('12:00:00');
            $table->time('jornada_inicio_2')->default('13:00:00');
            $table->time('jornada_fim_2')->default('17:48:00');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['cargo', 'salario', 'jornada_inicio_1', 'jornada_fim_1', 'jornada_inicio_2', 'jornada_fim_2']);
        });
    }
};
