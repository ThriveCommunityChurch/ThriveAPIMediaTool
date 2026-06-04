# Amplify admin.thrive-fl.org Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the Angular 20 SPA as a static AWS Amplify site at `admin.thrive-fl.org`, pointing at the production API.

**Architecture:** Add a repo-root `amplify.yml` (monorepo `appRoot` into `UI/ThriveChurchMediaToolUI`) that builds the existing `production` Angular configuration and publishes the static `dist/browser` artifact. Fix the broken production API URL. No Docker/nginx changes. Console-side setup (app creation, domain, basic auth, SPA rewrite, env var) is done manually by Wyatt and is out of repo scope.

**Tech Stack:** Angular 20 (`@angular/build:application`), AWS Amplify Hosting, npm.

Reference spec: `docs/superpowers/specs/2026-06-03-amplify-admin-deploy-design.md`

---

### Task 1: Fix production API URL

**Files:**
- Modify: `UI/ThriveChurchMediaToolUI/src/environments/environment.prod.ts`

- [ ] **Step 1: Edit the prod API URL**

Replace the `apiURL` value `"http://localhost:8080"` with the production API. Final file contents:

```typescript
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  apiURL: "https://api.thrive-fl.org",
  rssFeedURL: "https://thrive-audio.s3.us-east-2.amazonaws.com/feed/rss.xml"
};
```

- [ ] **Step 2: Verify the production build bakes in the right URL**

Run (from `UI/ThriveChurchMediaToolUI`):
```bash
npx ng build --configuration=production
```
Expected: build succeeds, `dist/browser/index.html` and hashed `main-*.js` produced.

Then confirm the URL is baked in and localhost is gone:
```bash
grep -rl "api.thrive-fl.org" dist/browser   # expect: at least one match (main-*.js)
grep -rl "localhost:8080" dist/browser       # expect: no matches
```

- [ ] **Step 3: Commit**

```bash
git add UI/ThriveChurchMediaToolUI/src/environments/environment.prod.ts
git commit -m "fix: point production API URL at api.thrive-fl.org"
```

---

### Task 2: Add Amplify build spec

**Files:**
- Create: `amplify.yml` (repo root)

- [ ] **Step 1: Create `amplify.yml`**

```yaml
version: 1
applications:
  - appRoot: UI/ThriveChurchMediaToolUI
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npx ng build --configuration=${BUILD_CONFIG:-production}
      artifacts:
        baseDirectory: dist/browser
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

- [ ] **Step 2: Validate YAML parses**

Run (from repo root):
```bash
npx --yes js-yaml amplify.yml > /dev/null && echo OK
```
Expected: `OK` (no parse error).

- [ ] **Step 3: Commit**

```bash
git add amplify.yml
git commit -m "build: add Amplify build spec for static admin UI deploy"
```

---

### Task 3: Open PR

- [ ] **Step 1: Push branch and open PR to `dev`**

Per repo convention (CLAUDE.md), ThriveAPIMediaTool PRs target `dev`.

```bash
gh pr create --base dev --title "Deploy admin UI to admin.thrive-fl.org via Amplify" \
  --body "Adds amplify.yml (static build of UI/ThriveChurchMediaToolUI) and fixes the production API URL to https://api.thrive-fl.org. Console setup (app, custom domain, basic auth, SPA rewrite rule, BUILD_CONFIG env var) handled manually. See docs/superpowers/specs/2026-06-03-amplify-admin-deploy-design.md."
```

Expected: PR URL printed. After `dev` validation, promote `dev` → `master` so the Amplify `master` branch deploys to `admin.thrive-fl.org`.

---

## Manual console steps (not in repo — Wyatt)

1. Create Amplify app, connect repo, branch `master`.
2. Env var `BUILD_CONFIG=production`.
3. SPA rewrite: source `</^[^.]+$|\.(?!(css|js|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|json|map)$)([^.]+$)/>` → `/index.html`, type `200 (Rewrite)`.
4. Custom domain `admin.thrive-fl.org` → `master`.
5. Enable Amplify basic auth.

## Final verification (post-deploy)

- `admin.thrive-fl.org` loads the app.
- Deep-link refresh (e.g. visit a route, hit reload) serves the app, not a 404 (SPA rewrite works).
- Login network calls hit `https://api.thrive-fl.org`.
