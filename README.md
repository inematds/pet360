<p align="center">
  <img src="ref/photo_5118356803921054612_y.jpg" alt="Pet360 - Sistema Completo de Gestao para Negocios Pet" width="100%"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Pet360-v1.0-blue?style=for-the-badge" alt="Pet360 v1.0"/>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14"/>
  <img src="https://img.shields.io/badge/NestJS-10-red?style=for-the-badge&logo=nestjs" alt="NestJS"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker" alt="Docker"/>
</p>

<h1 align="center">Pet360</h1>

<p align="center">
  <strong>Plataforma SaaS completa para gestao de negocios pet</strong>
</p>

<p align="center">
  Clinicas Veterinarias | Pet Shops | Hoteis Pet | Daycares | Centros de Adocao | Banho e Tosa
</p>

---

## O que e o Pet360?

**Pet360** e uma solucao completa e moderna para gestao de negocios do setor pet. Desenvolvido com as tecnologias mais recentes do mercado, oferece uma experiencia intuitiva para proprietarios e funcionarios gerenciarem todas as operacoes do dia a dia.

### Por que escolher o Pet360?

- **Multi-tenant** - Cada negocio tem seus dados completamente isolados e seguros
- **Multi-perfil** - Proprietario, veterinario, atendente, groomer, cada um com suas permissoes
- **WhatsApp Integrado** - Comunicacao direta com clientes via Evolution API
- **100% Responsivo** - Funciona perfeitamente em desktop, tablet e celular
- **Open Source** - Codigo aberto, personalize como precisar

---

## Funcionalidades Completas

### Dashboard Principal
- Visao geral do negocio com KPIs em tempo real
- Agendamentos do dia
- Alertas de vacinas vencendo
- Produtos com estoque baixo
- Metricas de faturamento

### Gestao de Tutores e Pets
- Cadastro completo de tutores com multiplos contatos
- Perfil detalhado de cada pet (raca, peso, alergias, observacoes)
- Historico completo de atendimentos
- Upload de fotos

### Prontuario Eletronico
- Registros medicos completos
- Prescricoes e receitas
- Anexo de exames (laboratoriais, imagem)
- Historico de consultas
- Templates de atendimento

### Carteira de Vacinas
- Controle de vacinacao por pet
- Alertas automaticos de vacinas proximas do vencimento
- Lembretes via WhatsApp para tutores
- Relatorios de cobertura vacinal

### Agendamentos
- Calendario visual drag-and-drop
- Agendamento de consultas, banho, tosa e outros servicos
- Confirmacao automatica via WhatsApp
- Bloqueio de horarios
- Multiplos profissionais

### Hospedagem / Hotel Pet
- Gestao de quartos e capacidade
- Check-in e check-out digital
- Updates diarios com fotos para tutores
- Controle de alimentacao e medicamentos
- Precificacao flexivel (diaria, pacotes)

### Daycare / Creche
- Pacotes mensais, semanais ou avulsos
- Controle de presenca
- Registro de atividades do dia
- Fotos e videos para tutores

### Centro de Adocao
- Cadastro de animais disponiveis
- Status de adocao (disponivel, em processo, adotado)
- Formulario de interesse
- Historico de adocoes

### Produtos e Estoque
- Cadastro de produtos com codigo de barras
- Controle de estoque automatico
- Alertas de estoque minimo
- Categorias e fornecedores
- Gestao de precos e margens

### Vendas e PDV
- Ponto de venda intuitivo
- Carrinho de compras
- Multiplas formas de pagamento
- Cupom fiscal (integracao futura)
- Historico de vendas

### Controle Financeiro
- Abertura e fechamento de caixa
- Registro de entradas e saidas
- Sangrias e suprimentos
- Relatorios diarios, semanais e mensais
- Dashboard financeiro

### Analytics e Relatorios
- Metricas de atendimentos
- Faturamento por periodo
- Servicos mais vendidos
- Clientes mais frequentes
- Graficos interativos

### Integracao WhatsApp
- Conexao via QR Code
- Envio de lembretes automaticos
- Confirmacao de agendamentos
- Notificacoes de vacinas
- Comunicacao em massa

### Configuracoes
- Dados da empresa
- Perfil do usuario
- Preferencias de notificacao
- Seguranca (2FA, sessoes)
- Horarios de funcionamento

