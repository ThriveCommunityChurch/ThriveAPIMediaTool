# Thrive API Media Tool — Development Guide

Admin UI for managing sermon content uploaded to the Thrive Church Official API. Staff-facing tool for uploading media, managing series metadata, and orchestrating the transcription pipeline.

## Purpose

This tool provides the primary interface for church tech teams to:
- Upload sermon video files and manage sermon media assets
- Create and organize series and message metadata
- Trigger AI workflows
- View asset storage and CDN delivery status

**Integration:** Posts to ThriveChurchOfficialAPI

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Angular | 20 |
| **Language** | TypeScript | 5.8.3 |
| **Styling** | Bootstrap | 5.3.2 |
| **Runtime** | Node.js | 20+ |
| **Deployment** | Docker / nginx | Alpine |
| **Package Manager** | npm | Latest |

## Project Structure

```
ThriveAPIMediaTool/
├── UI/
│   └── ThriveChurchMediaToolUI/
│       ├── src/
│       │   ├── app/                    # Angular components
│       │   │   ├── components/         # Reusable UI components
│       │   │   ├── services/           # API service layer
│       │   │   ├── models/             # TypeScript interfaces/types
│       │   │   ├── guards/             # Route guards (auth, etc)
│       │   │   └── app.component.ts
│       │   ├── environments/
│       │   │   ├── environment.ts      # Dev (localhost:8080)
│       │   │   ├── environment.docker.ts   # Docker/staging
│       │   │   └── environment.prod.ts    # Production
│       │   ├── assets/                 # Static files, icons
│       │   └── styles/                 # Global SCSS
│       ├── angular.json                # Build configuration
│       ├── tsconfig.json               # TypeScript config
│       ├── Dockerfile                  # Multi-stage build for production
│       ├── nginx.conf                  # nginx server config
│       └── .dockerignore
├── docker-compose.yml                  # Orchestrates build and run
├── DOCKER-SETUP.md                     # Docker deployment reference
├── README.md
└── .worktrees/                         # Local feature branches (gitignored)
```

## Local Development

### Prerequisites
- Node.js 20+ (verify with `node --version`)
- Angular CLI 20+ (`npm install -g @angular/cli`)
- Docker Desktop (for Docker-based testing)

### Quick Start

```bash
# Navigate to UI directory
cd UI/ThriveChurchMediaToolUI

# Install dependencies
npm install

# Start dev server with hot reload (port 4200)
npm start
# or: ng serve

# Open browser
# → http://localhost:4200
```

**Dev environment** uses `environment.ts` pointing to `http://localhost:8080` (local API). Change the `apiURL` in `environment.ts` to target a different API endpoint.

## Key Workflows

### File Upload
- Staff selects video file (large file handling via chunked streams if needed)
- Service validates file type and size against API limits
- HTTP POST to ThriveChurchOfficialAPI `/media/upload` endpoint
- On success, metadata stored in MongoDB; triggers transcription Lambda

### Series/Message Management
- CRUD forms for sermon series and individual messages
- Angular reactive forms with validation
- Calls ThriveChurchOfficialAPI endpoints

## Testing

```bash
# Run unit tests (Angular Jest/Jasmine)
npm test

# Run tests with coverage report
npm run test:coverage

# Run e2e tests (Cypress/Protractor if configured)
npm run e2e
```

**Coverage requirement:** 100% branch coverage on services and core components (no UI-only coverage inflation).

## Building for Production

### Docker Deployment (Recommended)

```bash
# From repo root
docker-compose up -d

# Verify
curl http://localhost:8081
```

**docker-compose.yml:**
- Builds Angular production bundle with tree-shaking
- Serves via nginx Alpine container on port 8081
- Uses `environment.docker.ts` for API URL
- No external dependencies; entirely self-contained

### Manual Docker Build

```bash
cd UI/ThriveChurchMediaToolUI

# Build image
docker build -t thrive-ui:latest .

# Run container
docker run -d -p 8081:80 --name thrive-ui thrive-ui:latest

# Logs
docker logs thrive-ui

# Stop
docker stop thrive-ui && docker rm thrive-ui
```

