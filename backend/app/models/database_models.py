from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from ..database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    provider = Column(String)  # "github" or "google"
    provider_id = Column(String, index=True)
    api_key = Column(String, unique=True, index=True, default=generate_uuid)
    created_at = Column(DateTime, default=datetime.utcnow)

    tasks = relationship("Task", back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True) # UUID from conversion service
    user_id = Column(String, ForeignKey("users.id"))
    file_id = Column(String)
    status = Column(String, default="pending")
    precision = Column(String, default="fp32")
    error = Column(String, nullable=True)
    outputs = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="tasks")