---

## Marketplace (Novo!)

Plataforma integrada de vendas de produtos pet:

- **Vendedores Verificados** - Apenas fornecedores aprovados
- **Catalogo Completo** - Racoes, acessorios, medicamentos
- **Sistema de Avaliacoes** - Reviews de compradores
- **Gestao de Pedidos** - Rastreamento de entregas
- **Pagamentos Seguros** - Integracao com gateways

---

## Pet Sitters (Novo!)

Encontre cuidadores de confianca:

- **Profissionais Verificados** - Background check
- **Servicos Variados** - Passeios, hospedagem, visitas
- **Agenda Online** - Disponibilidade em tempo real
- **Sistema de Avaliacoes** - Reputacao transparente
- **Pagamentos Integrados** - Transacoes seguras

---

## Tech Stack

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **UI** | Tailwind CSS, shadcn/ui, Lucide Icons |
| **Backend** | NestJS 10, TypeScript |
| **ORM** | Prisma 5 |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **WhatsApp** | Evolution API |
| **Autenticacao** | JWT (Access + Refresh Tokens) |
| **Monorepo** | pnpm Workspaces |
| **Deploy** | Docker, Docker Compose, Nginx |

---

## Arquitetura do Projeto

```
pet360/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Modelo de dados
│   │   │   └── seed.ts         # Dados iniciais
│   │   └── src/
│   │       ├── modules/        # Modulos do sistema
│   │       │   ├── auth/       # Autenticacao
│   │       │   ├── tutors/     # Tutores
│   │       │   ├── pets/       # Pets
│   │       │   ├── appointments/ # Agendamentos
│   │       │   ├── vaccines/   # Vacinas
│   │       │   ├── medical-records/ # Prontuarios
│   │       │   ├── boarding/   # Hospedagem
│   │       │   ├── adoption/   # Adocao
│   │       │   ├── products/   # Produtos
│   │       │   ├── sales/      # Vendas
│   │       │   ├── cash-register/ # Caixa
│   │       │   ├── analytics/  # Metricas
│   │       │   ├── whatsapp/   # Integracao WhatsApp
│   │       │   ├── marketplace/ # Marketplace
│   │       │   └── pet-sitters/ # Pet Sitters
│   │       └── common/         # Guards, decorators, etc
│   │
│   └── web/                    # Frontend Next.js
│       └── src/
│           ├── app/            # App Router
│           │   ├── (auth)/     # Paginas publicas
│           │   │   ├── login/
│           │   │   └── register/
│           │   └── (dashboard)/ # Area logada
│           │       └── dashboard/
│           │           ├── tutores/
│           │           ├── pets/
│           │           ├── agenda/
│           │           ├── prontuarios/
│           │           ├── vacinas/
│           │           ├── hospedagem/
│           │           ├── adocao/
│           │           ├── produtos/
│           │           ├── vendas/
│           │           ├── financeiro/
│           │           ├── analytics/
│           │           ├── whatsapp/
│           │           └── configuracoes/
│           ├── components/
│           │   └── ui/         # Componentes shadcn
│           ├── hooks/          # Custom hooks
│           └── lib/            # Utilitarios
│
├── packages/
│   └── shared/                 # Tipos compartilhados
│
├── docker-compose.yml          # Producao
├── docker-compose.dev.yml      # Desenvolvimento
├── docker-compose.prod.yml     # Producao com SSL
└── nginx.conf                  # Proxy reverso
```

---

## Quick Start

### Pre-requisitos

- **Node.js** 20+
- **pnpm** 8+ (`npm install -g pnpm`)
- **Docker** e **Docker Compose**

### Desenvolvimento Local

```bash
# 1. Clone o repositorio
git clone https://github.com/inematds/pet360.git
cd pet360

# 2. Inicie a infraestrutura (PostgreSQL + Redis)
docker compose -f docker-compose.dev.yml up -d

# 3. Instale as dependencias
pnpm install

# 4. Configure as variaveis de ambiente
cp .env.example .env.local

# 5. Execute as migrations e seed
cd apps/api
pnpm db:migrate
pnpm db:seed
cd ../..

# 6. Inicie os servidores de desenvolvimento
# Terminal 1 - Backend
cd apps/api && pnpm dev

# Terminal 2 - Frontend
cd apps/web && pnpm dev
```

