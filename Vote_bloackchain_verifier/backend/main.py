from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import hashlib

from backend import models, schemas, auth, database, blockchain_utils
from backend.database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Voting App Backend API", description="Backend for Blockchain Voting Hackathon Project")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://.*$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    db = database.SessionLocal()
    admin_user = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin_user:
        hashed_password = auth.get_password_hash("admin123")
        voter_id_hash = hashlib.sha256(b"admin").hexdigest()
        new_admin = models.User(
            username="admin", 
            hashed_password=hashed_password,
            voter_id_hash=voter_id_hash
        )
        db.add(new_admin)
        db.commit()
    db.close()

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/candidates")
def get_candidates():
    try:
        candidates = blockchain_utils.get_all_candidates()
        result = []
        for c in candidates:
            result.append({
                "id": c[0],
                "name": c[1],
                "voteCount": c[2]
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/vote")
def cast_vote(vote_req: schemas.VoteRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    if current_user.has_voted:
        raise HTTPException(status_code=400, detail="User has already voted")
    
    try:
        # Cast vote on the blockchain
        receipt = blockchain_utils.cast_vote(current_user.voter_id_hash, vote_req.candidate_id)
        
        # Update user in DB
        current_user.has_voted = True
        db.commit()
        
        return {"status": "success", "tx_receipt": receipt.transactionHash.hex(), "message": "Vote successfully cast on blockchain"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
