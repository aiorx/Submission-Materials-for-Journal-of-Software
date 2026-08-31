from pydantic import BaseModel

class QueryRequest(BaseModel):
    model: str
    prompt: str
    chat_id: str

class CreateChatRequest(BaseModel):
    title: str

# Supported via standard GitHub programming aids