### Environment Configuration

Three environment files control API URL:

| File | Used By | Default API URL |
|------|---------|-----------------|
| `environment.ts` | `ng serve` | `http://localhost:8080` |
| `environment.docker.ts` | Docker build | Configure before build |
| `environment.prod.ts` | Cloud deployments | Configure before build |

**Important:** Docker bakes environment variables into the build. Rebuild the image if environment changes.

## API Integration

### Service Layer Pattern

Create services in `src/app/services/`:

```typescript
@Injectable({ providedIn: 'root' })
export class SermonMediaService {
  constructor(private http: HttpClient, private env: EnvironmentService) {}

  uploadMedia(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(
      `${this.env.apiURL}/media/upload`,
      formData
    );
  }

  getSeries(): Observable<Series[]> {
    return this.http.get<Series[]>(`${this.env.apiURL}/series`);
  }
}
```

**Key patterns:**
- Inject `environment` object for API base URL
- Use `HttpClient` for all API calls
- Return `Observable<T>` for async operations
- Handle errors at component level (subscribe handlers)

### Authentication

- JWT tokens handled by ThriveChurchOfficialAPI
- Store token in localStorage or sessionStorage
- Attach to all requests via HTTP interceptor
- Refresh token mechanism provided by API

## Code Standards

**TypeScript:**
- Strict mode enabled (tsconfig.json)
- No `any` types—use `unknown` and type narrowing
- Interface-driven design for API models
- Use `readonly` for immutable properties

**Angular:**
- Reactive forms (FormBuilder, FormControl) over template-driven
- OnDestroy + unsubscribe pattern (or `async` pipe in templates)
- One service/component per file
- Dependency injection for all external dependencies

**Naming:** See `Docs/Shared/Naming-Conventions.md` for TypeScript/Angular conventions.

## Deployment

### Staging & Production

- PR target: `dev` branch
- Deployment: Docker image built from `dev` branch
- Pipeline: GitHub Actions → Docker build → Registry → Deploy
- Manual deployment: `docker-compose up -d --build`

### Rollback

```bash
# Stop current container
docker-compose down

# Pull previous image version
docker pull thrive-ui:v1.x.x

# Run previous version
docker run -d -p 8081:80 --name thrive-ui thrive-ui:v1.x.x
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 4200 in use | `ng serve --port 4201` |
| API returns 404 | Verify `environment.ts` apiURL matches running API |
| Docker port 8081 in use | Edit docker-compose.yml: change `8081:80` to `8082:80` |
| Changes not reflecting in Docker | Rebuild: `docker-compose down && docker-compose up -d --build` |
| CORS errors from API | Verify API has correct origin in CORS headers; check ThriveChurchOfficialAPI config |

## Worktrees & Feature Workflow

**Always use local worktrees:**

```bash
# Create feature worktree
git worktree add .worktrees/feature-upload-ui -b feature/upload-ui dev

# Implement in isolated branch
cd .worktrees/feature-upload-ui
npm install
npm start

# Commit and push
git push -u origin feature/upload-ui

# Create PR against `dev` branch
# Clean up worktree after merge
git worktree remove .worktrees/feature-upload-ui
```

See `Docs/Thrive/Development-Workflow.md` for full feature workflow.

## Related Documentation

- **Architecture:** See Thrive Architecture docs (parent CLAUDE.md reference)
- **API Reference:** ThriveChurchOfficialAPI repo CLAUDE.md
- **Code Standards:** `Docs/Shared/Naming-Conventions.md`
- **Development Workflow:** `Docs/Thrive/Development-Workflow.md`

## Quick Reference

```bash
# Install & run dev
npm install && npm start

# Run tests
npm test

# Build for production
ng build --prod

# Docker: full build + run
docker-compose up -d --build

# Clean up worktrees
git worktree prune
```

---

**Maintainer:** Thrive Dev Team  
**Last Updated:** 2026-04-01
