# Deployment Guide

## Prerequisites

- Docker ≥ 20.10
- Docker Compose ≥ 2.0

## Quick Start

### Production

Build and run the application:

```bash
docker compose up -d --build
```

The app will be available at `http://localhost:3001`.

### Development

Run with live-reload enabled:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Source code changes in `backend/src/` will trigger a hot-restart automatically.

## Configuration

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

| Variable         | Default          | Description                          |
| ---------------- | ---------------- | ------------------------------------ |
| `PORT`           | `3001`           | Backend server port                  |
| `DB_PATH`        | `/data/todo.db`  | SQLite database file path            |
| `NODE_ENV`       | `production`     | Node environment mode                |
| `REACT_APP_API_URL` | (none)      | Frontend API base URL (build-time)   |

## Database Persistence

SQLite data is stored in a Docker named volume (`todo-data`) by default.
To use a host-mounted directory instead, edit `docker-compose.yml`:

```yaml
volumes:
  - ./data:/data
```

## Stopping and Cleanup

Stop the container:

```bash
docker compose down
```

Stop and remove the database volume (⚠️ deletes all data):

```bash
docker compose down -v
```

## Dockerfile Architecture

The Dockerfile uses a **multi-stage build**:

1. **Stage 1 (`frontend-builder`):** Builds the React frontend using `react-scripts build`.
2. **Stage 2 (`backend`):** Installs backend dependencies, copies the built frontend static files, and runs the Express server.

The final image is lean — only production backend dependencies and static frontend files are included.

## Docker Compose Architecture

| File                 | Purpose                           |
| -------------------- | --------------------------------- |
| `docker-compose.yml` | Production deployment config      |
| `docker-compose.dev.yml` | Development overlay with hot-reload |

Combine them with: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`
