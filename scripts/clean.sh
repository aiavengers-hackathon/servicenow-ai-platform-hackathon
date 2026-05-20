#!/bin/bash

################################################################################
# ServiceNow AI Platform - Cleanup Script
#
# Removes all generated files and caches for a fresh start
#
# Usage: bash scripts/clean.sh
################################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

main() {
    print_header "ServiceNow AI Platform - Cleanup"
    
    read -p "This will remove all generated files and caches. Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cleanup cancelled"
        exit 0
    fi
    
    # Backend cleanup
    print_warning "Cleaning backend..."
    [ -d "backend/venv" ] && rm -rf backend/venv && print_success "Removed virtual environment"
    [ -d "backend/__pycache__" ] && find backend -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
    [ -d "backend/.pytest_cache" ] && rm -rf backend/.pytest_cache && print_success "Removed pytest cache"
    find backend -type d -name ".venv" -exec rm -rf {} + 2>/dev/null || true
    find backend -name "*.pyc" -delete
    print_success "Backend cleaned"
    
    # Frontend cleanup
    print_warning "Cleaning frontend..."
    [ -d "frontend/node_modules" ] && rm -rf frontend/node_modules && print_success "Removed node_modules"
    [ -d "frontend/dist" ] && rm -rf frontend/dist && print_success "Removed build directory"
    [ -f "frontend/package-lock.json" ] && rm frontend/package-lock.json && print_success "Removed package-lock.json"
    print_success "Frontend cleaned"
    
    # Root cleanup
    print_warning "Cleaning root..."
    [ -d "node_modules" ] && rm -rf node_modules && print_success "Removed root node_modules"
    [ -f "package-lock.json" ] && rm package-lock.json && print_success "Removed root package-lock.json"
    print_success "Root cleaned"
    
    print_header "Cleanup Complete!"
    echo -e "Run ${GREEN}bash scripts/setup.sh${NC} to set up again\n"
}

main
