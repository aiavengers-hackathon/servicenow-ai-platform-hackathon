# Quick Start - ServiceNow AI Platform ⚡

**Get up and running in 5 minutes!**

## 📋 Prerequisites Check

```bash
python3 --version  # Should be 3.11+
node --version     # Should be 18+
npm --version      # Should be 8+
```

## 🚀 5-Minute Setup

### Step 1: Clone & Navigate
```bash
cd servicenow-ai-platform-hackathon
```

### Step 2: Run Setup Script
```bash
chmod +x scripts/*.sh
bash scripts/setup.sh
```

### Step 3: Configure Azure OpenAI
```bash
bash scripts/setup-local.sh
```

You'll be prompted to enter:
- Azure OpenAI Endpoint
- API Key
- API Version
- Deployment Name

### Step 4: Start Backend
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Expected Output**:
```
INFO:     Started server process [12345]
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:5000
```

### Step 5: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

**Expected Output**:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## ✅ Verify Everything Works

```bash
# Test backend
curl http://localhost:5000/

# View API docs
open http://localhost:5000/docs

# Access frontend
open http://localhost:5173
```

## 🆘 Common Issues

### Python/Node Not Found
```bash
# Install Python 3.11+
# https://www.python.org/downloads/

# Install Node 18+
# https://nodejs.org/
```

### Port Already in Use
```bash
# Backend on different port
uvicorn app.main:app --port 5001

# Frontend on different port
cd frontend && npm run dev -- --port 5174
```

### Azure OpenAI Error
1. Go to https://portal.azure.com
2. Copy exact credentials
3. Re-run: `bash scripts/setup-local.sh`

## 📚 Documentation

| Document | For |
|----------|-----|
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Detailed setup & troubleshooting |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Development workflow & architecture |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | API endpoints & examples |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contributing guidelines |

## 💬 First Test

Try these commands after both servers are running:

### Test 1: Chat
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, how are you?"}'
```

### Test 2: Incident Detection
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"The VPN is not working"}'
```

### Test 3: Access Request
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"I need access to BAAMR"}'
```

## 🎯 What's Next?

1. **Explore the code**: Check [DEVELOPMENT.md](./DEVELOPMENT.md)
2. **Learn the API**: Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. **Start contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)
4. **Customize**: Modify components in `frontend/src/` or `backend/app/`

## 📦 Project Structure

```
├── backend/          # Python FastAPI app
├── frontend/         # React Vite app
├── scripts/          # Automation scripts
├── SETUP_GUIDE.md    # Detailed setup
├── DEVELOPMENT.md    # Dev guide
├── API_DOCUMENTATION.md  # API reference
└── CONTRIBUTING.md   # Contributing guide
```

## 🔐 Environment Security

✅ **DO**:
- Use `.env.example` as template
- Update `.env` with YOUR credentials
- Keep `.env` in `.gitignore`

❌ **DON'T**:
- Commit `.env` file
- Share API keys in code
- Expose credentials in logs

## 🆘 Need Help?

| Issue | Solution |
|-------|----------|
| Setup fails | Run: `bash scripts/clean.sh` then try setup again |
| API not responding | Check both servers are running |
| Azure error | Verify credentials at https://portal.azure.com |
| Still stuck? | See [SETUP_GUIDE.md - Troubleshooting](./SETUP_GUIDE.md#troubleshooting) |

## 🚀 Commands Reference

```bash
# Development
npm run dev                    # Run both frontend & backend
npm run dev:backend          # Run backend only
npm run dev:frontend         # Run frontend only

# Setup
bash scripts/setup.sh        # Complete setup
bash scripts/setup-local.sh  # Interactive setup
bash scripts/clean.sh        # Clean and reset

# Testing
cd backend && pytest         # Run backend tests
cd frontend && npm test      # Run frontend tests

# Building
npm run build                # Build for production
```

## ✨ Features to Try

- 💬 **Chat**: Natural conversation with AI
- 🎯 **Intent Detection**: Auto-detect incident/access/change requests
- 🔍 **Search**: Query the knowledge base
- 📝 **Memory**: Conversations remember context

## 📞 Support

- 📖 Full docs in repo
- 🐛 Report issues on GitHub
- 💡 Discuss ideas on GitHub Discussions

---

**All set!** Start building with ServiceNow AI Platform! 🚀

For detailed guidance, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
