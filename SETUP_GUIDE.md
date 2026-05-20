# Setup Guide - ServiceNow AI Platform

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Azure OpenAI Configuration](#azure-openai-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Python**: 3.11 or higher
- **Node.js**: 18 or higher
- **npm**: 8 or higher
- **Git**: 2.0 or higher
- **PostgreSQL**: 14 or higher (for database)
- **Docker** (optional): For containerized deployment

### Verify Installation

```bash
python3 --version  # Should show 3.11+
node --version     # Should show v18+
npm --version      # Should show 8+
git --version      # Should show 2.0+
```

## Quick Start

### 1. Clone and Navigate

```bash
# Navigate to the project directory
cd servicenow-ai-platform-hackathon

# Initialize git if needed
git init
```

### 2. Run Setup Script

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run the complete setup
bash scripts/setup.sh
```

### 3. Configure Credentials

```bash
# Interactive local setup (recommended for first-time)
bash scripts/setup-local.sh

# Or manually edit
nano backend/.env
```

### 4. Start Development

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Frontend  
cd frontend
npm run dev
```

## Detailed Setup

### Backend Setup

#### Step 1: Create Virtual Environment

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate on Linux/Mac
source venv/bin/activate

# Activate on Windows
venv\Scripts\activate
```

#### Step 2: Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
```

#### Step 3: Configure Environment

```bash
# Copy example to actual config
cp .env.example .env

# Edit with your credentials
nano .env
# or
code .env
```

#### Step 4: Initialize Database

```bash
# The database will be initialized automatically on first run
# Manual initialization (if needed):
# - Ensure PostgreSQL is running
# - Update DATABASE_URL in .env if different
# - The app will create tables on startup
```

#### Step 5: Verify Backend

```bash
# Run the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000

# Expected output:
# INFO:     Started server process [xxxxx]
# INFO:     Application startup complete
# INFO:     Uvicorn running on http://0.0.0.0:5000
```

### Frontend Setup

#### Step 1: Install Dependencies

```bash
cd frontend

npm install
```

#### Step 2: Configure Environment

```bash
# Create local environment file
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000/api
EOF
```

#### Step 3: Verify Frontend

```bash
# Run development server
npm run dev

# Expected output:
# VITE v5.x.x  ready in xxx ms
#
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

Access the application at: `http://localhost:5173`

## Azure OpenAI Configuration

### Get Your Credentials

1. **Login to Azure Portal**: https://portal.azure.com

2. **Navigate to Azure OpenAI**:
   - Search for "Azure OpenAI" in the search bar
   - Select your OpenAI resource

3. **Get Endpoint**:
   - Go to **Keys and Endpoint** (left sidebar)
   - Copy the **Endpoint** value
   - Format: `https://<resource-name>.openai.azure.com/`

4. **Get API Key**:
   - From the same **Keys and Endpoint** page
   - Copy either **Key 1** or **Key 2**
   - ⚠️ **Never commit this key to git**

5. **Get Deployment Name**:
   - Go to **Model deployments** (left sidebar)
   - View your deployments (e.g., `gpt-4`, `gpt-35-turbo`)
   - Ensure deployment status is **"Succeeded"**

### Configure in .env

```bash
# backend/.env
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_API_KEY=your-actual-api-key
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

### Verify Configuration

Test your Azure OpenAI setup:

```bash
# From backend directory (with venv activated)
python3 -c "from app.ai.llm import llm; print(llm.invoke('Hello'))"
```

Expected: Model response should print successfully

## Docker Setup (Alternative)

### Build and Run with Docker

```bash
# From root directory
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:80
# Backend:  http://localhost:5000
# Database: localhost:5432
```

### .env for Docker

Create `.env` file in root directory:

```bash
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

## Troubleshooting

### Python Issues

**Error: `python3: command not found`**
- Install Python 3.11+
- Add Python to PATH

**Error: `ModuleNotFoundError: No module named 'xxx'`**
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall requirements
pip install -r requirements.txt
```

### Node.js Issues

**Error: `npm: command not found`**
- Install Node.js from https://nodejs.org
- Restart terminal

**Error: `npm ERR! peer dep missing`**
```bash
cd frontend
npm install --force
```

### Azure OpenAI Issues

**Error: `Invalid API Key`**
- Verify key is correct in .env
- Check key hasn't been rotated in Azure Portal
- Ensure key is not expired

**Error: `Deployment not found`**
- Verify deployment name exactly matches (case-sensitive)
- Check deployment status is "Succeeded"
- Ensure correct region

**Error: `Unauthorized`**
- Check API version format (YYYY-MM-DD-preview)
- Verify endpoint URL ends with `/`
- Confirm endpoint is from correct resource

### Database Issues

**Error: `Connection refused` to PostgreSQL**

```bash
# Option 1: Use Docker for database
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16

# Option 2: Update DATABASE_URL in .env
# Default: postgresql://postgres:postgres@localhost:5432/servicenow
```

**Error: `Database does not exist`**
```bash
# Database is created automatically on first app startup
# If manual creation needed:
createdb -U postgres servicenow
```

### Port Conflicts

**Error: `Address already in use`**

```bash
# Backend on different port:
uvicorn app.main:app --reload --port 5001

# Frontend on different port:
npm run dev -- --port 5174

# Update VITE_API_URL if backend port changes
```

### Git Issues

**Error: `Push rejected - secret detected`**

The `.env` file with credentials should never be committed. It's already in `.gitignore`.

```bash
# Verify .env is ignored
git status  # Should not show backend/.env

# Use template instead
git add backend/.env.example
```

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI resource endpoint | `https://resource.openai.azure.com/` |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key | `xxxxxxxxxxxx...` |
| `AZURE_OPENAI_API_VERSION` | API version to use | `2024-02-15-preview` |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Deployment name in Azure | `gpt-4` |
| `APP_ENV` | Environment (development/production) | `development` |
| `LOG_LEVEL` | Logging level (DEBUG/INFO/WARNING/ERROR) | `INFO` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Health Checks

Verify all services are running:

```bash
# Backend health
curl http://localhost:5000/

# Expected: 200 OK
{"status":"running"}

# Frontend
curl http://localhost:5173/

# Expected: 200 OK with HTML content
```

## Next Steps

1. **Read**: [DEVELOPMENT.md](./DEVELOPMENT.md) - Development workflow and architecture
2. **Read**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoints
3. **Read**: [CONTRIBUTING.md](./CONTRIBUTING.md) - Contributing guidelines

## Getting Help

- Check [Troubleshooting](#troubleshooting) section above
- Review [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- Check [FastAPI Documentation](https://fastapi.tiangolo.com/)
- Check [Vite Documentation](https://vitejs.dev/)

---

**Last Updated**: May 2026  
**Maintainer**: ServiceNow AI Platform Team
