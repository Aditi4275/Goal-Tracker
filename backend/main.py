from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import date
import models
import database

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/goals/")
def create_goal(goal_data: dict, db: Session = Depends(get_db)):
    goal = models.Goal(title=goal_data["title"])
    db.add(goal)
    db.commit()
    db.refresh(goal)
    
    for subtask_title in goal_data["subtasks"]:
        subtask = models.Subtask(goal_id=goal.id, title=subtask_title)
        db.add(subtask)
    
    db.commit()
    return {"message": "Goal and subtasks created successfully", "goal_id": goal.id}

@app.get("/goals/")
def get_all_goals(db: Session = Depends(get_db)):
    goals = db.query(models.Goal).all()
    result = []
    for goal in goals:
        subtasks = db.query(models.Subtask).filter(models.Subtask.goal_id == goal.id).all()
        result.append({
            "id": goal.id,
            "title": goal.title,
            "created_at": goal.created_at,
            "subtasks": [{"id": st.id, "title": st.title, "completed": st.completed} for st in subtasks]
        })
    return result

@app.get("/goals/today/")
def get_today_goals(db: Session = Depends(get_db)):
    today = date.today()
    goals = db.query(models.Goal).filter(models.Goal.created_at == today).all()
    result = []
    for goal in goals:
        subtasks = db.query(models.Subtask).filter(models.Subtask.goal_id == goal.id).all()
        result.append({
            "id": goal.id,
            "title": goal.title,
            "subtasks": [{"id": st.id, "title": st.title, "completed": st.completed} for st in subtasks]
        })
    return result

@app.put("/subtasks/{subtask_id}/")
def update_subtask_status(subtask_id: int, status: bool, db: Session = Depends(get_db)):
    subtask = db.query(models.Subtask).filter(models.Subtask.id == subtask_id).first()
    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    
    subtask.completed = status
    db.commit()
    return {"message": "Subtask status updated successfully"}

@app.delete("/goals/{goal_id}/")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    db.query(models.Subtask).filter(models.Subtask.goal_id == goal_id).delete()
    db.delete(goal)
    db.commit()
    return {"message": "Goal and associated subtasks deleted successfully"}
