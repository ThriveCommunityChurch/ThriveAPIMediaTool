# Docker Setup for Thrive Church Media Tool UI

This setup replaces IIS for local deployment of the Angular UI.

## 🎯 Port Configuration

| Service | Port | Description |
|---------|------|-------------|
| **UI (Docker)** | 8081 | Angular production build (replaces IIS) |
| **UI (Dev)** | 4200 | Angular dev server (ng serve) |

---

## 🚀 Quick Start

### **Build and Run**

```bash
# Build and start the UI
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### **Access the Application**

- **UI:** http://localhost:8081

---

## 🛠️ Development Workflow

### **Option 1: Docker (Production-like)**

Use this when you want to test the production build locally:

```bash
docker-compose up -d
```

- UI runs on port 8081
- Uses production build with nginx
- Points to configured API URL (from `environment.docker.ts`)

### **Option 2: Angular Dev Server (Recommended for Development)**

Use this for UI development with hot reload:

```bash
cd UI/ThriveChurchMediaToolUI
npm start
```

- UI runs on port 4200 with hot reload
- Uses `environment.ts` (points to `localhost:8080` by default)
- Changes reflect immediately

---

## 📁 File Structure

```
ThriveAPIMediaTool/
├── docker-compose.yml          # Builds and runs UI
├── DOCKER-SETUP.md            # This file
└── UI/
    └── ThriveChurchMediaToolUI/
        ├── Dockerfile          # Builds Angular app
        ├── nginx.conf          # Nginx configuration
        ├── .dockerignore       # Excludes node_modules, etc.
        └── src/
            └── environments/
                ├── environment.ts          # Dev (localhost:8080)
                ├── environment.docker.ts   # Docker (configured API URL)
                └── environment.prod.ts     # Production (configured API URL)
```

---

## 🔧 Building the UI

### **Using docker-compose (Recommended)**

```bash
docker-compose up -d
```

### **Using Docker directly**

```bash
cd UI/ThriveChurchMediaToolUI
docker build -t thrive-ui .
docker run -d -p 8081:80 --name thrive-ui thrive-ui
```

---

## 🎨 Environment Configurations

The Angular app has 3 environment configurations:

| Configuration | File | API URL | Use Case |
|---------------|------|---------|----------|
| **development** | `environment.ts` | `localhost:8080` | Local dev (ng serve) |
| **docker** | `environment.docker.ts` | Configured | Docker deployment |
| **production** | `environment.prod.ts` | Configured | Cloud deployment |

**Note:** Update `environment.docker.ts` and `environment.prod.ts` with your actual API URLs. You must rebuild the Docker image after changing `environment.docker.ts`.

---

## 🔐 Security Notes

1. **The UI is served over HTTP** - For local use only
2. **Rebuild after environment changes** - Docker bakes the environment file into the image
3. **No secrets in the UI** - All authentication happens via the API

---

## 🐛 Troubleshooting

### **Port 8081 already in use**

```bash
# Check what's using the port
netstat -ano | findstr ":8081"

# Stop the container
docker stop thrive-ui && docker rm thrive-ui

# Or change the port in docker-compose.yml
ports:
  - "8082:80"  # Access UI at localhost:8082 instead
```

### **UI can't reach API**

Check your environment configuration:
- For `ng serve`: Update `environment.ts` with correct API URL
- For Docker: Update `environment.docker.ts` and rebuild the image

### **Changes not reflecting in Docker**

Remember to rebuild after code changes:

```bash
docker-compose down
docker-compose up -d --build
```

---

## 🎉 Benefits of Docker Setup

✅ **No more IIS headaches** - Simple nginx configuration
✅ **Consistent environments** - Same setup for all developers
✅ **Easy deployment** - One command to start the UI
✅ **Production-like testing** - Test exactly as it will run in production
✅ **Lightweight** - nginx Alpine image (~85MB)

---

## 📚 Next Steps

1. **Configure environment files** - Update `environment.docker.ts` with your API URL
2. **Test the Docker setup** - Run `docker-compose up -d`
3. **Use ng serve for development** - Save Docker for production testing
4. **Consider CI/CD** - Automate Docker builds and deployments

