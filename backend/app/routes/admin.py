from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.db.database import SessionLocal
from app.db.models import Incident, AccessRequest, ChangeRequest, ChatHistory

router = APIRouter()


@router.get('/api/incidents')
def list_incidents():
    session = SessionLocal()
    try:
        items = session.query(Incident).order_by(Incident.id.desc()).all()
        return [
            {
                'id': i.id,
                'description': i.summary,
                'status': i.status,
                'priority': i.severity
            }
            for i in items
        ]
    finally:
        session.close()


class StatusUpdate(BaseModel):
    status: str


@router.patch('/api/incidents/{incident_id}')
def update_incident(incident_id: int, body: StatusUpdate):
    session = SessionLocal()
    try:
        inc = session.query(Incident).get(incident_id)
        if not inc:
            raise HTTPException(status_code=404, detail='Incident not found')
        inc.status = body.status
        session.add(inc)
        session.commit()
        return {'success': True}
    finally:
        session.close()


@router.get('/api/access-requests')
def list_access_requests():
    session = SessionLocal()
    try:
        items = session.query(AccessRequest).order_by(AccessRequest.id.desc()).all()
        return [
            {
                'id': r.id,
                'user': getattr(r, 'user', 'anonymous'),
                'application': r.application,
                'status': r.status,
                'urgency': r.urgency
            }
            for r in items
        ]
    finally:
        session.close()


@router.patch('/api/access-requests/{req_id}')
def update_access_request(req_id: int, body: StatusUpdate):
    session = SessionLocal()
    try:
        r = session.query(AccessRequest).get(req_id)
        if not r:
            raise HTTPException(status_code=404, detail='Access request not found')
        r.status = body.status
        session.add(r)
        session.commit()
        return {'success': True}
    finally:
        session.close()


@router.get('/api/change-requests')
def list_change_requests():
    session = SessionLocal()
    try:
        items = session.query(ChangeRequest).order_by(ChangeRequest.id.desc()).all()
        return [
            {
                'id': c.id,
                'title': c.description,
                'status': c.status
            }
            for c in items
        ]
    finally:
        session.close()


@router.patch('/api/change-requests/{cr_id}')
def update_change_request(cr_id: int, body: StatusUpdate):
    session = SessionLocal()
    try:
        c = session.query(ChangeRequest).get(cr_id)
        if not c:
            raise HTTPException(status_code=404, detail='Change request not found')
        c.status = body.status
        session.add(c)
        session.commit()
        return {'success': True}
    finally:
        session.close()


@router.get('/api/chat-history')
def list_chats():
    session = SessionLocal()
    try:
        items = session.query(ChatHistory).order_by(ChatHistory.id.desc()).limit(200).all()
        return [
            {'id': m.id, 'user_message': m.user_message, 'ai_response': m.ai_response}
            for m in items
        ]
    finally:
        session.close()
