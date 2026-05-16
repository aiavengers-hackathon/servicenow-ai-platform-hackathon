from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.llm import llm
from app.ai.intents import detect_intent

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/api/chat")
async def chat(req: ChatRequest):

    intent = detect_intent(req.message)

    # INCIDENT FLOW
    if intent["type"] == "incident":

        return {
            "type": "incident",
            "severity": intent["severity"],
            "response": "Incident ticket created successfully."
        }

    # ACCESS FLOW
    if intent["type"] == "access_request":

        return {
            "type": "access_request",
            "application": intent["application"],
            "urgency": intent["urgency"],
            "response": f"Access request submitted for {intent['application']}."
        }

    # CHANGE FLOW
    if intent["type"] == "change_request":

        return {
            "type": "change_request",
            "response": "Change request created."
        }

    # GENERAL AI CHAT
    response = llm.invoke(req.message)

    return {
        "type": "general",
        "response": response
    }