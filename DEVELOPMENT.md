# Development Guide - ServiceNow AI Platform

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Running Locally](#running-locally)
- [API Integration](#api-integration)
- [Key Components](#key-components)
- [Debugging](#debugging)
- [Testing](#testing)

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│                      Port: 5173                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTP/REST
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                Backend (FastAPI/Python)                      │
│                      Port: 5000                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐         │
│  │ Chat Router │  │  LLM Engine  │  │  Intents    │         │
│  │ /api/chat   │  │  (Azure AI)  │  │  Detection  │         │
│  └─────────────┘  └──────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Vector DB (Chroma) + RAG Engine              │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐        ┌──────────┐      ┌──────────┐
   │ Database│        │  Azure   │      │ Chroma   │
   │PostgreSQL       │ OpenAI   │      │Vector DB │
   │ Port 5432│        │ Cloud    │      │ Port 8000│
   └─────────┘        └──────────┘      └──────────┘
```

### Technology Stack

**Backend**:
- FastAPI - Web framework
- Python 3.11+ - Runtime
- LangChain - LLM orchestration
- Azure OpenAI - AI model provider
- PostgreSQL - Data persistence
- Chroma - Vector database (RAG)
- SQLAlchemy - ORM

**Frontend**:
- React 18+ - UI library
- Vite - Build tool
- Axios - HTTP client
- CSS3 - Styling

**Infrastructure**:
- Docker/Docker Compose - Containerization
- Git - Version control

## Project Structure

```
servicenow-ai-platform-hackathon/
├── README.md
├── SETUP_GUIDE.md
├── DEVELOPMENT.md
├── API_DOCUMENTATION.md
├── CONTRIBUTING.md
├── package.json                 # Root configuration
├── docker-compose.yml           # Docker orchestration
│
├── backend/
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables (git-ignored)
│   ├── .env.example              # Template for .env
│   ├── venv/                     # Virtual environment
│   ├── app/
│   │   ├── main.py               # FastAPI application entry
│   │   ├── ai/
│   │   │   ├── llm.py            # Azure OpenAI LLM configuration
│   │   │   ├── intents.py        # Intent detection logic
│   │   │   ├── memory.py         # Conversation memory
│   │   │   └── rag.py            # Retrieval-Augmented Generation
│   │   ├── services/
│   │   │   └── ai_services.py    # AI service functions
│   │   ├── routes/
│   │   │   └── chat.py           # Chat endpoints
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts   # Error handling
│   │   │   └── validation.ts     # Input validation
│   │   ├── models/
│   │   │   └── task.model.ts     # Data models
│   │   ├── db/
│   │   │   ├── database.py       # Database connection
│   │   │   └── models.py         # SQLAlchemy models
│   │   └── utils/
│   │       └── helpers.py        # Utility functions
│   ├── tests/
│   │   └── test_*.py             # Unit tests
│   └── data/
│       └── chroma/               # Vector store persistence
│
├── frontend/
│   ├── package.json              # Node dependencies
│   ├── .env.local                # Frontend environment
│   ├── vite.config.js            # Vite configuration
│   ├── index.html                # HTML entry point
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Root component
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # Page components
│   │   ├── services/
│   │   │   └── api.js            # API client
│   │   ├── assets/               # Static assets
│   │   └── styles/               # Global styles
│   └── public/                   # Static files
│
└── scripts/
    ├── setup.sh                  # Complete setup
    ├── setup-local.sh            # Interactive setup
    └── clean.sh                  # Cleanup script
```

## Development Workflow

### 1. Start Development Servers

**Option A: Separate Terminals (Recommended)**

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Option B: Combined Command**

```bash
npm run dev
# Requires concurrently package (installed by setup)
```

### 2. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Backend Docs**: http://localhost:5000/docs (Swagger UI)

### 3. Make Changes

#### Backend Changes

```python
# backend/app/routes/chat.py
@router.post("/api/chat")
async def chat(req: ChatRequest):
    # Your changes here
    pass

# Hot reload is automatic with --reload flag
```

#### Frontend Changes

```jsx
// frontend/src/App.jsx
export default function App() {
  // Your changes here
  // Hot Module Replacement (HMR) updates automatically
}
```

### 4. Test Changes

```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests (when test setup is complete)
cd frontend
npm run test
```

## Running Locally

### Quick Start (One Command)

```bash
# From root directory
npm run dev
```

### Manual Start

**Backend**:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

**Frontend**:
```bash
cd frontend
npm run dev
```

### Verify Services

```bash
# Check backend
curl http://localhost:5000/

# Check API documentation
open http://localhost:5000/docs

# Check frontend
curl http://localhost:5173/
```

## API Integration

### Backend API Structure

```python
# FastAPI routes are prefixed with /api
# Main router in: backend/app/main.py

# Example endpoints:
POST /api/chat          # Send message to AI
GET  /api/chat/history  # Get conversation history
```

### Frontend API Client

```javascript
// frontend/src/services/api.js
import { chatWithAI } from './services/api';

// Usage
const response = await chatWithAI('Help me create an incident');
console.log(response.data);
```

### Making API Calls

```javascript
// Example: Chat with AI
async function chat() {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/chat',
      { message: 'Hello' }
    );
    console.log(response.data);
  } catch (error) {
    console.error('API Error:', error);
  }
}
```

## Key Components

### LLM Configuration (backend/app/ai/llm.py)

```python
from langchain_openai import AzureChatOpenAI

llm = AzureChatOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-02-15-preview",
    model="gpt-4"
)

# Usage
response = llm.invoke("Your message here")
```

### Intent Detection (backend/app/ai/intents.py)

```python
def detect_intent(text: str):
    """
    Detects user intent from text.
    Returns: {
        "type": "incident" | "access_request" | "change_request" | "general",
        "severity"?: "high" | "medium" | "low",
        "application"?: str,
        "urgency"?: str
    }
    """
```

### Chat Endpoint (backend/app/routes/chat.py)

```python
@router.post("/api/chat")
async def chat(req: ChatRequest):
    """
    Main chat endpoint.
    Request: { "message": "user input" }
    Response: {
        "type": "incident" | "access_request" | "general",
        "response": "AI response",
        ...
    }
    """
```

## Debugging

### Backend Debugging

```python
# Add print statements
print("Debug message:", variable)

# Using logging
import logging
logger = logging.getLogger(__name__)
logger.debug("Debug message")

# Interactive debugger
import pdb; pdb.set_trace()
```

### Frontend Debugging

```javascript
// Browser DevTools
console.log('Debug:', data);
console.error('Error:', error);
debugger;  // Pause execution

// React DevTools (Chrome Extension)
// Requires React Developer Tools extension
```

### View Logs

```bash
# Backend logs appear in terminal with --reload

# Frontend logs appear in browser console
# Open: DevTools > Console (F12)
```

### API Testing

```bash
# Test backend endpoints
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'

# View API documentation
open http://localhost:5000/docs
```

## Testing

### Backend Unit Tests

```bash
cd backend

# Run all tests
pytest

# Run specific test
pytest tests/test_intents.py

# Run with coverage
pytest --cov=app tests/

# Run in watch mode
pytest-watch
```

### Frontend Tests (Setup Required)

```bash
cd frontend

# Run tests (when configured)
npm run test

# Run with coverage
npm run test:coverage
```

### Manual Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Chat API responds
- [ ] Intent detection works correctly
- [ ] Azure OpenAI integration works
- [ ] Database connects properly
- [ ] No CORS errors
- [ ] API documentation is accessible

## Development Best Practices

### Code Style

**Python**:
- Follow PEP 8
- Use type hints
- Use descriptive variable names
- Add docstrings to functions

```python
def detect_intent(text: str) -> Dict[str, Any]:
    """
    Detect user intent from input text.
    
    Args:
        text: User input text
        
    Returns:
        Dictionary with intent type and metadata
    """
    # Implementation
```

**JavaScript**:
- Use ES6+ features
- Use meaningful variable names
- Add JSDoc comments
- Use async/await over promises

```javascript
/**
 * Send chat message to backend
 * @param {string} message - User message
 * @returns {Promise} API response
 */
async function sendMessage(message) {
  // Implementation
}
```

### Commit Messages

```
feat: Add new intent detection for change requests
fix: Correct LLM response formatting issue
docs: Update API documentation
style: Format code to PEP 8 standards
refactor: Simplify chat routing logic
test: Add unit tests for intent detection
```

### Environment Management

- **Never commit `.env`** - Use `.env.example` as template
- **Use separate configs** for dev/prod
- **Rotate credentials regularly**
- **Log sensitive data only in debug mode**

## Common Tasks

### Add New API Endpoint

```python
# backend/app/routes/chat.py

@router.post("/api/new-endpoint")
async def new_endpoint(req: NewRequest):
    """Endpoint description"""
    try:
        # Implementation
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}
```

### Add New Intent Type

```python
# backend/app/ai/intents.py

def detect_intent(text: str):
    # Add new intent detection
    if "new_keyword" in text:
        return {
            "type": "new_intent",
            "metadata": value
        }
```

### Update Frontend UI

```jsx
// frontend/src/components/Chat.jsx

export function Chat() {
  // Update component
  return (
    <div className="chat">
      {/* JSX here */}
    </div>
  );
}
```

## Performance Optimization

### Backend

- Cache frequently accessed data
- Use connection pooling for database
- Implement request rate limiting
- Use async operations

### Frontend

- Lazy load components
- Optimize images
- Minimize bundle size
- Use React.memo for optimization

## Troubleshooting Development Issues

**Error**: `ModuleNotFoundError: No module named 'xxx'`
```bash
# Reinstall dependencies
cd backend
pip install -r requirements.txt
```

**Error**: `Port already in use`
```bash
# Change port
uvicorn app.main:app --port 5001
```

**Error**: `CORS error in browser`
- Check backend CORS configuration
- Verify API URL in frontend .env.local

**Error**: `Azure OpenAI authentication fails`
- Verify credentials in .env
- Check API version format
- Ensure deployment exists in Azure Portal

## Next Steps

1. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoint details
2. Read [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
3. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for troubleshooting

---

**Last Updated**: May 2026  
**Maintainer**: ServiceNow AI Platform Team
