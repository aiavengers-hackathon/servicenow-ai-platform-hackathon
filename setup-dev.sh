#!/bin/bash

# ServiceNow AI Platform - Quick Setup Script
# This script sets up the complete development environment

set -e  # Exit on error

echo "=========================================="
echo "ServiceNow AI Platform - Setup"
echo "=========================================="
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."
if ! command -v python3 &> /dev/null; then
    echo "✗ Python 3 not found. Please install Python 3.11+"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "✗ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "✗ npm not found. Please install npm 8+"
    exit 1
fi

echo "✓ All prerequisites met"
echo ""

# Backend Setup
echo "=========================================="
echo "Setting up Backend..."
echo "=========================================="

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file... (EDIT THIS WITH YOUR AZURE CREDENTIALS)"
    cp .env.example .env
fi

cd ..

echo "✓ Backend setup complete"
echo ""

# Frontend Setup
echo "=========================================="
echo "Setting up Frontend..."
echo "=========================================="

cd frontend

# Install dependencies
echo "Installing npm dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating frontend .env..."
    cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000
EOF
fi

cd ..

echo "✓ Frontend setup complete"
echo ""

# Final Instructions
echo "=========================================="
echo "✓ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Configure Azure OpenAI credentials:"
echo "   Edit: backend/.env"
echo "   Add your AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY"
echo ""
echo "2. Start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload --host 0.0.0.0 --port 5000"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open browser:"
echo "   Frontend: http://localhost:5173"
echo "   API Docs: http://localhost:5000/docs"
echo ""
echo "Default credentials (when AUTO_SEED_DEV=true):"
echo "   Username: admin"
echo "   Password: changeme"
echo ""
echo "For Docker deployment, see: PRODUCTION_READY.md"
echo ""
