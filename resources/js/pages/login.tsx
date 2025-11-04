import { Calculator, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        cargo: '',
        salario: 0,
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.login(loginData.email, loginData.password);
            // Recarregar a página para carregar a home
            window.location.href = '/';
        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (registerData.password !== registerData.password_confirmation) {
            setError('As senhas não conferem');
            setLoading(false);
            return;
        }

        try {
            await api.register(registerData);
            // Recarregar a página para carregar a home
            window.location.href = '/';
        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Erro ao criar conta. Tente novamente.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 shadow-lg">
                        <Calculator className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Horas Extras</h1>
                    <p className="mt-2 text-gray-600">Calculadora de horas extras</p>
                </div>

                {/* Card */}
                <div className="rounded-xl bg-white p-8 shadow-lg">
                    {/* Tabs */}
                    <div className="mb-6 flex gap-2">
                        <button
                            onClick={() => {
                                setIsLogin(true);
                                setError('');
                            }}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-colors ${
                                isLogin
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <LogIn size={20} />
                            Entrar
                        </button>
                        <button
                            onClick={() => {
                                setIsLogin(false);
                                setError('');
                            }}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-colors ${
                                !isLogin
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <UserPlus size={20} />
                            Criar Conta
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    {isLogin ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) =>
                                        setLoginData({ ...loginData, email: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={loginData.password}
                                    onChange={(e) =>
                                        setLoginData({ ...loginData, password: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-400"
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>
                    ) : (
                        // Register Form
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    value={registerData.name}
                                    onChange={(e) =>
                                        setRegisterData({ ...registerData, name: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Seu nome"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={registerData.email}
                                    onChange={(e) =>
                                        setRegisterData({ ...registerData, email: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Cargo
                                </label>
                                <input
                                    type="text"
                                    value={registerData.cargo}
                                    onChange={(e) =>
                                        setRegisterData({ ...registerData, cargo: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Ex: Desenvolvedor"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Salário Mensal (R$)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={registerData.salario || ''}
                                    onChange={(e) =>
                                        setRegisterData({
                                            ...registerData,
                                            salario: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={registerData.password}
                                    onChange={(e) =>
                                        setRegisterData({
                                            ...registerData,
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Confirmar Senha
                                </label>
                                <input
                                    type="password"
                                    value={registerData.password_confirmation}
                                    onChange={(e) =>
                                        setRegisterData({
                                            ...registerData,
                                            password_confirmation: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-400"
                            >
                                {loading ? 'Criando conta...' : 'Criar Conta'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
