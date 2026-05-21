#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/run_local.sh [dev|prod]
MODE=${1:-dev}
ROOT_DIR="$(dirname "$(dirname "$0")")"
cd "$ROOT_DIR"

echo "Running in $MODE mode"

# Backend setup
cd backend
VENV_DIR=".venv"
if [ ! -d "$VENV_DIR" ]; then
  python -m venv "$VENV_DIR"
fi

# Determine python and pip inside venv (support POSIX and Windows paths)
if [ -x "$VENV_DIR/bin/python" ]; then
  PY="$VENV_DIR/bin/python"
  PIP="$VENV_DIR/bin/pip"
elif [ -x "$VENV_DIR/Scripts/python.exe" ]; then
  PY="$VENV_DIR/Scripts/python.exe"
  PIP="$VENV_DIR/Scripts/pip.exe"
else
  echo "Cannot find python in venv; aborting"
  exit 1
fi

"$PY" -m pip install --upgrade pip
"$PY" -m pip install -r requirements.txt

if [ "$MODE" = "dev" ]; then
  echo "Starting backend (uvicorn reload) on 0.0.0.0:8000"
  "$PY" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
else
  echo "Starting backend (gunicorn with uvicorn workers) on 0.0.0.0:8000"
  if [ -x "$VENV_DIR/bin/gunicorn" ]; then
    "$VENV_DIR/bin/gunicorn" -k uvicorn.workers.UvicornWorker -w 4 app.main:app -b 0.0.0.0:8000 &
  elif [ -x "$VENV_DIR/Scripts/gunicorn.exe" ]; then
    "$VENV_DIR/Scripts/gunicorn.exe" -k uvicorn.workers.UvicornWorker -w 4 app.main:app -b 0.0.0.0:8000 &
  else
    echo "gunicorn not found in venv, falling back to uvicorn"
    "$PY" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
  fi
fi

BACKEND_PID=$!

# Frontend setup
cd ../frontend
npm install
if [ "$MODE" = "dev" ]; then
  echo "Starting frontend dev server"
  npm run dev
else
  echo "Building frontend and serving statically"
  npm run build
  # serve built files on port 80 using a simple Python http.server on port 3000
  (cd dist && python -m http.server 3000) &
  FRONTEND_PID=$!
  echo "Frontend static files served on http://localhost:3000"
fi

# Wait for foreground process if dev
if [ "$MODE" = "dev" ]; then
  wait
else
  echo "Backend PID: $BACKEND_PID"
  echo "Frontend (static) PID: ${FRONTEND_PID:-none}"
  echo "Run 'kill $BACKEND_PID && [kill $FRONTEND_PID]' to stop"
fi
