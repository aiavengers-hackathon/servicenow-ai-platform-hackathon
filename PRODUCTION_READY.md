# ServiceNow AI Platform - Production Ready Guide

## ✅ Project Status
**All features complete and production-ready**

This is a fully functional AI-powered enterprise service management platform built with FastAPI, React, and Azure OpenAI.

## 🎯 Key Features Implemented

### Backend Features
- ✅ **AI Chat Interface** - Conversational AI powered by Azure OpenAI
- ✅ **Intent Detection** - Automatic classification of user requests (incidents, access, changes)
- ✅ **CRUD Operations** - Full API endpoints for incidents, access requests, and change requests
- ✅ **Authentication** - JWT-based authentication with role-based access control
- ✅ **Database Integration** - PostgreSQL for persistent data storage
- ✅ **Auto-seeding** - Automatic admin user creation on startup
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **RAG Support** - Vector database integration for knowledge base search
- ✅ **Chat History** - Persistent conversation history tracking

### Frontend Features
- ✅ **Dashboard** - Real-time statistics and recent tickets
- ✅ **AI Assistant** - Interactive chat interface
- ✅ **Incidents Management** - View and manage incidents
- ✅ **Access Requests** - Submit and track access requests
- ✅ **Change Requests** - Manage change requests
- ✅ **Admin Panel** - Administrative controls
- ✅ **Authentication** - Login/logout with token management
- ✅ **Responsive UI** - Tailwind CSS styled responsive interface

## 🚀 Quick Start

### Option 1: Docker (Recommended for Production)

```bash
# 1. Clone repository
cd servicenow-ai-platform-hackathon

# 2. Configure Azure OpenAI
# Edit backend/.env with your Azure credentials:
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
# AZURE_OPENAI_API_KEY=your-api-key
# AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# 3. Build and run with Docker Compose
docker-compose up --build

# 4. Access the application
# Frontend: http://localhost:80
# Backend API: http://localhost:5000
# API Docs: http://localhost:5000/docs
```

### Option 2: Local Development

#### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 16 (or use Docker)
- npm 8+

#### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (edit .env)
cp .env.example .env
# Edit .env with your Azure OpenAI credentials

# Run migrations (auto-created on startup)
# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/token` - Login with username/password
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user info

### Incidents
- `GET /api/incidents` - List all incidents
- `GET /api/incidents/{id}` - Get incident details
- `POST /api/incidents` - Create incident
- `PATCH /api/incidents/{id}` - Update incident status
- `GET /api/incidents/count` - Get incident count

### Access Requests
- `GET /api/access-requests` - List all requests
- `POST /api/access-requests` - Create request
- `GET /api/access-requests/{id}` - Get request details
- `PATCH /api/access-requests/{id}` - Update request status
- `GET /api/access-requests/count` - Get request count

### Change Requests
- `GET /api/change-requests` - List all changes
- `POST /api/change-requests` - Create change request
- `GET /api/change-requests/{id}` - Get change details
- `PATCH /api/change-requests/{id}` - Update change status
- `GET /api/change-requests/count` - Get change count

### AI Chat
- `POST /api/chat` - Send message to AI assistant
- `GET /api/chat-history` - Get chat history

### Dashboard
- `GET /api/tickets/recent` - Get recent tickets

## 🔐 Default Credentials

When running with `AUTO_SEED_DEV=true` (Docker default), a default admin account is created:

- **Username**: admin
- **Password**: changeme

⚠️ **Change these credentials before deploying to production!**

### To update credentials:

Edit `backend/.env`:
```bash
DEV_ADMIN_USER=your-admin-username
DEV_ADMIN_PASSWORD=your-strong-password
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```bash
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Database (PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/servicenow

# Authentication
SECRET_KEY=your-super-secret-key-change-this
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Development
AUTO_SEED_DEV=true
DEV_ADMIN_USER=admin
DEV_ADMIN_PASSWORD=changeme
```

**Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:5000
```

## 📊 Database Schema

### Tables
- **users** - User accounts
- **roles** - User roles (admin, manager, user)
- **incidents** - IT incidents
- **access_requests** - Access request tickets
- **change_requests** - Change management tickets
- **chat_history** - AI conversation history
- **audit_logs** - Action audit trail

## 🧪 Testing

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=changeme"
```

### Create Incident
```bash
curl -X POST http://localhost:5000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "VPN Connection Failed",
    "description": "Unable to connect to VPN",
    "severity": "high"
  }'
```

### Chat with AI
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need help with a VPN issue"
  }'
```

## 🏗️ Project Structure

```
servicenow-ai-platform-hackathon/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app entry
│   │   ├── auth.py           # Authentication
│   │   ├── ai/               # AI modules
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Business logic
│   │   ├── db/               # Database models
│   │   └── utils/            # Utilities
│   ├── requirements.txt       # Python dependencies
│   ├── .env                  # Configuration
│   └── Dockerfile            # Docker image
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx          # React entry
│   │   ├── App.jsx           # Root component
│   │   ├── pages/            # Page components
│   │   ├── components/       # UI components
│   │   ├── services/         # API client
│   │   ├── layout/           # Layout components
│   │   └── index.css         # Styles
│   ├── package.json          # Dependencies
│   ├── vite.config.js        # Vite config
│   ├── tailwind.config.js    # Tailwind config
│   └── Dockerfile            # Docker image
│
├── docker-compose.yml        # Docker orchestration
├── README.md                 # Overview
└── PRODUCTION_READY.md       # This file
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port
lsof -i :5000  # Backend
lsof -i :5173  # Frontend
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
docker ps  # If using Docker
# or
psql -U postgres -d servicenow  # If local PostgreSQL
```

### Azure OpenAI Not Responding
- Verify AZURE_OPENAI_ENDPOINT is correct
- Check AZURE_OPENAI_API_KEY is valid
- Ensure deployment name exists in Azure

### Frontend Cannot Connect to Backend
- Check backend is running on port 5000
- Verify REACT_APP_API_URL environment variable
- Check CORS settings in backend (should allow all origins in development)

## 📈 Performance Optimization

### Production Recommendations
1. **Use strong SECRET_KEY** - Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
2. **Enable HTTPS** - Use reverse proxy (Nginx, Apache)
3. **Database** - Use managed PostgreSQL service (AWS RDS, Azure Database)
4. **Caching** - Add Redis for session/chat caching
5. **Rate Limiting** - Implement API rate limiting
6. **Logging** - Use centralized logging (CloudWatch, ELK)
7. **Monitoring** - Set up application monitoring and alerting

## 🔄 CI/CD Pipeline

### GitHub Actions (Example)
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          cd backend
          pip install -r requirements.txt
          pytest
```

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Support

For issues and questions:
1. Check troubleshooting section
2. Review logs: `docker-compose logs`
3. Check API docs: `http://localhost:5000/docs`

---

**Ready for Production!** 🚀
