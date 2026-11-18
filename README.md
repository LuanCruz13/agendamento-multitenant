# Agendaí

Sistema de agendamento **multi-tenant**: cada organização (salão, consultório, prestador de serviço pequeno) tem sua própria conta, define os horários em que atende, e os clientes dela agendam por uma página pública — sem nunca ver ou acessar dados de outra organização.

Projeto de portfólio construído do zero (modelagem, API e frontend) com foco em **isolamento multi-tenant**, **autenticação JWT com refresh token** e decisões de arquitetura documentadas e defensáveis em entrevista.

**Stack:** TypeScript · Node.js · NestJS · Prisma · PostgreSQL · Next.js · React Hook Form + Zod · JWT

---

## Índice

- [Demo](#demo)
- [Funcionalidades](#funcionalidades)
- [Arquitetura e stack](#arquitetura-e-stack)
- [Modelo de dados](#modelo-de-dados)
- [Endpoints da API](#endpoints-da-api)
- [Decisões técnicas em destaque](#decisões-técnicas-em-destaque)
- [Limitações conhecidas (conscientes)](#limitações-conhecidas-conscientes)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Roadmap (backlog v1.1)](#roadmap-backlog-v11)

---

## Demo

🚧 Deploy em andamento — o link de produção será adicionado aqui assim que o backend, banco e frontend estiverem no ar.

## Funcionalidades

- **Cadastro de organização** (`/cadastro`) — cria a organização e o usuário owner numa única requisição.
- **Login com JWT + refresh token**, incluindo "esqueci minha senha" (e-mail transacional via Resend) e troca de senha autenticada.
- **Disponibilidade semanal** — o staff define janelas recorrentes por dia da semana (ex: "Terça, 09h–18h").
- **Agendamento público** (`/agendar/:slug`) — o cliente final agenda sem precisar criar conta, só vendo os horários realmente livres (já descontando conflitos).
- **Painel interno** — lista de agendamentos com cancelamento, edição/remoção de disponibilidade, e configurações da organização (nome, slug do link público, e-mail/senha da conta).
- **Isolamento multi-tenant de ponta a ponta** — toda rota autenticada deriva a organização do JWT, nunca de um `id` enviado pelo cliente.

## Arquitetura e stack

| Camada | Tecnologia | Papel |
|---|---|---|
| Linguagem | TypeScript | Tipagem compartilhada entre DTOs do backend e schemas Zod do frontend |
| Runtime | Node.js | Executa tanto a API (NestJS) quanto o frontend (Next.js) |
| API | NestJS | Módulos, guards, pipes, validação (`class-validator`) |
| Banco | PostgreSQL + Prisma | ORM, migrations, modelagem multi-tenant |
| Auth | JWT (access + refresh) | Access token de vida curta (15 min), refresh de vida longa (7 dias) guardado como hash no banco |
| Frontend | Next.js (App Router) | Páginas públicas + painel protegido |
| Formulários | React Hook Form + Zod | Validação client-side consistente com os DTOs da API |
| E-mail | Resend | Confirmação de agendamento e reset de senha |
| Rate limiting | `@nestjs/throttler` | Proteção contra força bruta no login |

**Deploy planejado** (todos com free tier permanente, não trial): backend no **Render**, banco no **Neon/Supabase** (separado do Render, cujo Postgres free expira em 30 dias), frontend na **Vercel**, e-mail via **Resend**.

## Modelo de dados

`Organization` é a raiz do isolamento multi-tenant: `User`, `Availability` e `Booking` pertencem cada um a exatamente uma organização (relação 1 → N). Todas as foreign keys para `Organization` usam `onDelete: Restrict` — nunca `Cascade` — para nunca apagar histórico de agendamento silenciosamente ao remover uma organização.

```
Organization 1───N User            (staff/owner da organização)
Organization 1───N Availability    (janelas recorrentes por dia da semana)
Organization 1───N Booking         (agendamentos dos clientes finais)
```

Não existe FK entre `Booking` e `Availability`: conflito de horário e enquadramento dentro de uma janela disponível são validados em runtime, não no schema.

## Endpoints da API

| Rota | Auth | O que faz |
|---|---|---|
| `POST /organizations` | — | Cria organização + usuário owner |
| `POST /auth/login` | — | Login, JWT com `organizationId` no payload |
| `POST /auth/refresh` | Refresh token | Renova o access token |
| `POST /auth/logout` | JWT | Invalida o refresh token atual |
| `POST /auth/forgot-password` | — | Gera token de reset e envia e-mail (se existir) |
| `POST /auth/reset-password` | Token de reset | Troca a senha usando o token recebido por e-mail |
| `GET /availability` / `POST /availability` | JWT | Consulta/define horários disponíveis |
| `PUT /availability/:id` / `DELETE /availability/:id` | JWT | Edita/remove um horário |
| `GET /public/:slug/slots` | — | Lista horários livres da organização |
| `POST /public/:slug/bookings` | — | Cria agendamento e dispara e-mail de confirmação |
| `GET /bookings` | JWT | Lista agendamentos da própria organização |
| `PATCH /bookings/:id` | JWT | Cancela um agendamento (soft delete, `status → CANCELLED`) |
| `PATCH /organizations` | JWT | Edita nome/slug da própria organização |

Todas as rotas marcadas com `JWT` extraem a organização do payload do token (`req.user.organizationId`) — nenhuma delas aceita ou confia em um `organizationId`/`id` vindo do corpo da requisição.

## Decisões técnicas em destaque

Alguns trade-offs e bugs reais encontrados durante o desenvolvimento, com o raciocínio por trás de cada escolha.

- **Mensagem de erro idêntica no login, independente da causa.** `POST /auth/login` responde `401` com a mesma mensagem genérica tanto se o e-mail não existe quanto se a senha está errada — evita *user enumeration* (descobrir, por tentativa e erro, quais e-mails estão cadastrados).

- **Hash do refresh token com SHA-256, não `bcrypt` — e o bug que levou a essa troca.** Durante teste manual, descobri que `bcrypt.compare` reconhecia como válido um refresh token *já substituído* por um login mais novo. Causa: `bcrypt` processa só os primeiros 72 bytes da entrada, e refresh tokens do mesmo usuário compartilham um prefixo (header JWT + claims) maior que isso — a parte que de fato muda entre tokens (`iat`/`exp`/assinatura) vem depois do byte 72, e `bcrypt` nunca chegava a comparar essa parte. `SHA-256` processa a entrada inteira, sem truncar, e dispensa salt/custo computacional porque o token já nasce com alta entropia — diferente da senha, onde `bcrypt` continua sendo a escolha certa.

- **Isolamento via filtro atômico, não checagem em dois passos.** `PATCH /bookings/:id`, `PUT`/`DELETE /availability/:id` usam `updateMany`/`deleteMany` filtrando por `{ id, organizationId }` numa única query — se o registro não pertence à organização de quem pediu, o filtro simplesmente não bate nenhuma linha, sem abrir uma janela entre "checar" e "agir" nem vazar se o `id` existe em outra organização.

- **Todo cálculo de disponibilidade usa UTC explícito.** `startTime`/`endTime` são salvos como instantes UTC representando só "horário do dia". Usar variantes locais (`getHours()`, `getDay()`) deslocaria silenciosamente horários e até o dia da semana num servidor em fuso diferente — um bug que só apareceria em produção, não em teste local.

- **`localStorage` em vez de cookie `httpOnly` para a sessão — um trade-off, não um descuido.** Consequência direta da arquitetura de deploy gratuito: frontend e backend ficam em domínios diferentes em produção, tornando a sessão *cross-site*. Cookie `httpOnly` cross-site exige `SameSite=None; Secure` e fica sujeito a bloqueios cada vez mais agressivos (Safari/ITP) — o risco real seria o login falhar silenciosamente justamente para quem testasse o projeto de fora. O risco que `localStorage` introduz (XSS) é mitigado pelo access token de vida curta (15 min).

- **Guard de rota protegida roda no cliente, não no `middleware`/`proxy.ts` do Next.js.** Como a sessão vive em `localStorage` (decisão acima), e isso só existe no navegador, o middleware do servidor não tem como saber se a pessoa está logada. O guard no cliente protege a *experiência* (evita piscar o painel antes de redirecionar); quem protege o *dado* de verdade é o `JwtAuthGuard` da API — mesmo forçando a renderização via DevTools, a API responde `401`.

- **Soft delete em `Booking`.** Cancelamento usa `status: CANCELLED`, não `DELETE` físico — preserva histórico de negócio (taxa de cancelamento, relatórios futuros) e `GET /public/:slug/slots` já filtra por `status: CONFIRMED`, liberando o horário automaticamente sem lógica extra.

## Limitações conhecidas (conscientes)

Identificadas durante o desenvolvimento e deixadas como estão, com a razão de cada uma:

- **Vazamento por tempo de resposta no login:** quando o e-mail não existe, a resposta é mais rápida (não chama `bcrypt.compare`); quando a senha está errada, é mais lenta. A mensagem é idêntica nos dois casos, mas o tempo de resposta difere.
- **Rate limiting por IP, não por conta:** um atacante distribuído (múltiplos IPs) poderia tentar senhas numa única conta sem esbarrar no limite.
- **Sem keep-alive pro cold start do Render free tier:** a primeira requisição após ~15 min de inatividade demora mais (hibernação da instância). Existe workaround conhecido (ping externo agendado), mas optei por não implementar — contorna o comportamento pretendido da plataforma e não traz ganho real pro propósito deste projeto.
- **Revogação de sessão não é instantânea:** trocar a senha limpa o refresh token no banco, mas uma sessão já aberta em outro navegador continua autenticada por até 15 minutos — só cai quando o access token expira e a tentativa de renovação falha. É uma consequência do JWT ser stateless (validado só por assinatura, sem consulta ao banco em toda requisição), confirmado testando manualmente.
- **Entrega de e-mail limitada em modo sandbox do Resend** — ver nota em [Variáveis de ambiente](#variáveis-de-ambiente).

## Como rodar localmente

Pré-requisitos: Node 18+ e Docker (para subir o PostgreSQL localmente). Uma API key do [Resend](https://resend.com) é opcional — sem ela, o backend loga o conteúdo dos e-mails (confirmação de agendamento, link de reset de senha) no console em vez de enviar.

```bash
git clone <url-do-repositório (será adicionado aqui posteriormente)>
cd agendamento-multitenant
```

**Backend:**

```bash
cd backend
docker compose up -d       # sobe o PostgreSQL em localhost:5433
npm install
# criar .env (ver "Variáveis de ambiente" abaixo)
npx prisma migrate dev
npm run start:dev          # http://localhost:3000
```

**Frontend** (em outro terminal):

```bash
cd frontend
npm install
# criar .env.local (ver "Variáveis de ambiente" abaixo)
npm run dev          # http://localhost:3001
```

Acesse `http://localhost:3001`, crie uma organização em `/cadastro` e explore o painel.

## Variáveis de ambiente

**`backend/.env`**

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL |
| `JWT_SECRET` | Segredo de assinatura do access token |
| `JWT_REFRESH_SECRET` | Segredo de assinatura do refresh token (diferente do access, por desenho) |
| `RESEND_API_KEY` | API key do Resend, para e-mails transacionais (opcional — ver nota abaixo) |
| `FRONTEND_URL` | Origem liberada no CORS (padrão: `http://localhost:3001`) |
| `PORT` | Porta do servidor (padrão: `3000`) |

> **Sem `RESEND_API_KEY` configurada**, o backend não falha — loga no console o conteúdo do e-mail (incluindo o link de reset de senha) em vez de enviar de verdade. Útil para testar o projeto localmente sem precisar de conta no Resend.

> **Nota sobre e-mails em modo de teste:** sem verificar um domínio próprio no Resend, a conta fica em modo *sandbox* e só entrega e-mail pra a própria caixa do dono da conta Resend — afeta tanto a confirmação de agendamento quanto o reset de senha. Pra testar com outros e-mails (ou em produção de verdade), é preciso verificar um domínio no Resend.

**`frontend/.env.local`**

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API (padrão em dev: `http://localhost:3000`) |

## Roadmap (backlog v1.1)

Itens deixados propositalmente fora do escopo do MVP v1 para priorizar a entrega do fluxo principal, mas mapeados para evolução futura do projeto:

- **Containerização completa da aplicação:** Docker Compose cobrindo API, frontend e banco juntos, pensado para portabilidade e consistência entre ambientes.
- **Dados de demonstração:** seed (`npx prisma db seed`) com organização e credenciais de teste pré-configuradas, para eliminar o passo de cadastro manual na primeira avaliação do projeto em produção.
- **Testes automatizados:** cobertura de testes unitários, de integração e e2e.
- **Documentação interativa da API:** especificação automática via Swagger/OpenAPI.
- **Segurança avançada de sessão:** rotação completa de refresh token (detecção de reuso com invalidação da família de tokens).
- **CI/CD:** pipeline de integração contínua para validação de build, lint e testes a cada push.
- **Notificações via WhatsApp:** envio de confirmação e lembretes de agendamento.

---

Feito por **Luan Cruz** como projeto de portfólio full-stack TypeScript.

[LinkedIn](https://www.linkedin.com/in/luanvcruz) · 
[Github](https://github.com/LuanCruz13)
