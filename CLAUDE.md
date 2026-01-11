# Pet360 - Informacoes do Projeto

## Regras Importantes

- **SEMPRE** apos fazer commits, fazer push para origin/main E atualizar a VPS automaticamente
- Nao esperar o usuario pedir para atualizar a VPS - fazer automaticamente

## VPS / Deploy

- **Host**: pet360.inema.online
- **Usuario SSH**: root
- **Diretorio do projeto**: /root/pet360
- **Comando de deploy**: `ssh root@pet360.inema.online "cd /root/pet360 && git pull origin main"`

## Stack

- **Frontend**: Next.js 14 (apps/web)
- **Backend**: NestJS 10 (apps/api)
- **Banco de dados**: PostgreSQL 16
- **Cache**: Redis
- **WhatsApp**: Evolution API
- **Containers**: Docker Compose

## Comandos Uteis

### Atualizar VPS
```bash
git push origin main
ssh root@pet360.inema.online "cd /root/pet360 && git pull origin main"
```

### Rebuild containers na VPS
```bash
ssh root@pet360.inema.online "cd /root/pet360 && docker compose up -d --build"
```

### Ver logs na VPS
```bash
ssh root@pet360.inema.online "cd /root/pet360 && docker compose logs -f"
```
