from fastapi import APIRouter, HTTPException, Depends
from app.auth import require_roles
from app.db import models
from pydantic import BaseModel
from app.auth import get_current_user_optional
from pydantic import BaseModel

from app.db.database import SessionLocal
from app.db.models import Incident, AccessRequest, ChangeRequest, ChatHistory

router = APIRouter()


@router.get('/api/incidents')
def list_incidents(current_user: models.User = Depends(require_roles("admin", "manager"))):
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


class IncidentCreate(BaseModel):
    summary: str
    description: str = ""
    severity: str = "medium"
    assignment_group: str = None
    assigned_to: str = None
    ci: str = None


@router.post('/api/incidents')
def create_incident(payload: IncidentCreate, current_user: models.User = Depends(get_current_user_optional)):
    session = SessionLocal()
    try:
        inc = models.Incident(
            summary=payload.summary,
            description=payload.description,
            severity=payload.severity,
            status='open',
            reporter_id=current_user.id if current_user else None,
        )
        session.add(inc)
        session.commit()
        session.refresh(inc)
        return {"id": inc.id, "link": f"http://localhost:5173/#/incidents?id={inc.id}"}
    finally:
        session.close()


@router.get('/api/incidents/{incident_id}')
def get_incident(incident_id: int, current_user: models.User = Depends(get_current_user_optional)):
    session = SessionLocal()
    try:
        inc = session.query(models.Incident).get(incident_id)
        if not inc:
            raise HTTPException(status_code=404, detail='Incident not found')
        return {
            'id': inc.id,
            'summary': inc.summary,
            'description': inc.description,
            'status': inc.status,
            'priority': inc.severity,
            'reporter_id': inc.reporter_id,
            'created_at': inc.created_at.isoformat() if inc.created_at else None
        }
    finally:
        session.close()


class StatusUpdate(BaseModel):
    status: str


@router.patch('/api/incidents/{incident_id}')
def update_incident(incident_id: int, body: StatusUpdate, current_user: models.User = Depends(require_roles("admin", "manager"))):
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
def list_access_requests(current_user: models.User = Depends(require_roles("admin", "manager"))):
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


class AccessRequestCreate(BaseModel):
    application: str
    details: str = ""
    urgency: str = "medium"
    assignment_group: str = None
    assigned_to: str = None


@router.post('/api/access-requests')
def create_access_request(payload: AccessRequestCreate, current_user: models.User = Depends(get_current_user_optional)):
    session = SessionLocal()
    try:
        ar = models.AccessRequest(
            application=payload.application,
            details=payload.details,
            urgency=payload.urgency,
            status='submitted',
            requester_id=current_user.id if current_user else None,
        )
        session.add(ar)
        session.commit()
        session.refresh(ar)
        return {"id": ar.id, "link": f"http://localhost:5173/#/access?id={ar.id}"}
    finally:
        session.close()


@router.get('/api/access-requests/{req_id}')
def get_access_request(req_id: int, current_user: models.User = Depends(get_current_user_optional)):
    session = SessionLocal()
    try:
        r = session.query(models.AccessRequest).get(req_id)
        if not r:
            raise HTTPException(status_code=404, detail='Access request not found')
        return {
            'id': r.id,
            'application': r.application,
            'details': r.details,
            'status': r.status,
            'urgency': r.urgency,
            'requester_id': r.requester_id,
            'created_at': r.created_at.isoformat() if r.created_at else None
        }
    finally:
        session.close()


@router.patch('/api/access-requests/{req_id}')
def update_access_request(req_id: int, body: StatusUpdate, current_user: models.User = Depends(require_roles("admin", "manager"))):
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
def list_change_requests(current_user: models.User = Depends(require_roles("admin", "manager"))):
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


class ChangeRequestCreate(BaseModel):
    title: str
    description: str = ""
    assignment_group: str = None
    assigned_to: str = None


@router.post('/api/change-requests')
def create_change_request(payload: ChangeRequestCreate, current_user: models.User = Depends(get_current_user_optional)):
    session = SessionLocal()
    try:
        c = models.ChangeRequest(
            title=payload.title,
            description=payload.description,
            status='requested',
            requester_id=current_user.id if current_user else None,
        )
        session.add(c)
        session.commit()
        session.refresh(c)
        return {"id": c.id, "link": f"http://localhost:5173/#/change?id={c.id}"}
    finally:
        session.close()


@router.get('/api/change-requests/{cr_id}')
def get_change_request(cr_id: int, current_user: models.User = Depends(get_current_user_optional)):
    session = SessionLocal()
    try:
        c = session.query(models.ChangeRequest).get(cr_id)
        if not c:
            raise HTTPException(status_code=404, detail='Change request not found')
        return {
            'id': c.id,
            'title': getattr(c, 'title', None) or getattr(c, 'description', None),
            'description': c.description,
            'status': c.status,
            'requester_id': c.requester_id,
            'created_at': c.created_at.isoformat() if c.created_at else None
        }
    finally:
        session.close()


@router.patch('/api/change-requests/{cr_id}')
def update_change_request(cr_id: int, body: StatusUpdate, current_user: models.User = Depends(require_roles("admin", "manager"))):
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
def list_chats(current_user: models.User = Depends(require_roles("admin", "manager"))):
    session = SessionLocal()
    try:
        items = session.query(ChatHistory).order_by(ChatHistory.id.desc()).limit(200).all()
        return [
            {'id': m.id, 'user_message': m.user_message, 'ai_response': m.ai_response}
            for m in items
        ]
    finally:
        session.close()
