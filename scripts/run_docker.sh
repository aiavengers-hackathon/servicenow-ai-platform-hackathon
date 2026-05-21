#!/usr/bin/env bash
set -euo pipefail

# Build and run via docker-compose in detached mode
ROOT_DIR="$(dirname "$(dirname "$0")")"
cd "$ROOT_DIR"

# Use .env if present
if [ -f backend/.env ]; then
  echo "Using backend/.env for environment variables"
fi

echo "Building and starting containers (detached)"
docker-compose up --build -d

echo "Containers started. To view logs: docker-compose logs -f" 
