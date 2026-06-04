# Deploy Media Tool to admin.thrive-fl.org via AWS Amplify

**Date:** 2026-06-03
**Repo:** ThriveCommunityChurch/ThriveAPIMediaTool
**Status:** Approved design — pending implementation plan

## Goal

Deploy the Angular 20 SPA (`UI/ThriveChurchMediaToolUI`) as a static site on AWS
Amplify at `admin.thrive-fl.org`. No Docker/nginx in the deploy path — Amplify
serves the prebuilt `dist/browser` artifact directly.

## Architecture

A **new, standalone Amplify app** connected to this repo:

- Branch: `master` → **prod** → `admin.thrive-fl.org`
- Production API: `https://api.thrive-fl.org`
- No staging environment. Localhost (`npm start` → `localhost:8080`) is staging.

The existing `Dockerfile`, `nginx.conf`, and `docker-compose.yml` remain untouched
as a fallback / local production-like path. This change only adds the Amplify path.

## Changes

### 1. Fix production API URL
`src/environments/environment.prod.ts` currently points to `http://localhost:8080`
(broken for any real deploy). Change `apiURL` to `https://api.thrive-fl.org`.
`rssFeedURL` stays as-is.

The `production` configuration in `angular.json` already swaps
`environment.ts` → `environment.prod.ts` via `fileReplacements`, so no
`angular.json` change is required for the prod build.

### 2. Add `amplify.yml` at repo root
Monorepo build — the Angular app is not at repo root.

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

`BUILD_CONFIG` defaults to `production` so a future staging app can override it
without touching the file (config-selection mechanism = Amplify env var, per
decision).

## Console configuration (done manually by Wyatt)

These are not in the repo:

1. **Create Amplify app**, connect `ThriveAPIMediaTool` repo, branch `master`.
2. **Env var:** `BUILD_CONFIG=production`.
3. **SPA rewrite rule** (Rewrites and redirects) so client-side routes resolve:
   - Source: `</^[^.]+$|\.(?!(css|js|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|json|map)$)([^.]+$)/>`
   - Target: `/index.html`
   - Type: `200 (Rewrite)`
4. **Custom domain:** map `admin.thrive-fl.org` to the `master` branch.
5. **Access gate:** enable Amplify basic auth (username/password) in front of the
   app, on top of the app's existing JWT login.

## Out of scope

- No staging Amplify app.
- No changes to Docker/nginx/compose.
- No app code or auth-flow changes — the app already does JWT login against the API.
- DNS for `api.thrive-fl.org` → App Runner is assumed to already exist or be
  handled separately.

## Verification

- `npx ng build --configuration=production` succeeds locally; `dist/browser`
  contains `index.html` + hashed assets.
- Built `index.html` / bundle references `https://api.thrive-fl.org` (not localhost).
- After deploy: `admin.thrive-fl.org` loads, deep-link refresh (e.g.
  `/some/route`) returns the app (SPA rewrite working), login hits
  `api.thrive-fl.org`.
