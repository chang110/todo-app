# =============================================================================
# Stage 1: Build the React frontend
# =============================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files first (for better layer caching)
COPY frontend/package.json frontend/package-lock.json* ./

# Install all dependencies (react-scripts needs devDeps to run the build)
RUN npm install

# Copy frontend source and build
COPY frontend/ ./

# Build the React app (static output goes to frontend/build/)
RUN npm run build

# =============================================================================
# Stage 2: Production backend image
# =============================================================================
FROM node:20-alpine AS backend

# Install production dependencies for sqlite3 (node-sqlite3 native build deps)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy backend package files first
COPY backend/package.json backend/package-lock.json* ./

# Install backend dependencies (sqlite3 needs native compilation)
RUN npm ci 2>/dev/null || npm install

# Copy backend source code
COPY backend/src/ ./src/

# Copy the built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Create volume mount point for SQLite database persistence
RUN mkdir -p /data && \
    chown -R node:node /app /data

# Use non-root user for security
USER node

# Expose the backend port (default 3001)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start the backend server
CMD ["node", "src/index.js"]
