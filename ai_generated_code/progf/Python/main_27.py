# Assisted using common GitHub development utilities
# main.py - Entry point for FastAPI backend with corrected imports
import sys
import os

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Now import the FastAPI app from the app module
from app.API import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
