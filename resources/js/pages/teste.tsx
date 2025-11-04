import {
    Calculator,
    Calendar,
    Clock,
    DollarSign,
    Edit2,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface Periodo {
    id: string;
    dataEntrada: string;
    entrada: string;
    dataSaida: string;
    saida: string;
}

interface RegistroPonto {
    id: string;
    data: string;
    periodos: Periodo[];
    observacao?: string;
}

interface DadosFuncionario {
    nome: string;
    cargo: string;
    salario: number;
    jornadaInicio1: string;
    jornadaFim1: string;
    jornadaInicio2: string;
    jornadaFim2: string;
}

export default function CalculadoraHorasExtras() {
    const [dados, setDados] = useState<DadosFuncionario>({
        nome: '',
        cargo: '',
        salario: 0,
        jornadaInicio1: '08:00',
        jornadaFim1: '12:00',
        jornadaInicio2: '13:00',
        jornadaFim2: '17:48',
    });

    const [registros, setRegistros] = useState<RegistroPonto[]>([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(false);
    const [registroEditando, setRegistroEditando] = useState<string | null>(
        null,
    );
    const [trimestreSelecionado, setTrimestreSelecionado] = useState<number>(0); // 0=todos, 1-4=trimestres

    const [novoRegistro, setNovoRegistro] = useState<RegistroPonto>({
        id: '',
        data: new Date().toISOString().split('T')[0],
        periodos: [
            {
                id: '1',
                dataEntrada: new Date().toISOString().split('T')[0],
                entrada: '',
                dataSaida: new Date().toISOString().split('T')[0],
                saida: '',
            },
        ],
        observacao: '',
    });

    // Carregar dados do localStorage
    useEffect(() => {
        const dadosSalvos = localStorage.getItem('dadosFuncionario');
        const registrosSalvos = localStorage.getItem('registrosPonto');

        if (dadosSalvos) {
            setDados(JSON.parse(dadosSalvos));
            setEditando(false);
        } else {
            setEditando(true);
        }

        if (registrosSalvos) {
            setRegistros(JSON.parse(registrosSalvos));
        }
    }, []);

    // Salvar dados no localStorage
    const salvarDados = () => {
        localStorage.setItem('dadosFuncionario', JSON.stringify(dados));
        localStorage.setItem('registrosPonto', JSON.stringify(registros));
    };

    useEffect(() => {
        salvarDados();
    }, [dados, registros]);

    // Auto-selecionar trimestre atual ao carregar registros pela primeira vez
    useEffect(() => {
        if (registros.length > 0 && trimestreSelecionado === 0) {
            const hoje = new Date().toISOString().split('T')[0];
            const { trimestre } = obterTrimestre(hoje);
            // Comentado para não auto-selecionar, deixar usuário escolher
            // setTrimestreSelecionado(trimestre);
        }
    }, [registros]);

    // Determinar qual trimestre uma data pertence (baseado em ciclos de 21 a 20)
    const obterTrimestre = (
        dataStr: string,
    ): { trimestre: number; ano: number } => {
        const data = new Date(dataStr + 'T00:00:00');
        const mes = data.getMonth(); // 0-11
        const dia = data.getDate();
        let ano = data.getFullYear();

        // 1º Trimestre: 21/dez até 20/mar
        // 2º Trimestre: 21/mar até 20/jun
        // 3º Trimestre: 21/jun até 20/set
        // 4º Trimestre: 21/set até 20/dez

        let trimestre: number;

        if (
            (mes === 11 && dia >= 21) ||
            mes === 0 ||
            mes === 1 ||
            (mes === 2 && dia <= 20)
        ) {
            trimestre = 1;
            // Se for dezembro, o trimestre pertence ao ano seguinte
            if (mes === 11) ano = ano + 1;
        } else if (
            (mes === 2 && dia >= 21) ||
            mes === 3 ||
            mes === 4 ||
            (mes === 5 && dia <= 20)
        ) {
            trimestre = 2;
        } else if (
            (mes === 5 && dia >= 21) ||
            mes === 6 ||
            mes === 7 ||
            (mes === 8 && dia <= 20)
        ) {
            trimestre = 3;
        } else {
            trimestre = 4;
        }

        return { trimestre, ano };
    };

    // Calcular o 5º dia útil do mês (assumindo seg-sex como dias úteis)
    const calcular5DiaUtil = (mes: number, ano: number): Date => {
        let data = new Date(ano, mes, 1);
        let diasUteis = 0;

        while (diasUteis < 5) {
            const diaSemana = data.getDay();
            // 0 = domingo, 6 = sábado
            if (diaSemana !== 0 && diaSemana !== 6) {
                diasUteis++;
            }
            if (diasUteis < 5) {
                data.setDate(data.getDate() + 1);
            }
        }

        return data;
    };

    // Obter informações do trimestre selecionado
    const obterInfoTrimestre = (trimestre: number, ano?: number) => {
        const anoAtual = ano || new Date().getFullYear();

        const infos = {
            1: {
                label: '1º Trimestre (Dez-Mar)',
                periodo: `21/12/${anoAtual - 1} - 20/03/${anoAtual}`,
                mesPagamento: 3, // abril (0-based)
                anoPagamento: anoAtual,
            },
            2: {
                label: '2º Trimestre (Mar-Jun)',
                periodo: `21/03/${anoAtual} - 20/06/${anoAtual}`,
                mesPagamento: 6, // julho
                anoPagamento: anoAtual,
            },
            3: {
                label: '3º Trimestre (Jun-Set)',
                periodo: `21/06/${anoAtual} - 20/09/${anoAtual}`,
                mesPagamento: 9, // outubro
                anoPagamento: anoAtual,
            },
            4: {
                label: '4º Trimestre (Set-Dez)',
                periodo: `21/09/${anoAtual} - 20/12/${anoAtual}`,
                mesPagamento: 0, // janeiro do ano seguinte
                anoPagamento: anoAtual + 1,
            },
        };

        const info = infos[trimestre as keyof typeof infos];
        const dataPagamento = calcular5DiaUtil(
            info.mesPagamento,
            info.anoPagamento,
        );

        return {
            ...info,
            dataPagamento: dataPagamento.toLocaleDateString('pt-BR'),
        };
    };

    // Filtrar registros por trimestre
    const filtrarRegistrosPorTrimestre = () => {
        if (trimestreSelecionado === 0) return registros;

        return registros.filter((registro) => {
            const { trimestre } = obterTrimestre(registro.data);
            return trimestre === trimestreSelecionado;
        });
    };
    const horaParaMinutos = (hora: string): number => {
        if (!hora) return 0;
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + m;
    };

    // Converter minutos para hora string
    const minutosParaHora = (minutos: number): string => {
        const horas = Math.floor(Math.abs(minutos) / 60);
        const mins = Math.abs(minutos) % 60;
        const sinal = minutos < 0 ? '-' : '';
        return `${sinal}${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    // Calcular horas trabalhadas em um período (considerando mudança de data)
    const calcularHorasPeriodo = (
        dataEntrada: string,
        entrada: string,
        dataSaida: string,
        saida: string,
    ): number => {
        if (!entrada || !saida) return 0;

        const dateTimeEntrada = new Date(`${dataEntrada}T${entrada}:00`);
        const dateTimeSaida = new Date(`${dataSaida}T${saida}:00`);

        const diffMs = dateTimeSaida.getTime() - dateTimeEntrada.getTime();
        const diffMinutos = Math.floor(diffMs / 60000);

        return diffMinutos > 0 ? diffMinutos : 0;
    };

    // Calcular minutos trabalhados no período noturno (22h às 5h)
    const calcularMinutosNoturnos = (
        dataEntrada: string,
        entrada: string,
        dataSaida: string,
        saida: string,
    ): number => {
        if (!entrada || !saida) return 0;

        const dateTimeEntrada = new Date(`${dataEntrada}T${entrada}:00`);
        const dateTimeSaida = new Date(`${dataSaida}T${saida}:00`);

        let minutosNoturnos = 0;
        let currentTime = new Date(dateTimeEntrada);

        // Iterar minuto a minuto para verificar se está no período noturno
        while (currentTime < dateTimeSaida) {
            const hora = currentTime.getHours();
            // Período noturno: 22h às 5h (22, 23, 0, 1, 2, 3, 4)
            if (hora >= 22 || hora < 5) {
                minutosNoturnos++;
            }
            currentTime.setMinutes(currentTime.getMinutes() + 1);
        }

        return minutosNoturnos;
    };

    // Calcular valor de adicional noturno (20%) usando horas noturnas reduzidas
    const calcularAdicionaisNoturnos = (
        minutosNoturnos: number,
        valorHoraNormal: number,
    ) => {
        // Converter minutos noturnos reais em horas
        const horasNoturnasReais = minutosNoturnos / 60;

        // Aplicar redução: cada hora noturna = 52.5 minutos, então hora_reduzida = hora_real * (60/52.5)
        const horasNoturnasReduzidas = horasNoturnasReais * (60 / 52.5);

        // Adicional noturno: 20% sobre o valor da hora normal, multiplicado pelas horas reduzidas
        const valorAdicionalNoturno =
            valorHoraNormal * 0.2 * horasNoturnasReduzidas;

        return {
            minutosNoturnos, // Tempo real trabalhado no período noturno (A.N em minutos)
            horasNoturnasReduzidas: horasNoturnasReduzidas * 60, // H.N.Red em minutos para exibição
            valorAdicionalNoturno, // Valor monetário (20% sobre H.N.Red)
        };
    };

    // Calcular horas extras de um registro
    const calcularHorasExtras = (registro: RegistroPonto) => {
        // Somar todos os períodos trabalhados
        let totalTrabalhado = 0;
        let totalMinutosNoturnos = 0;

        registro.periodos.forEach((periodo) => {
            totalTrabalhado += calcularHorasPeriodo(
                periodo.dataEntrada,
                periodo.entrada,
                periodo.dataSaida,
                periodo.saida,
            );
            totalMinutosNoturnos += calcularMinutosNoturnos(
                periodo.dataEntrada,
                periodo.entrada,
                periodo.dataSaida,
                periodo.saida,
            );
        });

        // Verificar dia da semana (0 = domingo, 6 = sábado)
        const data = new Date(registro.data + 'T00:00:00');
        const diaSemana = data.getDay();
        const ehSabado = diaSemana === 6;
        const ehDomingo = diaSemana === 0;

        // Sábado e domingo: toda hora trabalhada é extra
        if (ehSabado || ehDomingo) {
            return {
                totalTrabalhado,
                horasExtras: totalTrabalhado,
                minutosNoturnos: totalMinutosNoturnos,
                ehSabado,
                ehDomingo,
                diaSemana,
            };
        }

        // Segunda a sexta: calcular com base na jornada prevista
        const jornadaPrevista1 =
            horaParaMinutos(dados.jornadaFim1) -
            horaParaMinutos(dados.jornadaInicio1);
        const jornadaPrevista2 =
            horaParaMinutos(dados.jornadaFim2) -
            horaParaMinutos(dados.jornadaInicio2);
        const jornadaTotalPrevista = jornadaPrevista1 + jornadaPrevista2;

        // Calcular apenas horas extras (não interessa faltas)
        const horasExtras =
            totalTrabalhado > jornadaTotalPrevista
                ? totalTrabalhado - jornadaTotalPrevista
                : 0;

        return {
            totalTrabalhado,
            horasExtras,
            minutosNoturnos: totalMinutosNoturnos,
            ehSabado: false,
            ehDomingo: false,
            diaSemana,
        };
    };

    // Calcular totais
    const calcularTotais = () => {
        let totalHorasExtras = 0;
        let totalMinutosNoturnos = 0;
        let horasExtrasSemana = 0;
        let horasExtrasSabado = 0;
        let horasExtrasDomingo = 0;

        registros.forEach((registro) => {
            const calc = calcularHorasExtras(registro);
            totalHorasExtras += calc.horasExtras;
            totalMinutosNoturnos += calc.minutosNoturnos;

            if (calc.ehSabado) {
                horasExtrasSabado += calc.horasExtras;
            } else if (calc.ehDomingo) {
                horasExtrasDomingo += calc.horasExtras;
            } else {
                horasExtrasSemana += calc.horasExtras;
            }
        });

        // Calcular valor das horas extras
        const valorHoraNormal = dados.salario / 220;
        const valorHoraExtra150 = valorHoraNormal * 1.5;
        const valorHoraExtra200 = valorHoraNormal * 2.0;

        const valorExtrasSemana = (horasExtrasSemana / 60) * valorHoraExtra150;
        const valorExtrasSabado = (horasExtrasSabado / 60) * valorHoraExtra150;
        const valorExtrasDomingo =
            (horasExtrasDomingo / 60) * valorHoraExtra200;
        const valorTotalHorasExtras =
            valorExtrasSemana + valorExtrasSabado + valorExtrasDomingo;

        // Calcular adicionais noturnos
        const adicionaisNoturnos = calcularAdicionaisNoturnos(
            totalMinutosNoturnos,
            valorHoraNormal,
        );

        return {
            totalHorasExtras,
            horasExtrasSemana,
            horasExtrasSabado,
            horasExtrasDomingo,
            valorExtrasSemana,
            valorExtrasSabado,
            valorExtrasDomingo,
            valorTotalHorasExtras,
            totalMinutosNoturnos,
            horasNoturnasReduzidas: adicionaisNoturnos.horasNoturnasReduzidas,
            valorAdicionalNoturno: adicionaisNoturnos.valorAdicionalNoturno,
        };
    };

    const adicionarRegistro = () => {
        if (!novoRegistro.data) {
            alert('Por favor, preencha a data');
            return;
        }

        // Criar novo registro
        const registro: RegistroPonto = {
            ...novoRegistro,
            id: Date.now().toString(),
        };

        setRegistros(
            [...registros, registro].sort(
                (a, b) =>
                    new Date(b.data).getTime() - new Date(a.data).getTime(),
            ),
        );

        // Resetar formulário
        setNovoRegistro({
            id: '',
            data: new Date().toISOString().split('T')[0],
            periodos: [
                {
                    id: '1',
                    data: new Date().toISOString().split('T')[0],
                    entrada: '',
                    saida: '',
                },
            ],
            observacao: '',
        });

        setMostrarFormulario(false);
        setRegistroEditando(null);
    };

    const adicionarPeriodo = () => {
        const ultimoPeriodo =
            novoRegistro.periodos[novoRegistro.periodos.length - 1];
        const novaDataEntrada = ultimoPeriodo?.dataSaida || novoRegistro.data;

        setNovoRegistro({
            ...novoRegistro,
            periodos: [
                ...novoRegistro.periodos,
                {
                    id: Date.now().toString(),
                    dataEntrada: novaDataEntrada,
                    entrada: '',
                    dataSaida: novaDataEntrada,
                    saida: '',
                },
            ],
        });
    };

    const removerPeriodo = (periodoId: string) => {
        if (novoRegistro.periodos.length === 1) {
            alert('Deve haver pelo menos um período');
            return;
        }
        setNovoRegistro({
            ...novoRegistro,
            periodos: novoRegistro.periodos.filter((p) => p.id !== periodoId),
        });
    };

    const atualizarPeriodo = (
        periodoId: string,
        campo: 'dataEntrada' | 'entrada' | 'dataSaida' | 'saida',
        valor: string,
    ) => {
        setNovoRegistro({
            ...novoRegistro,
            periodos: novoRegistro.periodos.map((p) =>
                p.id === periodoId ? { ...p, [campo]: valor } : p,
            ),
        });
    };

    // Auto-preencher horários da jornada normal quando selecionar dia de semana
    const handleDataChange = (novaData: string) => {
        const data = new Date(novaData + 'T00:00:00');
        const diaSemana = data.getDay();
        const ehDiaSemana = diaSemana >= 1 && diaSemana <= 5; // Segunda a sexta

        if (ehDiaSemana && !registroEditando) {
            // Preencher automaticamente com a jornada padrão
            setNovoRegistro({
                ...novoRegistro,
                data: novaData,
                periodos: [
                    {
                        id: '1',
                        dataEntrada: novaData,
                        entrada: dados.jornadaInicio1,
                        dataSaida: novaData,
                        saida: dados.jornadaFim1,
                    },
                    {
                        id: '2',
                        dataEntrada: novaData,
                        entrada: dados.jornadaInicio2,
                        dataSaida: novaData,
                        saida: dados.jornadaFim2,
                    },
                ],
            });
        } else {
            setNovoRegistro({
                ...novoRegistro,
                data: novaData,
                periodos: novoRegistro.periodos.map((p) => ({
                    ...p,
                    dataEntrada: novaData,
                    dataSaida: novaData,
                })),
            });
        }
    };

    const iniciarEdicao = (registro: RegistroPonto) => {
        setRegistroEditando(registro.id);
        setNovoRegistro(registro);
        setMostrarFormulario(true);
    };

    const cancelarEdicao = () => {
        setRegistroEditando(null);
        const hoje = new Date().toISOString().split('T')[0];
        setNovoRegistro({
            id: '',
            data: hoje,
            periodos: [
                {
                    id: '1',
                    dataEntrada: hoje,
                    entrada: '',
                    dataSaida: hoje,
                    saida: '',
                },
            ],
            observacao: '',
        });
        setMostrarFormulario(false);
    };

    const salvarEdicao = () => {
        if (!novoRegistro.data) {
            alert('Por favor, preencha a data');
            return;
        }

        // Atualizar o registro existente
        setRegistros(
            registros
                .map((r) => (r.id === registroEditando ? novoRegistro : r))
                .sort(
                    (a, b) =>
                        new Date(b.data).getTime() - new Date(a.data).getTime(),
                ),
        );

        cancelarEdicao();
    };

    const removerRegistro = (id: string) => {
        if (confirm('Deseja realmente remover este registro?')) {
            setRegistros(registros.filter((r) => r.id !== id));
        }
    };

    const totais = calcularTotais();
    const registrosFiltrados = filtrarRegistrosPorTrimestre();
    const totaisFiltrados = (() => {
        // Recalcular totais com registros filtrados
        let totalHorasExtras = 0;
        let totalMinutosNoturnos = 0;
        let horasExtrasSemana = 0;
        let horasExtrasSabado = 0;
        let horasExtrasDomingo = 0;

        registrosFiltrados.forEach((registro) => {
            const calc = calcularHorasExtras(registro);
            totalHorasExtras += calc.horasExtras;
            totalMinutosNoturnos += calc.minutosNoturnos;

            if (calc.ehSabado) {
                horasExtrasSabado += calc.horasExtras;
            } else if (calc.ehDomingo) {
                horasExtrasDomingo += calc.horasExtras;
            } else {
                horasExtrasSemana += calc.horasExtras;
            }
        });

        const valorHoraNormal = dados.salario / 220;
        const valorHoraExtra150 = valorHoraNormal * 1.5;
        const valorHoraExtra200 = valorHoraNormal * 2.0;

        const valorExtrasSemana = (horasExtrasSemana / 60) * valorHoraExtra150;
        const valorExtrasSabado = (horasExtrasSabado / 60) * valorHoraExtra150;
        const valorExtrasDomingo =
            (horasExtrasDomingo / 60) * valorHoraExtra200;
        const valorTotalHorasExtras =
            valorExtrasSemana + valorExtrasSabado + valorExtrasDomingo;

        const adicionaisNoturnos = calcularAdicionaisNoturnos(
            totalMinutosNoturnos,
            valorHoraNormal,
        );

        return {
            totalHorasExtras,
            horasExtrasSemana,
            horasExtrasSabado,
            horasExtrasDomingo,
            valorExtrasSemana,
            valorExtrasSabado,
            valorExtrasDomingo,
            valorTotalHorasExtras,
            totalMinutosNoturnos,
            horasNoturnasReduzidas: adicionaisNoturnos.horasNoturnasReduzidas,
            valorAdicionalNoturno: adicionaisNoturnos.valorAdicionalNoturno,
        };
    })();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-100 p-3">
                                <Calculator
                                    className="text-indigo-600"
                                    size={28}
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Horas Extras
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Calculadora de horas extras
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dados do Funcionário */}
                    {editando ? (
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={dados.nome}
                                        onChange={(e) =>
                                            setDados({
                                                ...dados,
                                                nome: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Cargo
                                    </label>
                                    <input
                                        type="text"
                                        value={dados.cargo}
                                        onChange={(e) =>
                                            setDados({
                                                ...dados,
                                                cargo: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Seu cargo"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Salário Mensal (R$)
                                </label>
                                <input
                                    type="number"
                                    value={dados.salario || ''}
                                    onChange={(e) =>
                                        setDados({
                                            ...dados,
                                            salario:
                                                parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>

                            <div className="border-t pt-3">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Jornada Normal de Trabalho
                                </label>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-600">
                                            Entrada Manhã
                                        </label>
                                        <input
                                            type="time"
                                            value={dados.jornadaInicio1}
                                            onChange={(e) =>
                                                setDados({
                                                    ...dados,
                                                    jornadaInicio1:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-2 py-2 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-600">
                                            Saída Manhã
                                        </label>
                                        <input
                                            type="time"
                                            value={dados.jornadaFim1}
                                            onChange={(e) =>
                                                setDados({
                                                    ...dados,
                                                    jornadaFim1: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-2 py-2 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-600">
                                            Entrada Tarde
                                        </label>
                                        <input
                                            type="time"
                                            value={dados.jornadaInicio2}
                                            onChange={(e) =>
                                                setDados({
                                                    ...dados,
                                                    jornadaInicio2:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-2 py-2 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs text-gray-600">
                                            Saída Tarde
                                        </label>
                                        <input
                                            type="time"
                                            value={dados.jornadaFim2}
                                            onChange={(e) =>
                                                setDados({
                                                    ...dados,
                                                    jornadaFim2: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-2 py-2 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (!dados.nome || !dados.salario) {
                                        alert(
                                            'Por favor, preencha nome e salário',
                                        );
                                        return;
                                    }
                                    setEditando(false);
                                }}
                                className="w-full rounded-lg bg-indigo-600 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-700"
                            >
                                <Save size={20} className="mr-2 inline" />
                                Salvar Dados
                            </button>
                        </div>
                    ) : (
                        <div className="mt-4 rounded-lg bg-gray-50 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <p className="text-lg font-semibold text-gray-800">
                                        {dados.nome}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {dados.cargo}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Salário: R${' '}
                                        {dados.salario
                                            .toFixed(2)
                                            .replace('.', ',')}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Jornada: {dados.jornadaInicio1} -{' '}
                                        {dados.jornadaFim1} |{' '}
                                        {dados.jornadaInicio2} -{' '}
                                        {dados.jornadaFim2}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEditando(true)}
                                    className="flex min-h-[44px] items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 font-medium text-indigo-700 transition-colors hover:bg-indigo-200"
                                >
                                    <Edit2 size={18} />
                                    <span className="hidden sm:inline">
                                        Editar
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Abas de Trimestres */}
                {!editando && registros.length > 0 && (
                    <div className="mb-6 overflow-x-auto rounded-xl bg-white p-4 shadow-lg">
                        <div className="flex min-w-max gap-2">
                            <button
                                onClick={() => setTrimestreSelecionado(0)}
                                className={`min-h-[48px] rounded-lg px-5 py-3 font-semibold whitespace-nowrap transition-colors ${
                                    trimestreSelecionado === 0
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Todos
                            </button>
                            {[1, 2, 3, 4].map((trim) => {
                                const info = obterInfoTrimestre(trim);
                                return (
                                    <button
                                        key={trim}
                                        onClick={() =>
                                            setTrimestreSelecionado(trim)
                                        }
                                        className={`min-h-[48px] rounded-lg px-5 py-3 font-semibold whitespace-nowrap transition-colors ${
                                            trimestreSelecionado === trim
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <span className="hidden sm:inline">
                                            {info.label}
                                        </span>
                                        <span className="sm:hidden">
                                            {trim}º Tri
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {trimestreSelecionado > 0 && (
                            <div className="mt-3 border-t border-gray-200 pt-3">
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">
                                        Período:
                                    </span>{' '}
                                    {
                                        obterInfoTrimestre(trimestreSelecionado)
                                            .periodo
                                    }
                                </p>
                                <p className="mt-1 text-sm text-gray-600">
                                    <span className="font-semibold">
                                        Pagamento:
                                    </span>{' '}
                                    {
                                        obterInfoTrimestre(trimestreSelecionado)
                                            .dataPagamento
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Cards de Resumo */}
                {!editando && (
                    <>
                        <div className="mb-4 grid grid-cols-3 gap-3">
                            <div className="rounded-lg bg-white p-4 shadow">
                                <div className="mb-1 flex items-center gap-2">
                                    <Clock
                                        size={16}
                                        className="text-green-600"
                                    />
                                    <p className="text-xs text-gray-600">
                                        Extras
                                    </p>
                                </div>
                                <p className="text-xl font-bold text-green-600">
                                    {minutosParaHora(
                                        totaisFiltrados.totalHorasExtras,
                                    )}
                                </p>
                            </div>

                            <div className="rounded-lg bg-white p-4 shadow">
                                <div className="mb-1 flex items-center gap-2">
                                    <DollarSign
                                        size={16}
                                        className="text-indigo-600"
                                    />
                                    <p className="text-xs text-gray-600">
                                        A Receber
                                    </p>
                                </div>
                                <p className="text-lg font-bold text-indigo-600">
                                    R${' '}
                                    {totaisFiltrados.valorTotalHorasExtras
                                        .toFixed(2)
                                        .replace('.', ',')}
                                </p>
                            </div>

                            <div className="rounded-lg bg-white p-4 shadow">
                                <div className="mb-1 flex items-center gap-2">
                                    <Clock
                                        size={16}
                                        className="text-amber-600"
                                    />
                                    <p className="text-xs text-gray-600">
                                        A.N (20%)
                                    </p>
                                </div>
                                <p className="text-lg font-bold text-amber-600">
                                    R${' '}
                                    {totaisFiltrados.valorAdicionalNoturno
                                        .toFixed(2)
                                        .replace('.', ',')}
                                </p>
                            </div>
                        </div>

                        {/* Detalhamento */}
                        <div className="mb-6 rounded-lg bg-white p-4 shadow">
                            <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                Detalhamento
                            </h3>
                            <div className="space-y-2">
                                {totaisFiltrados.horasExtrasSemana > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <span className="text-gray-700">
                                                Seg-Sex (1.5x)
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-semibold text-gray-800">
                                                {minutosParaHora(
                                                    totaisFiltrados.horasExtrasSemana,
                                                )}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500">
                                                R${' '}
                                                {totaisFiltrados.valorExtrasSemana
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {totaisFiltrados.horasExtrasSabado > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            <span className="text-gray-700">
                                                Sábado (1.5x)
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-semibold text-gray-800">
                                                {minutosParaHora(
                                                    totaisFiltrados.horasExtrasSabado,
                                                )}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500">
                                                R${' '}
                                                {totaisFiltrados.valorExtrasSabado
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {totaisFiltrados.horasExtrasDomingo > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                            <span className="text-gray-700">
                                                Domingo (2.0x)
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-semibold text-gray-800">
                                                {minutosParaHora(
                                                    totaisFiltrados.horasExtrasDomingo,
                                                )}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500">
                                                R${' '}
                                                {totaisFiltrados.valorExtrasDomingo
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {totaisFiltrados.totalMinutosNoturnos > 0 && (
                                    <>
                                        <div className="mt-2 border-t pt-2"></div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                                                <span className="text-gray-700">
                                                    A.N (20%)
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold text-gray-800">
                                                    {minutosParaHora(
                                                        totaisFiltrados.totalMinutosNoturnos,
                                                    )}
                                                </span>
                                                <span className="ml-2 text-xs text-gray-500">
                                                    R${' '}
                                                    {totaisFiltrados.valorAdicionalNoturno
                                                        .toFixed(2)
                                                        .replace('.', ',')}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Gráficos e Estatísticas */}
                        {registrosFiltrados.length > 0 && (
                            <>
                                {/* Gráfico de Distribuição por Tipo */}
                                <div className="mb-6 rounded-lg bg-white p-4 shadow">
                                    <h3 className="mb-4 text-sm font-semibold text-gray-700">
                                        Distribuição de Horas Extras
                                    </h3>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={250}
                                    >
                                        <BarChart
                                            data={[
                                                {
                                                    name: 'Seg-Sex',
                                                    horas:
                                                        totaisFiltrados.horasExtrasSemana /
                                                        60,
                                                    valor: totaisFiltrados.valorExtrasSemana,
                                                    fill: '#22c55e',
                                                },
                                                {
                                                    name: 'Sábado',
                                                    horas:
                                                        totaisFiltrados.horasExtrasSabado /
                                                        60,
                                                    valor: totaisFiltrados.valorExtrasSabado,
                                                    fill: '#3b82f6',
                                                },
                                                {
                                                    name: 'Domingo',
                                                    horas:
                                                        totaisFiltrados.horasExtrasDomingo /
                                                        60,
                                                    valor: totaisFiltrados.valorExtrasDomingo,
                                                    fill: '#a855f7',
                                                },
                                                {
                                                    name: 'A.N',
                                                    horas:
                                                        totaisFiltrados.totalMinutosNoturnos /
                                                        60,
                                                    valor: totaisFiltrados.valorAdicionalNoturno,
                                                    fill: '#f59e0b',
                                                },
                                            ]}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(
                                                    value: any,
                                                    name: string,
                                                ) => {
                                                    if (name === 'horas')
                                                        return `${value.toFixed(2)}h`;
                                                    if (name === 'valor')
                                                        return `R$ ${value.toFixed(2)}`;
                                                    return value;
                                                }}
                                            />
                                            <Legend />
                                            <Bar dataKey="horas" name="Horas" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Evolução ao Longo do Tempo */}
                                <div className="mb-6 rounded-lg bg-white p-4 shadow">
                                    <h3 className="mb-4 text-sm font-semibold text-gray-700">
                                        Evolução Temporal
                                    </h3>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={250}
                                    >
                                        <LineChart
                                            data={registrosFiltrados
                                                .sort(
                                                    (a, b) =>
                                                        new Date(
                                                            a.data,
                                                        ).getTime() -
                                                        new Date(
                                                            b.data,
                                                        ).getTime(),
                                                )
                                                .map((registro) => {
                                                    const calc =
                                                        calcularHorasExtras(
                                                            registro,
                                                        );
                                                    const dataFormatada =
                                                        new Date(
                                                            registro.data +
                                                                'T00:00:00',
                                                        ).toLocaleDateString(
                                                            'pt-BR',
                                                            {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                            },
                                                        );
                                                    const valorHoraNormal =
                                                        dados.salario / 220;
                                                    const valorHoraExtra =
                                                        calc.ehDomingo
                                                            ? valorHoraNormal *
                                                              2
                                                            : valorHoraNormal *
                                                              1.5;
                                                    const valorTotal =
                                                        (calc.horasExtras /
                                                            60) *
                                                            valorHoraExtra +
                                                        calcularAdicionaisNoturnos(
                                                            calc.minutosNoturnos,
                                                            valorHoraNormal,
                                                        ).valorAdicionalNoturno;

                                                    return {
                                                        data: dataFormatada,
                                                        horas:
                                                            calc.horasExtras /
                                                            60,
                                                        valor: valorTotal,
                                                    };
                                                })}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="data" />
                                            <YAxis yAxisId="left" />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                            />
                                            <Tooltip
                                                formatter={(
                                                    value: any,
                                                    name: string,
                                                ) => {
                                                    if (name === 'horas')
                                                        return `${value.toFixed(2)}h`;
                                                    if (name === 'valor')
                                                        return `R$ ${value.toFixed(2)}`;
                                                    return value;
                                                }}
                                            />
                                            <Legend />
                                            <Line
                                                yAxisId="left"
                                                type="monotone"
                                                dataKey="horas"
                                                name="Horas Extras"
                                                stroke="#22c55e"
                                                strokeWidth={2}
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="valor"
                                                name="Valor (R$)"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Estatísticas Adicionais */}
                                <div className="mb-6 rounded-lg bg-white p-4 shadow">
                                    <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                        Estatísticas
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Dias trabalhados
                                            </p>
                                            <p className="text-2xl font-bold text-gray-800">
                                                {registrosFiltrados.length}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Média h/dia
                                            </p>
                                            <p className="text-2xl font-bold text-gray-800">
                                                {registrosFiltrados.length > 0
                                                    ? (
                                                          totaisFiltrados.totalHorasExtras /
                                                          60 /
                                                          registrosFiltrados.length
                                                      ).toFixed(1)
                                                    : '0'}
                                                h
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Total + Salário
                                            </p>
                                            <p className="text-2xl font-bold text-indigo-600">
                                                R${' '}
                                                {(
                                                    dados.salario +
                                                    totaisFiltrados.valorTotalHorasExtras +
                                                    totaisFiltrados.valorAdicionalNoturno
                                                )
                                                    .toFixed(0)
                                                    .replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        '.',
                                                    )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                % sobre salário
                                            </p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {dados.salario > 0
                                                    ? (
                                                          ((totaisFiltrados.valorTotalHorasExtras +
                                                              totaisFiltrados.valorAdicionalNoturno) /
                                                              dados.salario) *
                                                          100
                                                      ).toFixed(1)
                                                    : '0'}
                                                %
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Botão Adicionar */}
                {!editando && (
                    <button
                        onClick={() => {
                            if (mostrarFormulario && registroEditando) {
                                cancelarEdicao();
                            } else {
                                setMostrarFormulario(!mostrarFormulario);
                            }
                        }}
                        className="mb-6 flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-indigo-700"
                    >
                        <Plus size={24} />
                        {mostrarFormulario ? 'Cancelar' : 'Adicionar Registro'}
                    </button>
                )}

                {/* Formulário de Novo Registro */}
                {mostrarFormulario && !editando && (
                    <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            {registroEditando
                                ? 'Editar Registro'
                                : 'Novo Registro'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Data
                                </label>
                                <input
                                    type="date"
                                    value={novoRegistro.data}
                                    onChange={(e) =>
                                        handleDataChange(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                                />
                                {(() => {
                                    const data = new Date(
                                        novoRegistro.data + 'T00:00:00',
                                    );
                                    const diaSemana = data.getDay();
                                    const ehDiaSemana =
                                        diaSemana >= 1 && diaSemana <= 5;
                                    return (
                                        ehDiaSemana &&
                                        !registroEditando && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                                                <Clock size={12} />
                                                Horários da jornada normal
                                                preenchidos automaticamente
                                            </p>
                                        )
                                    );
                                })()}
                            </div>

                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Períodos de Trabalho
                                    </label>
                                    <button
                                        type="button"
                                        onClick={adicionarPeriodo}
                                        className="flex min-h-[44px] items-center gap-2 rounded-lg bg-green-100 px-4 py-2 font-medium text-green-700 transition-colors hover:bg-green-200"
                                    >
                                        <Plus size={20} />
                                        <span>Adicionar</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {novoRegistro.periodos.map(
                                        (periodo, index) => (
                                            <div
                                                key={periodo.id}
                                                className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4"
                                            >
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-base font-semibold text-gray-700">
                                                        Período {index + 1}
                                                    </span>
                                                    {novoRegistro.periodos
                                                        .length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removerPeriodo(
                                                                    periodo.id,
                                                                )
                                                            }
                                                            className="flex min-h-[44px] items-center gap-2 rounded-lg bg-red-100 px-3 py-2 font-medium text-red-700 transition-colors hover:bg-red-200"
                                                        >
                                                            <Trash2 size={18} />
                                                            <span className="text-sm">
                                                                Remover
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Entrada */}
                                                <div className="mb-3">
                                                    <label className="mb-2 block text-xs font-semibold text-gray-700">
                                                        Entrada
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="mb-1 block text-xs text-gray-600">
                                                                Data
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={
                                                                    periodo.dataEntrada
                                                                }
                                                                onChange={(e) =>
                                                                    atualizarPeriodo(
                                                                        periodo.id,
                                                                        'dataEntrada',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="mb-1 block text-xs text-gray-600">
                                                                Hora
                                                            </label>
                                                            <input
                                                                type="time"
                                                                value={
                                                                    periodo.entrada
                                                                }
                                                                onChange={(e) =>
                                                                    atualizarPeriodo(
                                                                        periodo.id,
                                                                        'entrada',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-lg border border-gray-300 px-2 py-2 focus:ring-2 focus:ring-indigo-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Saída */}
                                                <div className="mb-2">
                                                    <label className="mb-2 block text-xs font-semibold text-gray-700">
                                                        Saída
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="mb-1 block text-xs text-gray-600">
                                                                Data
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={
                                                                    periodo.dataSaida
                                                                }
                                                                onChange={(e) =>
                                                                    atualizarPeriodo(
                                                                        periodo.id,
                                                                        'dataSaida',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="mb-1 block text-xs text-gray-600">
                                                                Hora
                                                            </label>
                                                            <input
                                                                type="time"
                                                                value={
                                                                    periodo.saida
                                                                }
                                                                onChange={(e) =>
                                                                    atualizarPeriodo(
                                                                        periodo.id,
                                                                        'saida',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-lg border border-gray-300 px-2 py-2 focus:ring-2 focus:ring-indigo-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mostrar duração do período */}
                                                {periodo.entrada &&
                                                    periodo.saida && (
                                                        <p className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                                                            <Clock size={12} />
                                                            Duração:{' '}
                                                            {minutosParaHora(
                                                                calcularHorasPeriodo(
                                                                    periodo.dataEntrada,
                                                                    periodo.entrada,
                                                                    periodo.dataSaida,
                                                                    periodo.saida,
                                                                ),
                                                            )}
                                                        </p>
                                                    )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Observação (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={novoRegistro.observacao}
                                    onChange={(e) =>
                                        setNovoRegistro({
                                            ...novoRegistro,
                                            observacao: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Ex: Reunião, projeto especial..."
                                />
                            </div>

                            <div className="flex gap-3">
                                {registroEditando ? (
                                    <>
                                        <button
                                            onClick={salvarEdicao}
                                            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-base font-semibold text-white transition-colors hover:bg-green-700"
                                        >
                                            <Save size={20} />
                                            Salvar Alterações
                                        </button>
                                        <button
                                            onClick={cancelarEdicao}
                                            className="min-h-[52px] rounded-lg bg-gray-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-600"
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={adicionarRegistro}
                                        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-base font-semibold text-white transition-colors hover:bg-green-700"
                                    >
                                        <Save size={20} />
                                        Salvar Registro
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de Registros */}
                {!editando && registrosFiltrados.length > 0 && (
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            Registros
                        </h3>

                        <div className="space-y-3">
                            {registrosFiltrados.map((registro) => {
                                const calc = calcularHorasExtras(registro);
                                const dataFormatada = new Date(
                                    registro.data + 'T00:00:00',
                                ).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    weekday: 'short',
                                });

                                const diasSemana = [
                                    'dom',
                                    'seg',
                                    'ter',
                                    'qua',
                                    'qui',
                                    'sex',
                                    'sáb',
                                ];
                                const diaNome = diasSemana[calc.diaSemana];
                                const ehFimDeSemana =
                                    calc.ehSabado || calc.ehDomingo;

                                return (
                                    <div
                                        key={registro.id}
                                        className={`rounded-lg border-2 p-4 transition-colors hover:bg-gray-50 ${
                                            calc.ehDomingo
                                                ? 'border-purple-300 bg-purple-50'
                                                : calc.ehSabado
                                                  ? 'border-blue-300 bg-blue-50'
                                                  : 'border-gray-200'
                                        }`}
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Calendar
                                                    size={16}
                                                    className="text-gray-500"
                                                />
                                                <span className="font-semibold text-gray-800">
                                                    {dataFormatada}
                                                </span>
                                                {ehFimDeSemana && (
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            calc.ehDomingo
                                                                ? 'bg-purple-200 text-purple-800'
                                                                : 'bg-blue-200 text-blue-800'
                                                        }`}
                                                    >
                                                        {calc.ehDomingo
                                                            ? '2.0x'
                                                            : '1.5x'}
                                                    </span>
                                                )}
                                                {calc.minutosNoturnos > 0 && (
                                                    <span className="rounded-full bg-indigo-200 px-2 py-0.5 text-xs font-medium text-indigo-800">
                                                        Noturno:{' '}
                                                        {minutosParaHora(
                                                            calc.minutosNoturnos,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        iniciarEdicao(registro)
                                                    }
                                                    className="flex min-h-[44px] items-center gap-1 rounded-lg bg-indigo-100 px-3 py-2 text-indigo-700 transition-colors hover:bg-indigo-200"
                                                    title="Editar registro"
                                                >
                                                    <Edit2 size={18} />
                                                    <span className="hidden text-sm font-medium sm:inline">
                                                        Editar
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        removerRegistro(
                                                            registro.id,
                                                        )
                                                    }
                                                    className="flex min-h-[44px] items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-red-700 transition-colors hover:bg-red-200"
                                                    title="Remover registro"
                                                >
                                                    <Trash2 size={18} />
                                                    <span className="hidden text-sm font-medium sm:inline">
                                                        Excluir
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Períodos */}
                                        <div className="mb-3 space-y-2">
                                            {registro.periodos.map(
                                                (periodo, index) => {
                                                    const dataEntFormatada =
                                                        new Date(
                                                            periodo.dataEntrada +
                                                                'T00:00:00',
                                                        ).toLocaleDateString(
                                                            'pt-BR',
                                                            {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                            },
                                                        );
                                                    const dataSaiFormatada =
                                                        new Date(
                                                            periodo.dataSaida +
                                                                'T00:00:00',
                                                        ).toLocaleDateString(
                                                            'pt-BR',
                                                            {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                            },
                                                        );
                                                    const duracao =
                                                        calcularHorasPeriodo(
                                                            periodo.dataEntrada,
                                                            periodo.entrada,
                                                            periodo.dataSaida,
                                                            periodo.saida,
                                                        );

                                                    return (
                                                        <div
                                                            key={periodo.id}
                                                            className="flex flex-wrap items-center gap-2 text-sm"
                                                        >
                                                            <span className="font-medium text-gray-500">
                                                                #{index + 1}:
                                                            </span>
                                                            <span className="font-medium">
                                                                <span className="text-xs text-gray-500">
                                                                    {
                                                                        dataEntFormatada
                                                                    }
                                                                </span>{' '}
                                                                {periodo.entrada ||
                                                                    '--:--'}
                                                                {' → '}
                                                                <span className="text-xs text-gray-500">
                                                                    {
                                                                        dataSaiFormatada
                                                                    }
                                                                </span>{' '}
                                                                {periodo.saida ||
                                                                    '--:--'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                (
                                                                {minutosParaHora(
                                                                    duracao,
                                                                )}
                                                                )
                                                            </span>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>

                                        {/* Total de Extras */}
                                        <div className="border-t border-gray-200 pt-2">
                                            <span className="text-sm text-gray-500">
                                                Extras:{' '}
                                            </span>
                                            <span
                                                className={`text-sm font-semibold ${
                                                    calc.ehDomingo
                                                        ? 'text-purple-600'
                                                        : calc.ehSabado
                                                          ? 'text-blue-600'
                                                          : 'text-green-600'
                                                }`}
                                            >
                                                +
                                                {minutosParaHora(
                                                    calc.horasExtras,
                                                )}
                                            </span>
                                        </div>

                                        {registro.observacao && (
                                            <p className="mt-2 border-t border-gray-200 pt-2 text-xs text-gray-600 italic">
                                                {registro.observacao}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {!editando &&
                    registrosFiltrados.length === 0 &&
                    registros.length === 0 && (
                        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
                            <Clock
                                size={48}
                                className="mx-auto mb-3 text-gray-300"
                            />
                            <p className="text-gray-500">
                                Nenhum registro adicionado ainda
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                                Clique em "Adicionar Registro" para começar
                            </p>
                        </div>
                    )}

                {!editando &&
                    registrosFiltrados.length === 0 &&
                    registros.length > 0 && (
                        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
                            <Clock
                                size={48}
                                className="mx-auto mb-3 text-gray-300"
                            />
                            <p className="text-gray-500">
                                Nenhum registro neste período
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                                Selecione outro trimestre ou adicione registros
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
}
