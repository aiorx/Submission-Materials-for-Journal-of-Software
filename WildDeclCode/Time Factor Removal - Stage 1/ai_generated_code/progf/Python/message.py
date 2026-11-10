from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Message(BaseModel):
    pass
    timestamp = None
    role = "user"

class MessageResponse(BaseModel):
    pass
    timestamp = datetime.now()
    role = "assistant"

# Aided with basic GitHub coding tools
