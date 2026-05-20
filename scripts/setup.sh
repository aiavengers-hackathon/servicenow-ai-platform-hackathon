#!/bin/bash

################################################################################
# ServiceNow AI Platform - Complete Setup Script
# 
# This script sets up the entire ServiceNow AI Platform for local development
# including backend (Python/FastAPI) and frontend (React/Vite)
#
# Usage: bash scripts/setup.sh
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_step() {
    echo -e "${BLUE}→ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed"
        echo "Please install Python 3.11 or higher"
        exit 1
    fi
    local python_version=$(python3 --version | cut -d' ' -f2)
    print_success "Python $python_version found"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        echo "Please install Node.js 18 or higher"
        exit 1
    fi
    local node_version=$(node --version)
    print_success "Node.js $node_version found"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    local npm_version=$(npm --version)
    print_success "npm $npm_version found"
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    print_success "Git found"
}

# Setup backend
setup_backend() {
    print_header "Setting Up Backend (Python/FastAPI)"
    
    cd backend
    
    print_step "Creating Python virtual environment..."
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_success "Virtual environment created"
    else
        print_warning "Virtual environment already exists"
    fi
    
    print_step "Activating virtual environment..."
    source venv/bin/activate
    
    print_step "Upgrading pip..."
    pip install --upgrade pip
    
    print_step "Installing Python dependencies..."
    pip install -r requirements.txt
    print_success "Backend dependencies installed"
    
    print_step "Creating .env file..."
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_success ".env file created from template"
        print_warning "Please edit .env with your Azure OpenAI credentials"
    else
        print_warning ".env file already exists"
    fi
    
    print_step "Checking database setup..."
    # Note: Database setup will be handled when running the app
    print_success "Backend setup complete"
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_header "Setting Up Frontend (React/Vite)"
    
    cd frontend
    
    print_step "Creating .env file..."
    if [ ! -f ".env.local" ]; then
        cat > .env.local << 'EOF'
# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
EOF
        print_success ".env.local file created"
    else
        print_warning ".env.local file already exists"
    fi
    
    print_step "Installing Node dependencies..."
    npm install
    print_success "Frontend dependencies installed"
    
    cd ..
}

# Setup environment
setup_environment() {
    print_header "Setting Up Environment"
    
    print_step "Checking .gitignore..."
    if [ ! -f ".gitignore" ]; then
        cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
venv/
ENV/
env/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
dist/
.DS_Store

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.project
.pydevproject

# Environment
.env
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
EOF
        print_success ".gitignore created"
    else
        print_warning ".gitignore already exists"
    fi
}

# Main setup
main() {
    clear
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║  ServiceNow AI Platform - Setup Script                 ║"
    echo "║  Powered by Azure OpenAI & LangChain                   ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_prerequisites
    setup_environment
    setup_backend
    setup_frontend
    
    print_header "Setup Complete! 🎉"
    echo -e "To get started:\n"
    echo -e "  1. ${YELLOW}Edit backend/.env${NC} with your Azure OpenAI credentials"
    echo -e "  2. Run backend:    ${GREEN}cd backend && source venv/bin/activate && uvicorn app.main:app --reload${NC}"
    echo -e "  3. Run frontend:   ${GREEN}cd frontend && npm run dev${NC}"
    echo -e "\nOr use the development script:"
    echo -e "  ${GREEN}npm run dev${NC}\n"
    echo -e "For more information, see ${YELLOW}SETUP_GUIDE.md${NC} and ${YELLOW}DEVELOPMENT.md${NC}\n"
}

# Run main
main
