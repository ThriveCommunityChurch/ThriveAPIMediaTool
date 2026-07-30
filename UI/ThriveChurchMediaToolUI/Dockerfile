# Stage 1: Build the Angular application
FROM node:26-alpine AS build

WORKDIR /app

# Enable pnpm
RUN corepack enable pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application for Docker deployment (uses environment.docker.ts)
RUN pnpm run build -- --configuration=docker

# Stage 2: Serve with nginx
FROM nginx:alpine AS runtime

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

