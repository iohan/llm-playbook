# LLM Agent Playbook (MVP)

A monorepo for building and testing LLM agents quickly. Frontend (React + Vite) and backend (Express) exists in the same repo but run separately during development and in production. Shared TypeScript types exists in their own package.

## Content

- **apps/web** – React + Vite (TypeScript)
- **apps/api** – Express (TypeScript)
- **packages/types** – Shared types between web and api

## Requirements

- **Node.js**: recommended LTS (v22)  
- **pnpm**: v9+


## Get started (local development)

Install dependencies for the whole monorepo:
```bash
pnpm install
```

Start API:
```bash
pnpm dev:api
# -> http://localhost:4000
```

Starta Web:
```bash
pnpm dev:web
# -> http://localhost:5173
# Vite proxy /api to http://localhost:4000 (check out vite.config.ts)
```

### Health checks & example endpoints

- **API health**: `GET http://localhost:4000/health`  
- **Example agent**: `GET http://localhost:4000/api/agents`

## Build for production

Build both web and api:
```bash
pnpm build
# or separately: 
pnpm build:api
pnpm build:web
```

- **Frontend**: static files in `apps/web/dist/`  
- **Backend**: bundled server in `apps/api/dist/index.js`

In production, serve the static files from a web server (e.g. Nginx) or a CDN. The backend can be run with `node apps/api/dist/index.js`. Put `CORS_ORIGIN` in environment if web is hosted on a different domain.

## Shared types

Share types can be found in **`packages/types`** and is published in the workspace as `@pkg/types`.

### Update or add types

1) Edit `packages/types/src/*.ts`. Example:
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

2) (Optional) Build package if you want to generate `.d.ts`/dist:
```bash
pnpm --filter @pkg/types build
```
> Under development, TypeScript-resolver in web/api points directly to `src` via `tsconfig.paths`, so you normally **do not** need to build for web/api to pick up new types – a restart of the dev server or TS server in your editor is usually enough.

### Use types in web/api

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

Run locally or in CI:
```bash
pnpm lint
pnpm format
```
