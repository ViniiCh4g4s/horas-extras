# Sistema de Horas Extras com Autenticação

Sistema completo de controle de horas extras integrado com banco de dados.

## 🚀 Funcionalidades Implementadas

### Backend (Laravel API)
- ✅ Autenticação com Laravel Sanctum (tokens)
- ✅ CRUD completo de registros de ponto
- ✅ Models: User, RegistroPonto, Periodo
- ✅ Migrations configuradas
- ✅ API RESTful completa

### Frontend (React + TypeScript)
- ✅ Sistema de autenticação (login/registro/logout)
- ✅ Contexto de autenticação global
- ✅ Proteção de rotas
- ✅ Interface componentizada e reutilizável
- ✅ Integração completa com API

### Funcionalidades de Negócio
- ✅ Cálculo automático de horas extras
- ✅ Adicional noturno (22h-5h) com 20%
- ✅ Diferenciação de multiplicadores:
  - Segunda a Sexta: 1.5x
  - Sábado: 1.5x
  - Domingo: 2.0x
- ✅ Filtro por trimestre (ciclos de 21 a 20)
- ✅ Auto-seleção do trimestre atual
- ✅ Estatísticas e métricas detalhadas
- ✅ Múltiplos períodos por dia
- ✅ Suporte a virada de data (entrada num dia, saída no outro)

## 📁 Estrutura de Arquivos

### Backend
```
app/
├── Http/Controllers/Api/
│   ├── AuthController.php         # Login, registro, perfil
│   └── RegistroPontoController.php # CRUD de registros
└── Models/
    ├── User.php                    # Usuário + jornada
    ├── RegistroPonto.php           # Registro de ponto
    └── Periodo.php                 # Período trabalhado

database/migrations/
├── *_add_fields_to_users_table.php
├── *_create_registros_ponto_table.php
└── *_create_periodos_table.php

routes/
└── api.php                         # Rotas da API
```

### Frontend
```
resources/js/
├── contexts/
│   └── AuthContext.tsx             # Contexto de autenticação
├── services/
│   └── api.ts                      # Cliente HTTP
├── components/horas-extras/
│   ├── Header.tsx                  # Cabeçalho com logout
│   ├── DadosFuncionario.tsx        # Perfil do usuário
│   ├── TrimestreSelector.tsx       # Seletor de trimestre
│   ├── CardsResumo.tsx             # Cards de resumo
│   ├── Detalhamento.tsx            # Detalhamento de valores
│   ├── Estatisticas.tsx            # Estatísticas
│   ├── FormularioRegistro.tsx      # Formulário de registro
│   └── ListaRegistros.tsx          # Lista de registros
├── pages/
│   ├── login.tsx                   # Página de login/registro
│   └── home.tsx                    # Dashboard principal
└── horas-extras.tsx                # Entry point

resources/views/
└── horas-extras.blade.php          # Template HTML
```

## 🔧 Como Usar

### 1. Primeiro Acesso
1. Acesse `http://horas-extras.test` (ou `http://localhost:8000`)
2. Clique em "Criar Conta"
3. Preencha:
   - Nome
   - Email
   - Cargo
   - Salário
   - Senha (mínimo 8 caracteres)
4. O sistema cria sua conta e faz login automaticamente

### 2. Configurar Perfil
- Na primeira tela, edite seus dados:
  - Nome, cargo, salário
  - Jornada de trabalho (manhã e tarde)
- Clique em "Salvar Dados"

### 3. Adicionar Registros
1. Clique em "Adicionar Registro"
2. Selecione a data
3. Preencha os períodos trabalhados:
   - Data/hora de entrada
   - Data/hora de saída
4. Adicione mais períodos se necessário
5. Adicione observação (opcional)
6. Clique em "Salvar Registro"

**Dica**: Ao selecionar um dia de semana (seg-sex), os horários da jornada normal são preenchidos automaticamente!

### 4. Visualizar Estatísticas
- Cards de resumo mostram:
  - Total de horas extras
  - Valor a receber
  - Adicional noturno
- Detalhamento por tipo:
  - Seg-Sex (1.5x)
  - Sábado (1.5x)
  - Domingo (2.0x)
  - Adicional Noturno (20%)
- Estatísticas:
  - Dias trabalhados
  - Média de horas/dia
  - Total + salário
  - % sobre salário

