# Pet360 - Documentacao Completa

## Indice

1. [Sobre o Sistema](#sobre-o-sistema)
2. [Arquitetura](#arquitetura)
3. [Modulos e Funcionalidades](#modulos-e-funcionalidades)
4. [Requisitos](#requisitos)
5. [Instalacao](#instalacao)
6. [Configuracao](#configuracao)
7. [Uso do Sistema](#uso-do-sistema)
8. [API Reference](#api-reference)
9. [Deploy em Producao](#deploy-em-producao)
10. [Troubleshooting](#troubleshooting)

---

## Sobre o Sistema

### O que e o Pet360?

O **Pet360** e uma plataforma SaaS (Software as a Service) completa para gestao de negocios pet. Foi desenvolvido para atender diferentes tipos de estabelecimentos do setor pet:

- **Clinicas Veterinarias**: Prontuario eletronico, consultas, vacinas, exames
- **Petshops**: Vendas, estoque, produtos, servicos de banho e tosa
- **Hoteis Pet**: Hospedagem, reservas, check-in/out, acompanhamento
- **Daycares/Creches**: Pacotes, presenca diaria, atividades
- **ONGs**: Gestao de animais para adocao

### Diferenciais

- **Multi-tenant**: Cada negocio tem seus dados completamente isolados
- **Multi-perfil**: Proprietario, veterinario, atendente, groomer, etc.
- **Marketplace**: Plataforma para venda de produtos e racoes
- **Pet Sitters**: Rede de cuidadores de pets verificados
- **WhatsApp**: Integracao nativa para comunicacao com clientes
- **Analytics**: Dashboard com metricas e relatorios em tempo real

---

## Arquitetura

### Stack Tecnologico

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                    Next.js 14 + React                        │
│              Tailwind CSS + shadcn/ui style                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      NGINX (Proxy)                           │
│                Rate Limiting + Load Balance                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│                   NestJS + Prisma ORM                        │
│                  JWT Auth + Guards                           │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│   PostgreSQL     │ │    Redis     │ │  Evolution API   │
│   (Database)     │ │   (Cache)    │ │   (WhatsApp)     │
└──────────────────┘ └──────────────┘ └──────────────────┘
```

### Estrutura do Projeto

```
pet360/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Modelos do banco de dados
│   │   │   └── seed.ts         # Dados iniciais
│   │   ├── src/
│   │   │   ├── modules/        # Modulos da aplicacao
│   │   │   │   ├── auth/       # Autenticacao
│   │   │   │   ├── tutors/     # Gestao de tutores
│   │   │   │   ├── pets/       # Gestao de pets
│   │   │   │   ├── appointments/   # Agendamentos
│   │   │   │   ├── medical-records/# Prontuario
│   │   │   │   ├── vaccines/   # Carteira de vacinas
│   │   │   │   ├── boarding/   # Hospedagem
│   │   │   │   ├── daycare/    # Creche/Daycare
│   │   │   │   ├── adoption/   # Adocao
│   │   │   │   ├── products/   # Produtos e estoque
│   │   │   │   ├── financial/  # Vendas e financeiro
│   │   │   │   ├── analytics/  # Relatorios e metricas
│   │   │   │   ├── whatsapp/   # Integracao WhatsApp
│   │   │   │   ├── marketplace/# Marketplace de produtos
│   │   │   │   └── pet-sitters/# Cuidadores de pets
│   │   │   └── main.ts         # Entry point
│   │   └── Dockerfile
│   │
│   └── web/                    # Frontend Next.js
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── (dashboard)/# Paginas autenticadas
│       │   │   ├── login/      # Login
│       │   │   ├── marketplace/# Marketplace publico
│       │   │   └── pet-sitters/# Pet Sitters publico
│       │   ├── components/     # Componentes React
│       │   ├── contexts/       # React Contexts
│       │   ├── hooks/          # Custom hooks
│       │   └── lib/            # Utilitarios
│       └── Dockerfile
│
├── packages/
│   └── shared/                 # Tipos compartilhados
│
├── docker-compose.yml          # Producao
├── docker-compose.dev.yml      # Desenvolvimento
└── nginx.conf                  # Configuracao Nginx
```

### Modelo de Dados

O sistema utiliza PostgreSQL com Prisma ORM. Os principais modelos sao:

#### Core
- **Business**: Estabelecimento/empresa (tenant)
- **User**: Usuarios do sistema (funcionarios)
- **Tutor**: Clientes/donos dos pets
- **Pet**: Animais cadastrados

#### Servicos
- **Service**: Servicos oferecidos
- **Appointment**: Agendamentos
- **MedicalRecord**: Prontuarios medicos
- **VaccineRecord**: Registros de vacinas
- **Prescription**: Receitas medicas

#### Hospedagem
- **BoardingRoom**: Quartos/espacos
- **Boarding**: Reservas de hospedagem
- **DaycarePackage**: Pacotes de creche
- **DaycareEnrollment**: Matriculas

#### Financeiro
- **Product**: Produtos em estoque
- **Sale**: Vendas realizadas
- **SaleItem**: Itens da venda
- **CashRegister**: Controle de caixa

#### Marketplace
- **MarketplaceSeller**: Vendedores
- **MarketplaceCategory**: Categorias
- **MarketplaceListing**: Produtos a venda
- **MarketplaceOrder**: Pedidos

#### Pet Sitters
- **PetSitter**: Cuidadores cadastrados
- **PetSitterService**: Servicos oferecidos
- **PetSitterBooking**: Reservas
- **PetSitterReview**: Avaliacoes

---

## Modulos e Funcionalidades

### 1. Autenticacao (Auth)

**Funcionalidades:**
- Login por email e senha
- Login por WhatsApp OTP (codigo enviado por SMS)
- JWT com refresh token
- Controle de sessao

**Perfis de Usuario:**
| Perfil | Descricao |
|--------|-----------|
| OWNER | Proprietario - acesso total |
| ADMIN | Administrador |
| VET | Veterinario |
| ATTENDANT | Atendente |
| GROOMER | Tosador/Banhista |
| MANAGER | Gerente |

### 2. Tutores (Tutors)

**Funcionalidades:**
- Cadastro completo de clientes
- Historico de atendimentos
- Multiplos pets por tutor
- Busca por nome, CPF, telefone

**Campos:**
- Nome, CPF, telefone, email
- Endereco completo
- Preferencias de contato
- Observacoes

### 3. Pets

**Funcionalidades:**
- Cadastro detalhado do animal
- Foto do pet
- Historico medico vinculado
- Alertas de vacinas

**Campos:**
- Nome, especie, raca, porte
- Data de nascimento, peso
- Genero, castrado (sim/nao)
- Alergias, observacoes
- Microchip

**Portes:**
- MINI (ate 3kg)
- SMALL (3-10kg)
- MEDIUM (10-25kg)
- LARGE (25-45kg)
- GIANT (acima de 45kg)

### 4. Agendamentos (Appointments)

**Funcionalidades:**
- Calendario visual
- Agendamento por servico
- Notificacoes automaticas
- Confirmacao por WhatsApp

**Status:**
- SCHEDULED: Agendado
- CONFIRMED: Confirmado
- IN_PROGRESS: Em andamento
- COMPLETED: Concluido
- CANCELLED: Cancelado
- NO_SHOW: Nao compareceu

**Tipos:**
- CONSULTATION: Consulta
- GROOMING: Banho/Tosa
- VACCINE: Vacinacao
- EXAM: Exame
- SURGERY: Cirurgia
- RETURN: Retorno
- OTHER: Outros

### 5. Prontuario Eletronico (Medical Records)

**Funcionalidades:**
- Historico clinico completo
- Anexo de exames
- Prescricoes digitais
- Evolucao do paciente

**Campos do Atendimento:**
- Anamnese
- Exame fisico
- Diagnostico
- Tratamento
- Observacoes
- Peso, temperatura, FC, FR

### 6. Carteira de Vacinas (Vaccines)

**Funcionalidades:**
- Registro de vacinas aplicadas
- Lembretes de proxima dose
- Historico completo
- Compartilhamento digital

**Campos:**
- Tipo de vacina
- Lote, fabricante
- Data de aplicacao
- Data proxima dose
- Veterinario responsavel

### 7. Hospedagem/Hotel (Boarding)

**Funcionalidades:**
- Gestao de quartos/espacos
- Reservas com check-in/out
- Diarias com valores por porte
- Updates diarios para tutores
- Camera ao vivo (opcional)

**Status da Reserva:**
- PENDING: Pendente
- CONFIRMED: Confirmada
- CHECKED_IN: Hospedado
- CHECKED_OUT: Finalizada
- CANCELLED: Cancelada

### 8. Daycare/Creche

**Funcionalidades:**
- Pacotes (diario, semanal, mensal)
- Controle de presenca
- Registro de atividades
- Turnos (manha, tarde, integral)

**Tipos de Pacote:**
- DAILY: Diaria avulsa
- WEEKLY: Semanal
- MONTHLY: Mensal
- CUSTOM: Personalizado

### 9. Adocao (Adoption)

**Funcionalidades:**
- Cadastro de animais para adocao
- Formulario de interesse
- Processo de adocao
- Acompanhamento pos-adocao

**Status:**
- AVAILABLE: Disponivel
- RESERVED: Reservado
- ADOPTED: Adotado
- UNAVAILABLE: Indisponivel

### 10. Produtos e Estoque

**Funcionalidades:**
- Cadastro de produtos
- Controle de estoque
- Alertas de estoque minimo
- Categorias e fornecedores

**Campos:**
- Nome, SKU, codigo de barras
- Preco de custo e venda
- Quantidade em estoque
- Estoque minimo
- Fornecedor

### 11. Financeiro (Financial)

**Funcionalidades:**
- Registro de vendas
- Multiplas formas de pagamento
- Abertura/fechamento de caixa
- Relatorios financeiros

**Formas de Pagamento:**
- CASH: Dinheiro
- CREDIT_CARD: Cartao de credito
- DEBIT_CARD: Cartao de debito
- PIX: PIX
- BANK_TRANSFER: Transferencia
- INSTALLMENT: Parcelado

### 12. WhatsApp

**Funcionalidades:**
- Envio de mensagens automaticas
- Confirmacao de agendamentos
- Lembretes de vacinas
- Updates de hospedagem
- OTP para login

**Integracao:** Evolution API

### 13. Analytics/Relatorios

**Metricas Disponiveis:**
- Total de tutores e pets
- Agendamentos do dia/mes
- Receita mensal e crescimento
- Vacinas pendentes
- Servicos mais vendidos
- Produtos mais vendidos
- Ocupacao da hospedagem

### 14. Marketplace

**Funcionalidades:**
- Cadastro de vendedores
- Listagem de produtos
- Carrinho de compras
- Gestao de pedidos
- Avaliacoes e reviews
- Aprovacao de vendedores

**Status do Vendedor:**
- PENDING: Aguardando aprovacao
- APPROVED: Aprovado
- SUSPENDED: Suspenso
- REJECTED: Rejeitado

### 15. Pet Sitters

**Funcionalidades:**
- Cadastro de cuidadores
- Servicos oferecidos (passeio, hospedagem, visita)
- Precos por servico
- Sistema de reservas
- Avaliacoes e reviews
- Verificacao de antecedentes

**Tipos de Servico:**
- DOG_WALKING: Passeio
- PET_SITTING: Pet sitting (na casa do tutor)
- BOARDING: Hospedagem (na casa do sitter)
- DROP_IN_VISIT: Visita rapida
- DAYCARE: Creche diurna

---

## Requisitos

### Requisitos de Sistema

**Desenvolvimento:**
- Node.js 20 ou superior
- pnpm 8 ou superior
- Docker e Docker Compose
- Git

**Producao:**
- Docker e Docker Compose
- 2GB RAM minimo (recomendado 4GB)
- 20GB de disco
- Dominio configurado (opcional)
- Certificado SSL (recomendado)

### Portas Utilizadas

| Servico | Porta | Descricao |
|---------|-------|-----------|
| Web | 3000 | Frontend Next.js |
| API | 3001 | Backend NestJS |
| PostgreSQL | 5432 | Banco de dados |
| Redis | 6379 | Cache |
| PgAdmin | 5050 | Gerenciador BD (dev) |
| Evolution | 8080 | WhatsApp API |
| Nginx | 80/443 | Proxy reverso (prod) |

---

## Instalacao

### Instalacao para Desenvolvimento

#### 1. Clonar o Repositorio

```bash
git clone https://github.com/inematds/pet360.git
cd pet360
```

#### 2. Iniciar Infraestrutura

```bash
# Inicia PostgreSQL, Redis, PgAdmin e Evolution API
docker compose -f docker-compose.dev.yml up -d
```

Aguarde os containers iniciarem:
```bash
docker compose -f docker-compose.dev.yml ps
```

#### 3. Instalar Dependencias

```bash
pnpm install
```

#### 4. Configurar Variaveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar conforme necessario
nano .env.local
```

**Variaveis principais:**
```env
# Database
DATABASE_URL="postgresql://pet360:pet360_secret@localhost:5432/pet360"

# JWT
JWT_SECRET="sua-chave-secreta-muito-segura"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

# Redis
REDIS_URL="redis://localhost:6379"

# Evolution API (WhatsApp)
EVOLUTION_API_URL="http://localhost:8080"
EVOLUTION_API_KEY="dev-api-key"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

#### 5. Configurar Banco de Dados

```bash
cd apps/api

# Gerar cliente Prisma
pnpm prisma generate

# Executar migrations
pnpm db:migrate

# Popular com dados de exemplo
pnpm db:seed
```

#### 6. Iniciar Servidores

**Terminal 1 - API:**
```bash
cd apps/api
pnpm dev
```

**Terminal 2 - Web:**
```bash
cd apps/web
pnpm dev
```

#### 7. Acessar o Sistema

- **Web**: http://localhost:3000
- **API Docs**: http://localhost:3001/docs
- **PgAdmin**: http://localhost:5050

**Credenciais de Teste:**
- Email: `admin@petshopdemo.com`
- Senha: `admin123`

---

## Configuracao

### Configuracao do WhatsApp (Evolution API)

1. Acesse http://localhost:8080
2. Crie uma nova instancia
3. Escaneie o QR Code com WhatsApp
4. Configure o webhook para receber mensagens

### Configuracao do PgAdmin

1. Acesse http://localhost:5050
2. Login: `admin@pet360.com` / `admin`
3. Adicione servidor:
   - Host: `postgres` (ou `localhost` se fora do Docker)
   - Port: 5432
   - User: `pet360`
   - Password: `pet360_secret`
   - Database: `pet360`

### Personalizacao

#### Adicionar Novo Servico

1. Acesse o dashboard como admin
2. Va em Configuracoes > Servicos
3. Clique em "Novo Servico"
4. Preencha nome, categoria, duracao e preco

#### Configurar Horarios de Funcionamento

Edite no banco de dados ou via API:
```sql
UPDATE businesses
SET settings = '{"openHours": {"mon": "08:00-18:00", "tue": "08:00-18:00", ...}}'
WHERE slug = 'petshop-demo';
```

---

## Uso do Sistema

### Fluxo de Trabalho Tipico

#### 1. Cadastrar Tutor

```
Dashboard > Tutores > Novo Tutor
- Preencher dados pessoais
- Salvar
```

#### 2. Cadastrar Pet

```
Dashboard > Pets > Novo Pet
- Selecionar tutor
- Preencher dados do animal
- Adicionar foto (opcional)
- Salvar
```

#### 3. Agendar Consulta

```
Dashboard > Agenda > Novo Agendamento
- Selecionar pet
- Escolher servico
- Selecionar data e horario
- Selecionar profissional (se aplicavel)
- Confirmar
```

#### 4. Realizar Atendimento

```
Dashboard > Agenda > Clicar no agendamento
- Iniciar atendimento
- Preencher prontuario
- Adicionar prescricao (se necessario)
- Finalizar atendimento
```

#### 5. Registrar Venda

```
Dashboard > Vendas > Nova Venda
- Selecionar tutor
- Adicionar produtos/servicos
- Selecionar forma de pagamento
- Finalizar venda
```

### Principais Telas

#### Dashboard
Visao geral com KPIs:
- Agendamentos do dia
- Receita do mes
- Pets atendidos
- Vacinas pendentes

#### Agenda
Calendario com todos os agendamentos:
- Visao diaria, semanal, mensal
- Filtros por profissional
- Arrastar e soltar para reagendar

#### Tutores
Lista de clientes com busca:
- Filtro por nome, CPF, telefone
- Acesso rapido aos pets
- Historico de atendimentos

#### Pets
Lista de animais com detalhes:
- Filtro por especie, tutor
- Carteira de vacinas
- Prontuario completo

---

## API Reference

### Autenticacao

Todas as rotas (exceto login) requerem header:
```
Authorization: Bearer <token>
```

#### POST /auth/login
Login com email e senha.

**Body:**
```json
{
  "email": "admin@petshopdemo.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "name": "Administrador",
    "email": "admin@petshopdemo.com",
    "role": "OWNER"
  }
}
```

#### POST /auth/request-otp
Solicitar codigo OTP por WhatsApp.

**Body:**
```json
{
  "phone": "11999999999"
}
```

#### POST /auth/verify-otp
Verificar codigo OTP.

**Body:**
```json
{
  "phone": "11999999999",
  "code": "123456"
}
```

### Tutores

#### GET /tutors
Listar tutores do negocio.

**Query params:**
- `search`: Busca por nome, CPF ou telefone
- `page`: Pagina (default: 1)
- `limit`: Itens por pagina (default: 20)

#### POST /tutors
Criar novo tutor.

**Body:**
```json
{
  "name": "Maria Santos",
  "cpf": "12345678900",
  "phone": "11977777777",
  "email": "maria@email.com",
  "address": "Av. Paulista, 1000",
  "city": "Sao Paulo",
  "state": "SP"
}
```

#### GET /tutors/:id
Buscar tutor por ID.

#### PUT /tutors/:id
Atualizar tutor.

#### DELETE /tutors/:id
Remover tutor (soft delete).

### Pets

#### GET /pets
Listar pets.

**Query params:**
- `tutorId`: Filtrar por tutor
- `species`: DOG, CAT, BIRD, etc.
- `search`: Busca por nome

#### POST /pets
Criar novo pet.

**Body:**
```json
{
  "tutorId": "uuid-do-tutor",
  "name": "Thor",
  "species": "DOG",
  "breed": "Golden Retriever",
  "size": "LARGE",
  "gender": "MALE",
  "birthDate": "2020-03-15"
}
```

### Agendamentos

#### GET /appointments
Listar agendamentos.

**Query params:**
- `date`: Data especifica (YYYY-MM-DD)
- `startDate`: Data inicial
- `endDate`: Data final
- `status`: SCHEDULED, CONFIRMED, etc.

#### POST /appointments
Criar agendamento.

**Body:**
```json
{
  "petId": "uuid-do-pet",
  "serviceId": "uuid-do-servico",
  "scheduledDate": "2024-01-15",
  "scheduledTime": "10:00",
  "assignedToId": "uuid-do-profissional",
  "notes": "Primeira consulta"
}
```

### Analytics

#### GET /analytics/dashboard
Retorna KPIs principais.

**Response:**
```json
{
  "totalTutors": 150,
  "totalPets": 230,
  "todayAppointments": 12,
  "monthRevenue": 45000.00,
  "revenueGrowth": "15.5",
  "pendingVaccines": 28,
  "activeBoarding": 5
}
```

#### GET /analytics/revenue?year=2024
Receita mensal por ano.

#### GET /analytics/services?limit=10
Top servicos mais vendidos.

### Marketplace

#### GET /marketplace/listings
Listar produtos do marketplace.

**Query params:**
- `categoryId`: Filtrar por categoria
- `search`: Busca por nome
- `minPrice`, `maxPrice`: Faixa de preco

#### GET /marketplace/categories
Listar categorias.

### Pet Sitters

#### GET /pet-sitters
Listar cuidadores disponiveis.

**Query params:**
- `city`: Filtrar por cidade
- `serviceType`: DOG_WALKING, PET_SITTING, etc.
- `rating`: Avaliacao minima

---

## Deploy em Producao

### Com Docker Compose

#### 1. Preparar Servidor

```bash
# Instalar Docker
curl -fsSL https://get.docker.com | sh

# Instalar Docker Compose
sudo apt install docker-compose-plugin
```

#### 2. Clonar e Configurar

```bash
git clone https://github.com/inematds/pet360.git
cd pet360

# Configurar variaveis de producao
cp .env.example .env
nano .env
```

**Variaveis de Producao:**
```env
# Database
DATABASE_URL="postgresql://pet360:SENHA_FORTE@postgres:5432/pet360"
POSTGRES_PASSWORD=SENHA_FORTE

# JWT (gerar chave segura)
JWT_SECRET="chave-muito-segura-com-pelo-menos-32-caracteres"

# URLs
NEXT_PUBLIC_API_URL="https://seudominio.com/api"
```

#### 3. Build e Start

```bash
docker compose up -d --build
```

#### 4. Executar Migrations

```bash
docker compose exec api npx prisma migrate deploy
docker compose exec api npx prisma db seed
```

#### 5. Configurar SSL (Certbot)

```bash
# Instalar Certbot
sudo apt install certbot

# Gerar certificado
sudo certbot certonly --standalone -d seudominio.com

# Copiar certificados para pasta do nginx
sudo cp /etc/letsencrypt/live/seudominio.com/* ./ssl/
```

Edite o `nginx.conf` para habilitar HTTPS (descomente a secao SSL).

### Monitoramento

#### Logs

```bash
# Todos os servicos
docker compose logs -f

# Servico especifico
docker compose logs -f api

# Ultimas 100 linhas
docker compose logs --tail 100 api
```

#### Health Check

```bash
# Verificar status dos containers
docker compose ps

# Health da API
curl http://localhost:3001/health

# Health do Nginx
curl http://localhost/health
```

#### Backup do Banco

```bash
# Backup
docker compose exec postgres pg_dump -U pet360 pet360 > backup.sql

# Restore
docker compose exec -T postgres psql -U pet360 pet360 < backup.sql
```

---

## Troubleshooting

### Problemas Comuns

#### Container nao inicia

```bash
# Ver logs do container
docker compose logs <servico>

# Recriar container
docker compose up -d --force-recreate <servico>
```

#### Erro de conexao com banco

1. Verificar se PostgreSQL esta rodando:
```bash
docker compose ps postgres
```

2. Verificar credenciais no `.env`

3. Testar conexao:
```bash
docker compose exec postgres psql -U pet360 -d pet360
```

#### Migration falhou

```bash
# Reset do banco (CUIDADO: apaga dados!)
cd apps/api
npx prisma migrate reset

# Ou aplicar migration especifica
npx prisma migrate deploy
```

#### Porta ja em uso

```bash
# Verificar processo usando a porta
sudo lsof -i :3000

# Matar processo
sudo kill -9 <PID>
```

#### WhatsApp nao conecta

1. Verificar se Evolution API esta rodando
2. Verificar QR Code no console
3. Verificar webhook configurado

### Comandos Uteis

```bash
# Reiniciar todos os servicos
docker compose restart

# Parar tudo
docker compose down

# Parar e remover volumes (CUIDADO!)
docker compose down -v

# Ver uso de recursos
docker stats

# Limpar cache Docker
docker system prune -a
```

---

## Suporte

### Links Uteis

- **Repositorio**: https://github.com/inematds/pet360
- **API Docs**: http://localhost:3001/docs (Swagger)
- **Prisma Studio**: `npx prisma studio` (visualizar banco)

### Contato

Para duvidas e suporte, abra uma issue no GitHub.

---

*Documentacao gerada para Pet360 v1.0*
