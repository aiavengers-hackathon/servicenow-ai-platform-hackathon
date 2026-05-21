---
marp: true
theme: default
paginate: true
class: lead
---

# ServiceNow AI Platform
### Demo Presentation

- GenAI Hackathon
- Date: May 2026

---

## Agenda

1. Problem & Goals
2. Architecture Overview
3. Live Demo: Chat -> Create Ticket
4. Admin UI: Manage Tickets
5. Tech Stack & Deployment
6. Next Steps & Roadmap
7. Q&A

---

## 1 — Problem & Goals

- IT teams spend time triaging tickets and access requests.
- Users need a conversational interface to request help.

Goals:
- Allow natural language requests (incidents, access, change)
- Automate ticket creation and basic triage
- Provide admin UI for operations team

---

## 2 — Architecture Overview

- React frontend (Vite)
- FastAPI backend
- Azure OpenAI via LangChain
- PostgreSQL (prod) / SQLite (dev fallback)
- Chroma vector DB for RAG
- Docker Compose for local/production parity

[Diagram Placeholder]

---

## 3 — Live Demo: Chat

Scenario 1: "My VPN is down"
- Detects `incident` intent
- Creates incident record in DB
- Returns confirmation: "Incident #<id> created..."

Scenario 2: "I need access to CONCUR"
- Detects `access_request` intent
- Creates access request record
- Returns confirmation: "Access request #<id> submitted..."

---

## 4 — Admin UI

- List incidents, access requests, change requests
- Update status (Resolve / Close / Approve / Deny / Schedule / Complete)
- Chat history viewer for audit

Screenshots: `frontend/src/pages/*` and `frontend/src/components/*`

---

## 5 — Tech Stack & Deployment

- Backend: Python, FastAPI, Uvicorn/Gunicorn, SQLAlchemy
- Frontend: React, Vite, Axios
- AI: Azure OpenAI + LangChain
- Dev/Prod: Docker Compose, Nginx, Gunicorn

Deployment options:
- Local dev: `scripts/run_local.sh dev`
- Docker: `scripts/run_docker.sh`

---

## 6 — Next Steps & Roadmap

- Add authentication and RBAC for Admin UI
- Add Alembic migrations and production DB management
- Add unit & integration tests, CI pipeline
- Add metrics/observability (Prometheus/Grafana)
- Improve NLU with better entity extraction and RAG tuning

---

## 7 — Q&A

- Try it: run local demo and create tickets.
- Repo: (point to repository root)

---

---

<!-- Speaker Notes: Use this slide deck to demo the following sequence locally: 1) Start backend `bash scripts/run_local.sh dev` 2) Start frontend (script starts it) 3) Open AI Assistant, send "My VPN is down" and show Admin -> Incidents to confirm record 4) Update status and show persistence in DB (dev.db) -->
