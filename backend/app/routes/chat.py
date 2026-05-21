from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.ai.llm import llm
from app.services.ai_services import generate_response
from app.ai.intents import detect_intent
from app.db.database import SessionLocal
from app.db.models import Incident, AccessRequest, ChangeRequest, ChatHistory
from app.auth import get_current_user_optional
from app.db import models

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/api/chat")
async def chat(req: ChatRequest, current_user: models.User = Depends(get_current_user_optional)):

    intent = detect_intent(req.message)

    # INCIDENT FLOW
    if intent["type"] == "incident":
        # if user message is short, ask follow-up for structured details
        if len(req.message.strip()) < 20:
            return {"type": "incident_pending", "missing_fields": ["summary", "description", "assignment_group", "assigned_to", "ci"], "response": "I can create an incident for you. Please provide a short summary, full description, assignment group, assigned-to (optional), and CI (optional)."}
        session = SessionLocal()
        try:
            incident = Incident(
                summary=req.message[:255],
                description=req.message,
                severity=intent.get("severity", "medium"),
                status="open",
                reporter_id=current_user.id if current_user else None,
            )
            session.add(incident)
            session.commit()
            session.refresh(incident)
            response_text = f"Incident #{incident.id} created with severity {incident.severity}."
        finally:
            session.close()

        return {
            "type": "incident",
            "severity": intent.get("severity", "medium"),
            "response": response_text,
            "link": f"http://localhost:5173/#/incidents?id={incident.id}"
        }

    # ACCESS FLOW
    if intent["type"] == "access_request":
        application = intent.get("application")
        if not application or application == "Unknown":
            return {"type": "access_request_pending", "missing_fields": ["application", "details", "urgency"], "response": "Which application do you need access to? Please include role, justification, and urgency."}
        session = SessionLocal()
        try:
            ar = AccessRequest(
                application=application,
                urgency=intent.get("urgency", "medium"),
                status="submitted",
                requester_id=current_user.id if current_user else None,
            )
            session.add(ar)
            session.commit()
            session.refresh(ar)
            response_text = f"Access request #{ar.id} submitted for {ar.application}."
        finally:
            session.close()

        return {
            "type": "access_request",
            "application": application,
            "urgency": intent.get("urgency", "medium"),
            "response": response_text,
            "link": f"http://localhost:5173/#/access?id={ar.id}"
        }

    # CHANGE FLOW
    if intent["type"] == "change_request":
        if len(req.message.strip()) < 20:
            return {"type": "change_request_pending", "missing_fields": ["title", "description", "assignment_group", "ci"], "response": "I can create a change request. Please provide a short title and a detailed description, plus assignment group and CI if available."}
        session = SessionLocal()
        try:
            cr = ChangeRequest(
                title=(req.message[:255]),
                description=req.message,
                status="requested",
                requester_id=current_user.id if current_user else None,
            )
            session.add(cr)
            session.commit()
            session.refresh(cr)
            response_text = f"Change request #{cr.id} created."
        finally:
            session.close()

        return {
            "type": "change_request",
            "response": response_text,
            "link": f"http://localhost:5173/#/change?id={cr.id}"
        }

    # GENERAL AI CHAT
    # Use the service wrapper which returns a plain string
    # GENERAL AI CHAT
    response_text = generate_response(req.message)

    # persist chat
    try:
        session = SessionLocal()
        chat = ChatHistory(user_message=req.message, ai_response=response_text, user_id=current_user.id if current_user else None)
        session.add(chat)
        session.commit()
    finally:
        session.close()

    return {
        "type": "general",
        "response": response_text
    }