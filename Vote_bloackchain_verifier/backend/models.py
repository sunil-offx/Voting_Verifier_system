from sqlalchemy import Boolean, Column, Integer, String
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    has_voted = Column(Boolean, default=False)
    voter_id_hash = Column(String, unique=True, index=True) # Used on blockchain
