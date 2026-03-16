from sqlalchemy import create_engine, Column, Integer, String, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Separate Database for Biometric Vectors
BIOMETRIC_DATABASE_URL = "sqlite:///./biometric_vectors.db"

biometric_engine = create_engine(
    BIOMETRIC_DATABASE_URL, connect_args={"check_same_thread": False}
)
BiometricSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=biometric_engine)

BiometricBase = declarative_base()

class VoterBiometricVector(BiometricBase):
    __tablename__ = "biometric_vectors"

    id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(String, index=True) # Removed unique=True to allow multiple fingers
    finger_label = Column(String) # e.g., "Finger 1", "Finger 2"
    vector_data = Column(JSON)
    status = Column(String, default="active")

# Create the tables
BiometricBase.metadata.create_all(bind=biometric_engine)

def get_biometric_db():
    db = BiometricSessionLocal()
    try:
        yield db
    finally:
        db.close()
