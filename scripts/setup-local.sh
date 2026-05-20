#!/bin/bash

################################################################################
# ServiceNow AI Platform - Local Development Setup
#
# This script provides an interactive setup for local development
# Guides you through configuration of Azure OpenAI credentials
#
# Usage: bash scripts/setup-local.sh
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    clear
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Main interactive setup
main() {
    print_header "ServiceNow AI Platform - Local Development Setup"
    
    echo -e "This script will help you configure the application for local development.\n"
    
    # Check if backend/.env exists
    if [ -f "backend/.env" ]; then
        print_info "backend/.env already exists"
        read -p "Do you want to reconfigure it? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_success "Keeping existing .env configuration"
            echo ""
            return
        fi
    fi
    
    # Azure OpenAI Configuration
    echo -e "${YELLOW}Azure OpenAI Configuration${NC}"
    echo -e "Get these values from: https://portal.azure.com\n"
    
    read -p "Enter Azure OpenAI Endpoint (e.g., https://your-resource.openai.azure.com/): " ENDPOINT
    read -p "Enter Azure OpenAI API Key: " -s API_KEY
    echo
    read -p "Enter API Version (default: 2024-02-15-preview): " API_VERSION
    API_VERSION=${API_VERSION:-"2024-02-15-preview"}
    read -p "Enter Deployment Name (default: gpt-4): " DEPLOYMENT_NAME
    DEPLOYMENT_NAME=${DEPLOYMENT_NAME:-"gpt-4"}
    
    # Create .env file
    cat > backend/.env << EOF
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=$ENDPOINT
AZURE_OPENAI_API_KEY=$API_KEY
AZURE_OPENAI_API_VERSION=$API_VERSION
AZURE_OPENAI_DEPLOYMENT_NAME=$DEPLOYMENT_NAME

# Application Environment
APP_ENV=development
LOG_LEVEL=INFO

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/servicenow
EOF
    
    print_success "Configuration saved to backend/.env"
    
    echo -e "\n${GREEN}Setup complete!${NC}"
    echo -e "You can now run the application locally.\n"
}

main
