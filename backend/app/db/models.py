from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Text

Base = declarative_base()

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True)
    user_message = Column(Text)
    ai_response = Column(Text)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True)
    summary = Column(Text)
    severity = Column(String(50))
    status = Column(String(50), default="open")


class AccessRequest(Base):
    __tablename__ = "access_requests"

    id = Column(Integer, primary_key=True)
    application = Column(String(200))
    urgency = Column(String(50))
    status = Column(String(50), default="submitted")


class ChangeRequest(Base):
    __tablename__ = "change_requests"

    id = Column(Integer, primary_key=True)
    description = Column(Text)
    status = Column(String(50), default="requested")