### URLs de Desenvolvimento

| Servico | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| API Docs (Swagger) | http://localhost:3001/docs |
| PgAdmin | http://localhost:5050 |

### Credenciais Demo

```
Email: admin@petshopdemo.com
Senha: admin123
```

---

## Deploy em Producao

### Opcao 1: Docker Compose (Recomendado)

```bash
# 1. Clone o repositorio no servidor
git clone https://github.com/inematds/pet360.git
cd pet360

# 2. Configure as variaveis de ambiente
cp .env.example .env
nano .env  # Edite com suas configuracoes

# 3. Build e start
docker compose up -d --build

# 4. Execute migrations
docker compose exec api pnpm db:migrate
docker compose exec api pnpm db:seed  # Opcional
```

### Opcao 2: Deploy com SSL (Let's Encrypt)

Para deploy em producao com HTTPS, siga estes passos:

#### 1. Configure o DNS

Aponte seu dominio (ex: `pet360.seudominio.com`) para o IP do servidor.

#### 2. Instale Certbot e obtenha certificado

```bash
# Ubuntu/Debian
apt update && apt install -y certbot

# Obtenha o certificado
certbot certonly --standalone -d pet360.seudominio.com
```

#### 3. Configure o Nginx

Crie o arquivo `/etc/nginx/sites-available/pet360`:

```nginx
server {
    listen 80;
    server_name pet360.seudominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pet360.seudominio.com;

    ssl_certificate /etc/letsencrypt/live/pet360.seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pet360.seudominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API Backend
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Evolution API (WhatsApp)
    location /evolution/ {
        rewrite ^/evolution/(.*) /$1 break;
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 4. Ative o site e reinicie Nginx

```bash
ln -s /etc/nginx/sites-available/pet360 /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

#### 5. Configure o docker-compose.prod.yml

```yaml
# IMPORTANTE: A URL da API deve ser a URL publica com HTTPS
web:
  build:
    args:
      NEXT_PUBLIC_API_URL: https://pet360.seudominio.com/api
```

#### 6. Build e deploy

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Variaveis de Ambiente

### Obrigatorias

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexao PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | URL de conexao Redis | `redis://localhost:6379` |
| `JWT_SECRET` | Chave secreta JWT (min 32 chars) | `sua-chave-super-secreta-aqui` |
| `JWT_REFRESH_SECRET` | Chave para refresh token | `outra-chave-secreta-aqui` |
| `NEXT_PUBLIC_API_URL` | URL publica da API | `https://pet360.seudominio.com/api` |

### WhatsApp (Evolution API)

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| `EVOLUTION_API_URL` | URL da Evolution API | `http://localhost:8080` |
| `EVOLUTION_API_KEY` | Chave de autenticacao | `sua-api-key` |
| `EVOLUTION_INSTANCE_NAME` | Nome da instancia | `pet360_main` |

### Opcionais

| Variavel | Descricao | Padrao |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente de execucao | `development` |
| `API_PORT` | Porta do backend | `3001` |
| `JWT_EXPIRATION` | Duracao do access token | `15m` |
| `JWT_REFRESH_EXPIRATION` | Duracao do refresh token | `7d` |
| `SENTRY_DSN` | DSN do Sentry para erros | - |
| `STORAGE_TYPE` | Tipo de storage (local/s3) | `local` |

---

## API Endpoints

A documentacao completa da API esta disponivel em `/docs` (Swagger) quando a aplicacao esta rodando.

### Principais Endpoints

#### Autenticacao
```
POST   /auth/login          # Login com email/senha
POST   /auth/register       # Cadastro de novo negocio
POST   /auth/refresh        # Renovar access token
GET    /auth/me             # Dados do usuario logado
PATCH  /auth/profile        # Atualizar perfil
```

#### Tutores
```
GET    /tutors              # Listar tutores
POST   /tutors              # Criar tutor
GET    /tutors/:id          # Detalhes do tutor
PATCH  /tutors/:id          # Atualizar tutor
DELETE /tutors/:id          # Remover tutor
GET    /tutors/:id/pets     # Pets do tutor
```

