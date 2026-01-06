# Pet360

Sistema completo para gestao de negocios pet - Clinicas veterinarias, petshops, hoteis, daycares e ONGs.

## Recursos

### Core
- **Multi-tenant**: Cada negocio tem seus dados isolados
- **Multi-perfil**: Proprietario, veterinario, atendente, groomer, etc.
- **Autenticacao**: Login por email/senha ou WhatsApp OTP

### Modulos
- **Tutores e Pets**: Cadastro completo com historico
- **Prontuario Eletronico**: Registros medicos, prescricoes, exames
- **Carteira de Vacinas**: Controle de vacinacao com lembretes
- **Agendamentos**: Consultas, banho, tosa e servicos
- **Hospedagem/Hotel**: Reservas, check-in/out, updates diarios
- **Daycare/Creche**: Pacotes, presenca, atividades
- **Adocao**: Gestao de animais para adocao
- **Produtos/Estoque**: Controle de estoque e vendas
- **Financeiro**: Vendas, caixa, relatorios
- **WhatsApp**: Integracao com Evolution API
- **Analytics**: Dashboard e metricas

### Marketplace (Novo!)
- Plataforma de vendas de produtos e racoes
- Vendedores verificados
- Avaliacoes e reviews
- Gestao de pedidos e entregas

### Pet Sitters (Novo!)
- Cuidadores de pets verificados
- Passeios, hospedagem, visitas
- Sistema de avaliacoes
- Pagamentos seguros

## Tech Stack

- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 14 + Tailwind CSS + shadcn/ui
- **Cache**: Redis
- **WhatsApp**: Evolution API
- **Deploy**: Docker + Docker Compose

## Quick Start

### Requisitos
- Node.js 20+
- pnpm 8+
- Docker e Docker Compose

### Desenvolvimento

1. Clone o repositorio:
```bash
git clone https://github.com/inematds/pet360.git
cd pet360
```

2. Inicie os servicos de infra:
```bash
docker compose -f docker-compose.dev.yml up -d
```

3. Instale as dependencias:
```bash
pnpm install
```

4. Configure as variaveis de ambiente:
```bash
cp .env.example .env.local
```

5. Execute as migrations:
```bash
cd apps/api
pnpm db:migrate
pnpm db:seed
```

6. Inicie o desenvolvimento:
```bash
# Terminal 1 - API
cd apps/api
pnpm dev

# Terminal 2 - Web
cd apps/web
pnpm dev
```

### Producao

```bash
# Build e start com Docker
docker compose up -d --build
```

## URLs

- **Web**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/docs
- **PgAdmin**: http://localhost:5050 (dev only)

## Credenciais Demo

- **Email**: admin@petshopdemo.com
- **Senha**: admin123

## Estrutura do Projeto

```
pet360/
├── apps/
│   ├── api/              # Backend NestJS
│   │   ├── prisma/       # Schema e migrations
│   │   └── src/          # Codigo fonte
│   └── web/              # Frontend Next.js
│       ├── src/
│       │   ├── app/      # App Router pages
│       │   ├── components/
│       │   └── lib/
├── packages/
│   └── shared/           # Tipos compartilhados
├── docker-compose.yml    # Producao
├── docker-compose.dev.yml # Desenvolvimento
└── nginx.conf            # Proxy reverso
```

## API Endpoints

Acesse a documentacao completa em `/docs` (Swagger).

### Principais:
- `POST /auth/login` - Login
- `GET /tutors` - Listar tutores
- `GET /pets` - Listar pets
- `GET /appointments` - Listar agendamentos
- `GET /analytics/dashboard` - KPIs principais
- `GET /marketplace/listings` - Produtos do marketplace
- `GET /pet-sitters` - Listar cuidadores

## Licenca

MIT
