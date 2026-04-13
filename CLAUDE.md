# ThriveAPIMediaTool

Angular 20 admin UI for managing sermon content. Staff-facing. Posts to ThriveChurchOfficialAPI.

## Commands

```bash
cd UI/ThriveChurchMediaToolUI
npm install
npm start              # → http://localhost:4200 (hot reload, uses environment.ts → localhost:8080)
npm test               # 100% branch on services/components
npm run test:coverage

# Docker (production-like)
docker-compose up -d --build    # → http://localhost:8081
docker-compose down
```

## Rules

- One service/component per file
- Reactive forms (FormBuilder, FormControl) — no template-driven forms
- No `any` — use `unknown` and type narrowing
- Unsubscribe on destroy or use `async` pipe
- Docker bakes env vars at build time — rebuild image if API URL changes

## Docs
- `Docs/Shared/Naming-Conventions.md` — TypeScript/Angular conventions