#### Pets
```
GET    /pets                # Listar pets
POST   /pets                # Cadastrar pet
GET    /pets/:id            # Detalhes do pet
PATCH  /pets/:id            # Atualizar pet
DELETE /pets/:id            # Remover pet
```

#### Agendamentos
```
GET    /appointments        # Listar agendamentos
POST   /appointments        # Criar agendamento
PATCH  /appointments/:id    # Atualizar agendamento
DELETE /appointments/:id    # Cancelar agendamento
```

#### Vacinas
```
GET    /vaccines            # Listar vacinas aplicadas
POST   /vaccines            # Registrar vacina
GET    /vaccines/pending    # Vacinas proximas do vencimento
```

#### Prontuarios
```
GET    /medical-records     # Listar registros
POST   /medical-records     # Criar registro medico
GET    /medical-records/:id # Detalhes do registro
```

#### Hospedagem
```
GET    /boarding            # Listar reservas
POST   /boarding            # Criar reserva
PATCH  /boarding/:id/checkin  # Fazer check-in
PATCH  /boarding/:id/checkout # Fazer check-out
```

#### Produtos
```
GET    /products            # Listar produtos
POST   /products            # Criar produto
PATCH  /products/:id        # Atualizar produto
PATCH  /products/:id/stock  # Ajustar estoque
```

#### Vendas
```
GET    /sales               # Listar vendas
POST   /sales               # Registrar venda
GET    /sales/:id           # Detalhes da venda
```

#### Financeiro
```
GET    /cash-register/current  # Caixa atual
POST   /cash-register/open     # Abrir caixa
POST   /cash-register/close    # Fechar caixa
POST   /cash-register/movements # Registrar movimento
```

#### Analytics
```
GET    /analytics/dashboard    # KPIs do dashboard
GET    /analytics/revenue      # Metricas de faturamento
GET    /analytics/services     # Servicos mais vendidos
```

#### WhatsApp
```
GET    /whatsapp/system/setup  # Status da conexao
GET    /whatsapp/qrcode        # QR Code para conexao
POST   /whatsapp/send          # Enviar mensagem
```

---

## Tipos de Negocio Suportados

O Pet360 suporta multiplos tipos de negocio, podendo um unico estabelecimento ter varios tipos:

| Tipo | Codigo | Descricao |
|------|--------|-----------|
| Pet Shop | `PET_SHOP` | Loja de produtos pet |
| Clinica Veterinaria | `VET_CLINIC` | Atendimento medico |
| Banho e Tosa | `GROOMING` | Servicos de higiene |
| Hotel Pet | `HOTEL` | Hospedagem de animais |
| Daycare | `DAYCARE` | Creche para pets |
| Centro de Adocao | `ADOPTION_CENTER` | ONGs e abrigos |

---

## Seguranca

### Autenticacao JWT

O sistema utiliza autenticacao com dois tokens:

- **Access Token** (15min): Para requisicoes autenticadas
- **Refresh Token** (7 dias): Para renovar o access token

### Multi-tenancy

Cada negocio tem seus dados completamente isolados:

- Todas as queries sao filtradas por `businessId`
- Guards de autorizacao em todas as rotas
- Usuarios so acessam dados do proprio negocio

### Boas Praticas

- Senhas armazenadas com bcrypt
- Rate limiting nas APIs
- Protecao contra CSRF
- Headers de seguranca via Nginx
- Logs de auditoria

---

## Monitoramento

### Health Checks

```bash
# Verificar saude dos servicos
curl http://localhost:3001/health  # API
curl http://localhost:3000/api/health  # Web (via proxy)
```

### Logs

```bash
# Ver logs de todos os containers
docker compose logs -f

# Logs especificos
docker compose logs -f api
docker compose logs -f web
docker compose logs -f postgres
```

### Metricas

O dashboard de Analytics fornece metricas em tempo real:
- Total de atendimentos
- Faturamento do periodo
- Clientes ativos
- Servicos mais vendidos

---

## Contribuindo

1. Fork o repositorio
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudancas (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## Suporte

- **Issues**: [GitHub Issues](https://github.com/inematds/pet360/issues)
- **Email**: suporte@pet360.com.br

---

## Licenca

Este projeto esta licenciado sob a licenca MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Desenvolvido com paixao pelos pets
</p>
