# RVD Vendas

Sistema de Registro de Vendas de Veículos.

## Requisitos

- Docker Desktop instalado
- Banco de dados MySQL existente na empresa

## Instalação

### 1. Configure o banco de dados

```bash
cp rvd-api/.env.example rvd-api/.env
```

Edite o arquivo `rvd-api/.env` com os dados do banco da empresa:

```env
DATABASE_URL="mysql://USUARIO:SENHA@HOST:3306/NOME_DO_BANCO"
API_PORT=3000
NODE_ENV=production
```

### 2. Suba o sistema

```bash
docker-compose up -d --build
```

O sistema irá:
- Criar as tabelas necessárias automaticamente no banco
- Subir a API na porta 3000
- Subir o frontend na porta 80

### 3. Acesse o sistema

Abra o browser em: **http://localhost**

## Atualização

Para atualizar o sistema para uma nova versão:

```bash
docker-compose down
docker-compose up -d --build
```

## Estrutura

rvd/
├── rvd-api/          ← Backend NestJS
├── rvd-frontend/     ← Frontend Angular
└── docker-compose.yml


## Suporte

Em caso de problemas, verifique os logs:

```bash
docker-compose logs rvd-api
docker-compose logs rvd-frontend
```