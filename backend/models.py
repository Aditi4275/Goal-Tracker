from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from datetime import date
from base import Base

class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    created_at = Column(Date, default=date.today())

class Subtask(Base):
    __tablename__ = "subtasks"
    
    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id"))
    title = Column(String(255), nullable=False)
    completed = Column(Boolean, default=False)