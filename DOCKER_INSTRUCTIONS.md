# Synapse Infrastructure Docker Setup Instructions

## Prerequisites
1. Docker Desktop installed and running
2. All Synapse services (Frontend, Backend, Worker) in their respective directories
3. Proper directory structure:
   ```
   Synapse-Project/
   ├── Synapse-Frontend/
   ├── Synapse-Backend/
   ├── Synapse-Worker/
   └── Synapse-Infra/
   ```

## Setup Instructions

### 1. Create Dockerfile.dev in Each Service Directory

#### Synapse-Frontend/Dockerfile.dev (Already created)
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies for hot reloading on Windows
RUN apk add --no-cache libc6-compat

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Create the dist directory if it doesn't exist
RUN mkdir -p dist

# Expose dev server port
EXPOSE 4173

# Run the frontend dev server with hot reload
CMD ["npm", "run", "dev"]
```

#### Synapse-Backend/Dockerfile.dev (You need to create this)
```dockerfile
FROM python:3.9-slim

WORKDIR /code

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source code
COPY . .

# Expose the port your backend runs on
EXPOSE 8000

# Run the backend server
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

#### Synapse-Worker/Dockerfile.dev (You need to create this)
```dockerfile
FROM python:3.9-slim

WORKDIR /code

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source code
COPY . .

# Create necessary directories
RUN mkdir -p /hf_cache

# Set environment variables
ENV TRANSFORMERS_CACHE=/hf_cache
ENV HF_HOME=/hf_cache
ENV PYTHONPATH=/code

# Run the worker
CMD ["celery", "-A", "src.worker.app", "worker", "-l", "info"]
```

### 2. Fix Environment Variables

Ensure your `.env` file in the Synapse-Infra directory has all required variables:
```
# Postgres
POSTGRES_USER=youruser
POSTGRES_PASSWORD=yourpassword
POSTGRES_SERVER=postgres
POSTGRES_DB=yourdb

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0

# QDRANT
QDRANT_HOST=qdrant
QDRANT_PORT=6333
QDRANT_GRPC_PORT=6334

# JWT Secrets
JWT_SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
JWT_REFRESH_SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e8
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### 3. Run the Complete Infrastructure

From the Synapse-Infra directory, run:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

If you encounter port conflicts, stop any locally running services or change the ports in the docker-compose file.

### 4. Access the Services

- Frontend: http://localhost:4173
- Backend API: http://localhost:8000
- Redis: localhost:6379
- Postgres: localhost:5432
- Qdrant: http://localhost:6333

### 5. Troubleshooting

#### Port Conflicts
If you get "port already allocated" errors:
1. Stop any locally running services on those ports
2. Or change the host port in docker-compose (e.g., change "4173:4173" to "4174:4173")

#### Permission Issues on Windows
If you encounter permission issues:
1. Make sure Docker Desktop is running as administrator
2. Share the drive containing your project in Docker Desktop settings

#### Build Issues
If services fail to build:
1. Ensure all required files (requirements.txt, package.json) exist
2. Check that the paths in docker-compose.yml are correct
3. Verify that all environment variables are properly set

### 6. Testing Individual Services

You can also test individual services:

```bash
# Test frontend only
docker-compose -f docker-compose.dev.yml up --build frontend

# Test backend only
docker-compose -f docker-compose.dev.yml up --build backend
```