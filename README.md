# LLM Agent Playbook (MVP)

Ett monorepo för att snabbt bygga och testa LLM-agenter. Frontend (React + Vite) och backend (Express) lever i samma repo men körs separat under utveckling och i produktion. Delade TypeScript-typer bor i ett eget paket.

## Innehåll

- **apps/web** – React + Vite (TypeScript)
- **apps/api** – Express (TypeScript)
- **packages/types** – Delade typer mellan web & api

## Krav

- **Node.js**: rekommenderat LTS (v22)  
- **pnpm**: v9+ (aktivera via `corepack enable`)

```bash
corepack enable
corepack prepare pnpm@9 --activate
```

## Kom igång (lokal utveckling)

Installera beroenden i hela monorepot:
```bash
pnpm install
```

Starta API:
```bash
pnpm dev:api
# -> http://localhost:4000
```

Starta Web:
```bash
pnpm dev:web
# -> http://localhost:5173
# Vite proxar /api till http://localhost:4000 (se vite.config.ts)
```

### Hälsokontroller & rutter (MVP)

- **API health**: `GET http://localhost:4000/health`  
- **Exempelagenter**: `GET http://localhost:4000/api/agents` (stub i MVP)

## Bygga för produktion

Bygg båda apparna:
```bash
pnpm build
# eller separat:
pnpm build:api
pnpm build:web
```

- **Frontend**: statiska filer i `apps/web/dist/`  
- **Backend**: bundlad server i `apps/api/dist/index.js`

I produktion körs de separat. Sätt gärna `CORS_ORIGIN` i backend om UI hostas på annan domän.

## Delade typer

Delade typer finns i **`packages/types`** och publiceras i workspacen som `@pkg/types`.

### Uppdatera eller lägga till en typ

1) Redigera/addera i `packages/types/src/*.ts`. Exempel:
```ts
// packages/types/src/index.ts
export type Agent = {
  id: string;
  name: string;
  prompt: string;
  policy: string;
  provider: string;
  tools: string[];
  createdAt: string;
  updatedAt: string;
};
```

2) (Valfritt) Bygg typpaketet om du vill generera `.d.ts`/dist:
```bash
pnpm --filter @pkg/types build
```

> Under utveckling pekar TypeScript-resolvern direkt mot `src` via `tsconfig.paths`, så du behöver normalt **inte** builda för att web/api ska få in nya typer – en omstart av dev-server eller TS-server i editorn räcker oftast.

### Använd i web eller api

```ts
import type { Agent } from "@pkg/types";
```

## Scripts (root)

```json
{
  "dev:web": "pnpm --filter @app/web dev",
  "dev:api": "pnpm --filter @app/api dev",
  "build": "pnpm -r build",
  "build:web": "pnpm --filter @app/web build",
  "build:api": "pnpm --filter @app/api build",
  "lint": "eslint . --ext .ts,.tsx",
  "format": "prettier --write .",
  "typecheck": "pnpm -r typecheck"
}
```

## ESLint & Prettier

Kör lokalt eller i CI:
```bash
pnpm lint
pnpm format
```

## Felsökning (snabb)

- **`http://localhost:5173` visar 404/blankt**  
  Se att `apps/web/index.html` finns i mapproten för web (inte i `src/`), och att dev-servern visar en Local-URL i terminalen.
- **CORS** vid separat hosting  
  Sätt `CORS_ORIGIN` i API (kommaseparerad lista) till din frontend-domän.
- **Typer hittas inte**  
  Se att `packages/types/package.json` heter `"name": "@pkg/types"` och att `pnpm install` är kört i repo-roten.

## Vad projektet ska åstadkomma (MVP-mål)

- Skapa, lista och redigera **LLM-agenter** (prompt, policy, provider, verktyg).  
- **Testa agenter** via API och analysera svar i UI.  
- Delade **TypeScript-typer** för robustare kontrakt mellan frontend och backend.  
- Enkel drift: separata build-artefakter för web och api.

> Databas/migrationer är medvetet bortplockat i MVP för snabb start. Persistens kan läggas till senare (t.ex. SQLite + SQL-migrationer) utan att ändra API-kontrakt eller UI.
