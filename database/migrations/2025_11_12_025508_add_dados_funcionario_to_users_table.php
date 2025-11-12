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
            $table->decimal('salario', 10, 2)->nullable();
            $table->time('jornada_inicio1')->nullable();
            $table->time('jornada_fim1')->nullable();
            $table->time('jornada_inicio2')->nullable();
            $table->time('jornada_fim2')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['cargo', 'salario', 'jornada_inicio1', 'jornada_fim1', 'jornada_inicio2', 'jornada_fim2']);
        });
    }
};
