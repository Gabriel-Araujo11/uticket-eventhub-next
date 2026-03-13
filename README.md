# EventHub Next

Migração do projeto legado em React para **Next.js 14 + TypeScript**, utilizando App Router, com foco em performance, SEO, organização de código e melhor experiência de uso.

---

## Sobre o projeto

O EventHub Next é uma aplicação de descoberta de eventos com integração à API da Ticketmaster. Esta versão foi reestruturada para usar recursos modernos do Next.js, mantendo a proposta funcional do projeto original e evoluindo sua base técnica.

**Tecnologias utilizadas:** Next.js 14, TypeScript, App Router, Zustand, Metadata API, Route Handlers, next/image.

---

## Instalação e execução

**1. Clone o repositório**
```bash
git clone https://github.com/Gabriel-Araujo11/uticket-eventhub-next.git
cd eventhub-next
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:
```bash
TICKETMASTER_API_KEY=SUA_CHAVE_AQUI
```

> Você pode obter uma chave gratuita em [developer.ticketmaster.com](https://developer.ticketmaster.com).

**4. Rode o projeto**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm run start` | Inicia o servidor em modo produção |
| `npm run lint` | Executa a verificação de lint |
| `npm run test:e2e` | Executa os testes E2E com Playwright |
| `npm run test:e2e:headed` | Executa os testes E2E com interface visual |

---

## Rotas da aplicação

| Rota | Descrição |
|---|---|
| `/` | Home com eventos em destaque |
| `/busca` | Busca com filtros dinâmicos |
| `/evento/[id]` | Detalhes do evento |
| `/favoritos` | Eventos salvos localmente |
| `/api/events` | Endpoint interno de listagem |
| `/api/events/[id]` | Endpoint interno de detalhes |

---

## Requisitos implementados

### Obrigatórios

| Item | Status |
|---|---|
| Next.js 14 com App Router | ✅ Concluído |
| TypeScript em toda a aplicação | ✅ Concluído |
| SSG/ISR na Home | ✅ Concluído |
| SSR na página de busca | ✅ Concluído |
| SSG com `generateStaticParams` nos detalhes | ✅ Concluído |
| Zustand para gerenciamento de estado | ✅ Concluído |
| `next/image` para otimização de imagens | ✅ Concluído |
| Metadata API para SEO dinâmico | ✅ Concluído |
| Dynamic Routes `/evento/[id]` | ✅ Concluído |
| Route Handlers para integração com a API | ✅ Concluído |

### Diferenciais

| Item | Status |
|---|---|
| Loading states com `loading.tsx` | ✅ Concluído |
| Error boundaries com `error.tsx` | ✅ Concluído |
| Testes E2E com Playwright | ✅ Concluído |
| Pipeline CI/CD com GitHub Actions | ✅ Concluído |
| Deploy funcional na Vercel | ✅ Concluído |
| Documentação das decisões técnicas | ✅ Concluído |
| Middleware para proteção de rotas | — Não implementado |

---

## Decisões Técnicas

### Rendering Strategies

**Home (`/`) — SSG com ISR**
A página inicial foi configurada com geração estática e revalidação periódica. Essa estratégia garante carregamento rápido e boa performance, sem abrir mão da atualização dos eventos ao longo do tempo.

**Busca (`/busca`) — SSR**
A busca depende de query params, paginação e filtros dinâmicos, então a renderização no servidor foi a escolha natural para garantir consistência em cada combinação de parâmetros.

**Detalhes (`/evento/[id]`) — SSG com `generateStaticParams`**
Os detalhes dos eventos são pré-gerados com IDs reais quando a API está disponível. Em desenvolvimento, existe fallback com mocks para manter o fluxo funcional sem depender da chave de API.

---

### Arquitetura

**App Router**
Adotado para aproveitar as convenções modernas do Next.js 14 e atender ao requisito do teste, substituindo completamente o Pages Router.

**TypeScript em toda a aplicação**
Garante previsibilidade, facilita manutenção e permite modelagem clara das respostas da Ticketmaster. O uso de `any` foi substituído por tipos explícitos como `TicketmasterEvent[]` em toda a base.

**Zustand para gerenciamento de favoritos**
Escolhido no lugar do Context API por reduzir boilerplate e facilitar a persistência local via `localStorage` com o middleware `persist`. O estado expõe ações como `saveEvent`, `removeEvent` e `toggleEvent`, centralizando toda a lógica de favoritos em um único lugar.

**Route Handlers para integração com a API**
Centralizar a chamada à Ticketmaster em endpoints internos (`/api/events`) evita que a API Key fique exposta no cliente e mantém a lógica de rede desacoplada dos componentes de interface.

**`next/image` para otimização de imagens**
Usado em todos os componentes de imagem com fallback visual para eventos sem foto, lazy loading automático e configuração dos hosts externos da Ticketmaster no `next.config.mjs`.

**`generateMetadata` para SEO dinâmico**
Metadados como título, descrição e Open Graph são gerados dinamicamente nas páginas de busca e detalhes, com fallback em caso de falha na API.

**Testes E2E com Playwright**
Cobertura dos fluxos principais da aplicação: navegação da home para a busca e interação com os filtros avançados. Os resultados dos testes são isolados em `tests/test-results` e ignorados pelo Git.

**Pipeline CI/CD com GitHub Actions**
Configurado para executar lint, build e testes a cada push, garantindo que o repositório principal nunca receba código quebrado.

---

### Correções realizadas em relação ao legado

**Conflito de rota**
Em `src/app/api/events/[id]` coexistiam `page.tsx` e `route.ts`, o que causa erro de build no Next.js. A página visual foi movida para `src/app/evento/[id]`, eliminando o conflito.

**Busca com submit explícito**
A busca automática por digitação foi substituída por um fluxo com botão de confirmação. A Ticketmaster não garante match parcial por substring, então a busca automática gerava resultados inconsistentes e falsa expectativa de autocomplete.

**Estados vazios e de erro contextuais**
A página de busca passou a tratar separadamente resultado vazio e falha na API, com mensagens distintas e ação para tentar novamente.

**Hosts externos de imagem**
Adicionados no `next.config.mjs` para suportar imagens da Ticketmaster renderizadas por `next/image`.

**Fallback para dados incompletos**
Eventos sem imagem ou com campos ausentes recebem fallback visual e textual para evitar quebra de layout.

---

## Deploy

🔗 [https://uticket-eventhub-next-dhhl.vercel.app](https://uticket-eventhub-next-dhhl.vercel.app)
