<p align="center">
  <img src="https://user-images.githubusercontent.com/22202975/205743304-073fb721-7ca3-4b52-a132-f397452f2e99.png" data-canonical-src="https://user-https://user-images.githubusercontent.com/22202975/205743304-073fb721-7ca3-4b52-a132-f397452f2e99.png" target="_blank">
 </p>

# Thrive API Media Tool
A web-based UI tool used to upload and manage media items for the Thrive Church Official API.

## Purpose
The idea behind this tool is to make it easier for the tech team to be able to upload new media items / series' to the [Thrive Church Official API](https://github.com/ThriveCommunityChurch/ThriveChurchOfficialAPI/).

## Stack
- Angular 20
- Node.js 20+
- Bootstrap 5.3.2
- TypeScript 5.8.3
- Docker (for production deployment)
- nginx (for serving production builds)

## Development Setup

### Prerequisites
- Node.js 20 or higher
- Angular CLI (`npm install -g @angular/cli`)
- Docker Desktop (for production deployment)

### Quick Start - Development

1. **Navigate to the UI directory:**
   ```bash
   cd UI/ThriveChurchMediaToolUI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   ng serve
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:4200`
   - The app will automatically reload when you make changes

### Environment Configuration

The application uses different environment files for different deployment scenarios:

#### Development (`environment.ts`)
Used when running `ng serve` locally:
```typescript
export const environment = {
  production: false,
  apiURL: "http://localhost:8080"
};
```

#### Docker Deployment (`environment.docker.ts`)
Used for local "production" deployment via Docker:
```typescript
export const environment = {
  production: true,
  apiURL: "http://your-production-api-url:port"
};
```

#### Alternate Production (`environment.prod.ts`)
Used for cloud deployments:
```typescript
export const environment = {
  production: true,
  apiURL: "http://your-production-api-url:port"
};
```

## Docker Production Deployment

The UI can be deployed as a Docker container for production use, replacing the previous IIS deployment.

### Building the Docker Image

```bash
# From the repository root
cd UI/ThriveChurchMediaToolUI

# Build the Docker image
docker build -t thrive-ui:local .
```

### Running the Container

```bash
# Run on port 8081 (or any available port)
docker run -d -p 8081:80 --name thrive-ui thrive-ui:local

# Access the UI at http://localhost:8081
```

### Docker Configuration

- **Dockerfile:** `UI/ThriveChurchMediaToolUI/Dockerfile`
- **nginx config:** `UI/ThriveChurchMediaToolUI/nginx.conf`
- **Build configuration:** Uses `environment.docker.ts` for API URL
- **Port mapping:** Host port (8081) → Container port (80)

### Useful Docker Commands

```bash
# View logs
docker logs thrive-ui

# Stop the container
docker stop thrive-ui

# Start the container
docker start thrive-ui

# Rebuild after changes
docker stop thrive-ui && docker rm thrive-ui && \
docker build -t thrive-ui:local . && \
docker run -d -p 8081:80 --name thrive-ui thrive-ui:local
```
  
## Screenshots
<img src="https://github.com/ThriveCommunityChurch/ThriveAPIMediaTool/assets/22202975/c8d24d38-528a-4d4e-a914-c38f90f18d10" width="100%">
<img src="https://github.com/ThriveCommunityChurch/ThriveAPIMediaTool/assets/22202975/4c78a591-52a5-4405-aab2-fd37ff6b22de" width="100%">
<img src="https://github.com/ThriveCommunityChurch/ThriveAPIMediaTool/assets/22202975/7c89b9a8-877f-400e-81cb-650238c9eb2a" width="100%">
<img src="https://github.com/ThriveCommunityChurch/ThriveAPIMediaTool/assets/22202975/1b95cfe0-1254-4e61-aa9e-a47f8e92f182" width="100%">
<img src="https://github.com/ThriveCommunityChurch/ThriveAPIMediaTool/assets/22202975/007e057f-4da2-4dee-9109-c590ff855e2e" width="100%">
