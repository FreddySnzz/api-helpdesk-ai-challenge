#  Helpdesk AI - Central de Chamados Inteligente

Uma API RESTful moderna para gerenciamento de chamados internos (Helpdesk), focada em inovação e reatividade.
Este projeto resolve dois grandes problemas de suporte: Triagem lenta e Falta de visibilidade em tempo real.

##  ✨ DIFERENCIAIS E FUNCIONALIDADES

- Triagem Automática (IA): Integração com Google Gemini API. O usuário apenas descreve o problema, e a IA infere a "Categoria" e a "Prioridade".
- Fallback de Inteligência: Caso a API Key da IA não seja fornecida ou falhe (Circuit Breaker), o sistema utiliza uma heurística determinística local baseada em palavras-chave para classificar os chamados sem gerar erros 500 para o usuário.
- Indicadores em Tempo Real (SSE): Arquitetura orientada a eventos. O painel de métricas é atualizado em tempo real via Server-Sent Events, alertando imediatamente quando chamados de ALTA prioridade são criados.
- Segurança (RBAC): Autenticação JWT com controle estrito de papéis (ADMIN visualiza/altera tudo, SOLICITANTE visualiza apenas os próprios chamados).
- Documentação Viva: Swagger/OpenAPI interativo integrado nativamente.

##  🛠️ TECNOLOGIAS UTILIZADAS

- Backend: Node.js, NestJS, TypeScript, RxJS.
- Banco de Dados: PostgreSQL.
- ORM: Prisma (Schema, Migrations e Seed).
- Segurança: Passport, JWT, Bcrypt.
- IA: SDK Oficial @google/generative-ai (Modelo Gemini 3.5 Flash).
- Infraestrutura: Docker e Docker Compose (One-click deploy).

##  🚀 INSTRUÇÕES DE INSTALAÇÃO E EXECUÇÃO LOCAL (DOCKER)

O projeto está totalmente containerizado. Você precisa ter apenas o Docker e o Docker Compose instalados na máquina.

Passo 1: Clone o repositório
```$ git clone <url-do-seu-repositorio>```
```$ cd api-helpdesk-ai-challenge```

Passo 2: Configure as Variáveis de Ambiente
Crie um arquivo ".env" na raiz do projeto com o seguinte conteúdo:

```
DATABASE_URL="postgresql://admin:adminpassword@db:5432/helpdesk?schema=public"
JWT_SECRET="sua-chave-secreta-jwt-aqui"
GEMINI_API_KEY="sua_chave_da_api_do_google"
```

> Nota sobre a IA: Caso não possua a GEMINI_API_KEY, o sistema NÃO irá
> quebrar. Ele detectará a ausência e utilizará o motor de
> Mock/Heurística automaticamente.

Passo 3: Suba a Aplicação (One-Click Deploy)
```$ docker-compose up --build -d```

> O Docker irá compilar a aplicação NestJS, subir o PostgreSQL, aplicar
> as migrations do banco e injetar os usuários de teste automaticamente
> (Seed).

Aguarde alguns segundos e acompanhe os logs para confirmar o sucesso:
```$ docker-compose logs -f api```

A API estará rodando em: http://localhost:8080

##  🧑‍💻 POPULANDO E TESTANDO A API

1. Swagger (Recomendado)
A maneira mais fácil de testar é através da documentação interativa gerada pelo Swagger.
Acesse no seu navegador: http://localhost:8080/api/docs

2. Usuários de Teste (Criados via Seed)
Utilize as credenciais abaixo na rota POST /auth/login para gerar um token JWT válido:
> Perfil ADMIN (Acesso total)
E-mail: admin@helpdesk.com
Senha: senha123

> Perfil SOLICITANTE (Acesso restrito)
E-mail: solicitante@helpdesk.com
Senha: senha123

3. Como Testar o Painel em Tempo Real (SSE)
> O teste funciona melhor quando se tem uma interface web para receber os eventos. 

Para fins de teste no navegador sem interface web:
- Abra uma aba no seu navegador e abra as Ferramentas de Desenvolvedor (F12) > Console.
- Cole o seguinte script JavaScript no console e dê Enter:

```js
const eventSource = new EventSource('http://localhost:8080/metrics/stream');
eventSource.onmessage = ({ data }) => console.log('DASHBOARD ATUALIZADO:', JSON.parse(data));
```

- Deixe o console aberto e, através do Swagger (com o Token do Solicitante), crie um novo chamado (POST /tickets).
- No corpo da requisição de criação, coloque a palavra "urgente" ou "parou" (ex: "Sistema parou e é urgente").
- Observe o console do navegador: Os dados do painel serão atualizados instantaneamente e um alerta de prioridade ALTA será disparado sem necessidade de F5 na tela!