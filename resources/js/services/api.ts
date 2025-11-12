import axios from 'axios';

const API_URL = '/api';

export interface User {
    id: number;
    name: string;
    email: string;
    cargo: string | null;
    salario: number;
    jornada_inicio_1: string;
    jornada_fim_1: string;
    jornada_inicio_2: string;
    jornada_fim_2: string;
}

export interface Periodo {
    id?: number;
    data_entrada: string;
    entrada: string;
    data_saida: string;
    saida: string;
}

export interface RegistroPonto {
    id?: number;
    data: string;
    periodos: Periodo[];
    observacao?: string;
}

class ApiService {
    private token: string | null = null;

    constructor() {
        // Configurar headers padrão do axios
        axios.defaults.headers.common['Accept'] = 'application/json';
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        this.token = localStorage.getItem('auth_token');
        if (this.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        }
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('auth_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
        delete axios.defaults.headers.common['Authorization'];
    }

    async register(data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        cargo?: string;
        salario?: number;
        jornada_inicio_1?: string;
        jornada_fim_1?: string;
        jornada_inicio_2?: string;
        jornada_fim_2?: string;
    }) {
        const response = await axios.post(`${API_URL}/register`, data);
        this.setToken(response.data.token);
        return response.data.user;
    }

    async login(email: string, password: string) {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        this.setToken(response.data.token);
        return response.data.user;
    }

    async logout() {
        await axios.post(`${API_URL}/logout`);
        this.clearToken();
    }

    async getMe(): Promise<User> {
        const response = await axios.get(`${API_URL}/me`);
        return response.data;
    }

    async updateProfile(data: Partial<User>) {
        const response = await axios.put(`${API_URL}/profile`, data);
        return response.data;
    }

    async getRegistrosPonto(): Promise<RegistroPonto[]> {
        const response = await axios.get(`${API_URL}/registros-ponto`);
        return response.data;
    }

    async createRegistroPonto(data: RegistroPonto) {
        const response = await axios.post(`${API_URL}/registros-ponto`, data);
        return response.data;
    }

    async updateRegistroPonto(id: number, data: RegistroPonto) {
        const response = await axios.put(`${API_URL}/registros-ponto/${id}`, data);
        return response.data;
    }

    async deleteRegistroPonto(id: number) {
        await axios.delete(`${API_URL}/registros-ponto/${id}`);
    }
}

export const api = new ApiService();
