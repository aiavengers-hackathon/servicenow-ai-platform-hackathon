# ServiceNow AI Platform 🤖

**AI-Powered Enterprise Service Management Platform**

Leverage Azure OpenAI to enhance ServiceNow workflows with intelligent chat, intent detection, and natural language processing.

## 📌 Quick Links

- 📖 **[Setup Guide](./SETUP_GUIDE.md)** - Get up and running in 5 minutes
- 🚀 **[Development Guide](./DEVELOPMENT.md)** - Architecture and development workflow
- 📚 **[API Documentation](./API_DOCUMENTATION.md)** - Endpoint reference and examples
- 🤝 **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- 🆘 **[Troubleshooting](./SETUP_GUIDE.md#troubleshooting)** - Common issues and fixes

## ✨ Features

- 🤖 **AI-Powered Chat** - Conversational interface powered by Azure OpenAI
- 🎯 **Intent Detection** - Automatically classify user requests (incidents, access, changes)
- 🔍 **Knowledge Search** - RAG-powered search through enterprise knowledge base
- 📊 **Conversation Memory** - Context-aware responses with conversation history
- 🚀 **Fast & Scalable** - Built with FastAPI and React for performance
- 🔐 **Enterprise Ready** - PostgreSQL backend, vector DB support, Docker ready

## 🏗️ Architecture

```
┌─────────────────────┐
│   React Frontend    │
│   (Vite, Port 5173) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│      FastAPI Backend (Port 5000)        │
├─────────────────────────────────────────┤
│ • Chat Router                           │
│ • Intent Detection (LLM-based)          │
│ • RAG Engine (Vector Search)            │
│ • Conversation Memory                   │
└──────────┬──────────────────────────────┘
           │
    ┌──────┼──────┐
    ▼      ▼      ▼
 ┌─────┐ ┌──────┐ ┌──────┐
 │ DB  │ │Azure │ │Chroma│
 │PG   │ │OpenAI│ │ VecDB│
 └─────┘ └──────┘ └──────┘
```

## 🛠️ Technology Stack

### Backend
- **Python 3.11+** - Runtime
- **FastAPI** - Web framework
- **LangChain** - LLM orchestration
- **Azure OpenAI** - AI model provider
- **PostgreSQL** - Database
- **Chroma** - Vector database
- **SQLAlchemy** - ORM

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **CSS3** - Styling

### Infrastructure
- **Docker** - Containerization
- **Git** - Version control

## ⚡ Quick Start

### 1️⃣ Prerequisites

```bash
# Check versions
python3 --version  # 3.11+
node --version     # 18+
npm --version      # 8+
git --version      # 2.0+
```

### 2️⃣ Clone Repository

```bash
git clone https://github.com/your-org/servicenow-ai-platform.git
cd servicenow-ai-platform-hackathon
```

### 3️⃣ Run Setup

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run complete setup
bash scripts/setup.sh

# Configure Azure OpenAI (interactive)
bash scripts/setup-local.sh
```

### 4️⃣ Start Development Servers (Local)

You can use the included helper script to run locally.

```bash
# dev mode (hot reload frontend and backend)
bash scripts/run_local.sh dev

# prod-like local (gunicorn backend + static frontend served)
bash scripts/run_local.sh prod
```

### 5️⃣ Docker

```bash
# Build and run stack with Docker Compose
bash scripts/run_docker.sh
```

### Access Application

- **Frontend (dev)**: http://localhost:5173
- **Frontend (prod static)**: http://localhost:3000 (local static serve) or http://localhost (docker)
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📖 Documentation

### For Setup & Installation
👉 See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

- System requirements
- Step-by-step setup
- Azure OpenAI configuration
- Docker setup
- Troubleshooting

### For Development
👉 See [DEVELOPMENT.md](./DEVELOPMENT.md)

- Architecture overview
- Project structure
- Development workflow
- Running locally
- Debugging tips
- Common tasks

### For API Usage
👉 See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

- All endpoints documented
- Request/response examples
- Error handling
- SDK examples (Python, JavaScript)
- Rate limiting info

### For Contributing
👉 See [CONTRIBUTING.md](./CONTRIBUTING.md)

- Code of conduct
- Git workflow
- Commit guidelines
- Pull request process
- Coding standards
- Testing requirements

## 🗂️ Project Structure

```
servicenow-ai-platform-hackathon/
├── README.md                    # This file
├── SETUP_GUIDE.md              # Setup instructions
├── DEVELOPMENT.md              # Development guide
├── API_DOCUMENTATION.md        # API reference
├── CONTRIBUTING.md             # Contribution guidelines
├── package.json                # Root npm config
├── docker-compose.yml          # Docker orchestration
│
├── backend/                    # Python FastAPI application
│   ├── requirements.txt
│   ├── .env.example
│   ├── venv/                   # Virtual environment
│   └── app/
│       ├── main.py             # FastAPI entry point
│       ├── ai/                 # AI modules
│       │   ├── llm.py          # Azure OpenAI config
│       │   ├── intents.py      # Intent detection
│       │   ├── memory.py       # Conversation memory
│       │   └── rag.py          # RAG engine
│       ├── routes/             # API endpoints
│       ├── services/           # Business logic
│       ├── db/                 # Database
│       └── utils/              # Utilities
│
├── frontend/                   # React Vite application
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Root component
│       ├── components/         # Reusable components
│       ├── pages/              # Page components
│       ├── services/           # API client
│       └── assets/             # Static files
│
└── scripts/                    # Utility scripts
    ├── setup.sh                # Complete setup
    ├── setup-local.sh          # Interactive setup
    └── clean.sh                # Cleanup
```

## 🚀 Usage Examples

### Chat with AI

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Help me create an incident for VPN not working"
  }'
```

### Search Knowledge Base

```bash
curl -X GET "http://localhost:5000/api/kb/search?query=password%20reset"
```

### Python Client

```python
from app.ai.llm import llm

response = llm.invoke("What is ServiceNow?")
print(response)
```

### JavaScript Client

```javascript
import { chatWithAI } from './services/api';

const response = await chatWithAI('Help me with an incident');
console.log(response.data.response);
```

## 🔧 Environment Configuration

### Backend (.env)

```bash
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/servicenow
```

### Frontend (.env.local)

```bash
VITE_API_URL=http://localhost:5000/api
```

## 🐳 Docker Deployment

```bash
# Build and run
docker-compose up --build

# Services available at:
# Frontend: http://localhost:80
# Backend:  http://localhost:5000
```

## 🧪 Testing

```bash
# Backend tests
cd backend && pytest

# Frontend tests  
cd frontend && npm test

# Coverage report
pytest --cov=app tests/
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message to AI |
| `GET` | `/api/chat/history` | Get conversation history |
| `POST` | `/api/intents/detect` | Detect user intent |
| `GET` | `/api/kb/search` | Search knowledge base |
| `GET` | `/docs` | Interactive API docs |

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🆘 Troubleshooting

### Common Issues

**"Module not found" error**
```bash
cd backend && source venv/bin/activate && pip install -r requirements.txt
```

**"Port already in use"**
```bash
# Run on different port
uvicorn app.main:app --port 5001
```

**"Invalid API Key"**
- Check Azure Portal for correct credentials
- Verify key hasn't been rotated
- Ensure endpoint format includes trailing slash

See [SETUP_GUIDE.md - Troubleshooting](./SETUP_GUIDE.md#troubleshooting) for more.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code of conduct
- Git workflow
- Development guidelines
- Pull request process

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Support

- 📖 **Documentation**: See docs/ folder
- 🐛 **Report Issues**: Use GitHub issues
- 💬 **Discussions**: Use GitHub discussions
- 📧 **Email**: contact@servicenow-ai.dev

## 🎯 Roadmap

### v1.0 (Current)
- ✅ Azure OpenAI integration
- ✅ Intent detection
- ✅ Conversation memory
- ✅ Knowledge base search

### v1.1 (Planned)
- 🔄 Advanced RAG features
- 🔄 Multi-language support
- 🔄 Custom intent training
- 🔄 Analytics dashboard

### v2.0 (Future)
- 🔄 Webhook support
- 🔄 API authentication
- 🔄 Enterprise audit logs
- 🔄 Advanced security features

## 👥 Team

- **Maintained by**: ServiceNow AI Platform Team
- **Contributors**: See [CONTRIBUTORS.md](./CONTRIBUTORS.md)

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Powered by [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service/)
- Frontend with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- RAG with [LangChain](https://python.langchain.com/) and [Chroma](https://www.trychroma.com/)

---

## 📅 Recent Updates

- **May 2026**: Complete Azure OpenAI migration
- **May 2026**: Professional documentation suite
- **May 2026**: Automated setup scripts
- **May 2026**: Full API documentation

---

**Ready to get started?** 👉 [Setup Guide](./SETUP_GUIDE.md)

