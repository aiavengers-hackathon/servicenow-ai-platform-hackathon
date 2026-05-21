import os
from app.db.database import SessionLocal, engine
from app.db import models
from app.auth import get_password_hash


def seed_defaults(admin_username: str = "admin", admin_password: str = "changeme", admin_email: str = None):
    session = SessionLocal()
    try:
        models.Base.metadata.create_all(bind=engine)

        roles = ["admin", "manager", "user"]
        for r in roles:
            existing = session.query(models.Role).filter(models.Role.name == r).first()
            if not existing:
                role = models.Role(name=r, description=f"{r} role")
                session.add(role)
        session.commit()

        admin = session.query(models.User).filter(models.User.username == admin_username).first()
        if admin:
            return

        admin_role = session.query(models.Role).filter(models.Role.name == "admin").first()
        user = models.User(
            username=admin_username,
            email=admin_email,
            hashed_password=get_password_hash(admin_password),
            role_id=admin_role.id,
        )
        session.add(user)
        session.commit()
    finally:
        session.close()
