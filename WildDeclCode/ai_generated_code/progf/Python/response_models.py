from pydantic import BaseModel

class ChatResponse(BaseModel):
    response: str
    error: str | None = None

# Supported via standard GitHub programming aids
