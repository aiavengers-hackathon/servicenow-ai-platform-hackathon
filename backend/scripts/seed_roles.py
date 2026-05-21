"""Seed default roles and an admin user for development."""
import os
from getpass import getpass

from app.db.database import SessionLocal, engine
from app.db import models
from app.auth import get_password_hash


def seed(admin_username: str, admin_password: str, admin_email: str = None):
    session = SessionLocal()
    try:
        # create tables if missing
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
            print(f"Admin user {admin_username} already exists (id={admin.id})")
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
        print(f"Created admin user {admin_username}")
    finally:
        session.close()


if __name__ == "__main__":
    username = os.getenv("DEV_ADMIN_USER") or input("Admin username [admin]: ") or "admin"
    pwd = os.getenv("DEV_ADMIN_PASSWORD")
    if not pwd:
        pwd = getpass("Admin password (hidden): ") or "changeme"
    email = os.getenv("DEV_ADMIN_EMAIL")
    seed(username, pwd, email)
