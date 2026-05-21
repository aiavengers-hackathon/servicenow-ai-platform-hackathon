from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.llm import llm
from app.services.ai_services import generate_response
from app.ai.intents import detect_intent
from app.db.database import SessionLocal
from app.db.models import Incident, AccessRequest, ChangeRequest, ChatHistory

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/api/chat")
async def chat(req: ChatRequest):

    intent = detect_intent(req.message)

    # INCIDENT FLOW
    if intent["type"] == "incident":
        session = SessionLocal()
        try:
            incident = Incident(
                summary=req.message,
                severity=intent.get("severity", "medium"),
                status="open",
            )
            session.add(incident)
            session.commit()
            session.refresh(incident)
            response_text = f"Incident #{incident.id} created with severity {incident.severity}."
        finally:
            session.close()

        return {
            "type": "incident",
            "severity": intent["severity"],
            "response": response_text
        }

    # ACCESS FLOW
    if intent["type"] == "access_request":
        session = SessionLocal()
        try:
            ar = AccessRequest(
                application=intent.get("application", "Unknown"),
                urgency=intent.get("urgency", "medium"),
                status="submitted",
            )
            session.add(ar)
            session.commit()
            session.refresh(ar)
            response_text = f"Access request #{ar.id} submitted for {ar.application}."
        finally:
            session.close()

        return {
            "type": "access_request",
            "application": intent["application"],
            "urgency": intent["urgency"],
            "response": response_text
        }

    # CHANGE FLOW
    if intent["type"] == "change_request":
        session = SessionLocal()
        try:
            cr = ChangeRequest(
                description=req.message,
                status="requested",
            )
            session.add(cr)
            session.commit()
            session.refresh(cr)
            response_text = f"Change request #{cr.id} created."
        finally:
            session.close()

        return {
            "type": "change_request",
            "response": response_text
        }

    # GENERAL AI CHAT
    # Use the service wrapper which returns a plain string
    # GENERAL AI CHAT
    response_text = generate_response(req.message)

    # persist chat
    try:
        session = SessionLocal()
        chat = ChatHistory(user_message=req.message, ai_response=response_text)
        session.add(chat)
        session.commit()
    finally:
        session.close()

    return {
        "type": "general",
        "response": response_text
    }