### 5. Filtrar por Trimestre
- Use o seletor de trimestre
- Trimestres são calculados de 21 a 20 do mês
- O sistema auto-seleciona o trimestre atual
- Mostra data prevista de pagamento (5º dia útil)

### 6. Editar/Excluir Registros
- Clique em "Editar" no registro desejado
- Faça as alterações necessárias
- Ou clique em "Excluir" para remover

### 7. Sair
- Clique no botão "Sair" no canto superior direito

## 🎯 Recursos Avançados

### Múltiplos Períodos
- Suporta vários períodos no mesmo dia
- Útil para quem trabalha em turnos quebrados
- Exemplo: 08:00-12:00, 14:00-18:00, 20:00-22:00

### Virada de Data
- Suporta entrada em um dia e saída no dia seguinte
- Exemplo: Entrada 23:00 de segunda, saída 03:00 de terça
- Calcula corretamente horas noturnas

### Adicional Noturno
- Período: 22h às 5h
- Alíquota: 20% sobre o valor da hora normal
- Hora noturna reduzida: 52.5 minutos
- Cálculo: `hora_real * (60/52.5) * 0.20 * valor_hora`

### Trimestres
- 1º Tri: 21/Dez a 20/Mar (pago em Abril)
- 2º Tri: 21/Mar a 20/Jun (pago em Julho)
- 3º Tri: 21/Jun a 20/Set (pago em Outubro)
- 4º Tri: 21/Set a 20/Dez (pago em Janeiro)

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Tokens de autenticação via Laravel Sanctum
- Cada usuário vê apenas seus próprios dados
- Validação de dados no backend e frontend
- Proteção CSRF automática

## 🗄️ Banco de Dados

### Tabela: users
- id, name, email, password
- cargo, salario
- jornada_inicio_1, jornada_fim_1
- jornada_inicio_2, jornada_fim_2

### Tabela: registros_ponto
- id, user_id
- data, observacao
- timestamps

### Tabela: periodos
- id, registro_ponto_id
- data_entrada, entrada
- data_saida, saida
- timestamps

## 📊 Cálculos

### Horas Extras Seg-Sex
```
total_trabalhado > jornada_prevista
extras = total_trabalhado - jornada_prevista
valor = (extras / 60) * (salario / 220) * 1.5
```

### Horas Extras Sábado
```
valor = (total_trabalhado / 60) * (salario / 220) * 1.5
```

### Horas Extras Domingo
```
valor = (total_trabalhado / 60) * (salario / 220) * 2.0
```

### Adicional Noturno
```
horas_noturnas_reais = minutos_noturnos / 60
horas_noturnas_reduzidas = horas_noturnas_reais * (60 / 52.5)
valor = horas_noturnas_reduzidas * (salario / 220) * 0.20
```

## 🚀 Desenvolvimento

### Build
```bash
npm run build
```

### Watch (desenvolvimento)
```bash
npm run dev
```

### Migrations
```bash
php artisan migrate
```

### Criar usuário via CLI
```bash
php artisan tinker
User::create([
    'name' => 'Seu Nome',
    'email' => 'seu@email.com',
    'password' => bcrypt('suasenha'),
    'cargo' => 'Seu Cargo',
    'salario' => 5000
]);
```

## 📝 Notas

- Todos os dados são salvos no banco de dados SQLite (`horas_extras`)
- O sistema calcula automaticamente considerando mudança de data
- Suporta trabalho noturno com cálculo correto
- Interface responsiva para mobile e desktop
- Gráficos e estatísticas em tempo real

## 🎨 Interface

- Design moderno com Tailwind CSS
- Ícones com Lucide React
- Responsivo (mobile-first)
- Feedback visual em todas as ações
- Loading states
- Mensagens de erro amigáveis
- Confirmações antes de deletar

## 🔄 API Endpoints

### Autenticação
- `POST /api/register` - Criar conta
- `POST /api/login` - Fazer login
- `POST /api/logout` - Fazer logout
- `GET /api/me` - Dados do usuário
- `PUT /api/profile` - Atualizar perfil

### Registros
- `GET /api/registros-ponto` - Listar registros
- `POST /api/registros-ponto` - Criar registro
- `GET /api/registros-ponto/{id}` - Ver registro
- `PUT /api/registros-ponto/{id}` - Atualizar registro
- `DELETE /api/registros-ponto/{id}` - Deletar registro

---

**Sistema desenvolvido com Laravel 11 + React 18 + TypeScript + Tailwind CSS**
