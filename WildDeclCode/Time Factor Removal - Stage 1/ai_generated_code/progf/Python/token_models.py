from pydantic import BaseModel, Field
from typing import List, Optional

class TokenCountRequest(BaseModel):
    """Request model for token counting."""
    text = Field(..., description="The text to count tokens in")
    model = Field(None, description="The model to use for tokenization")
    text_id = Field(None, description="Optional client reference ID")

class TokenCountResponse(BaseModel):
    """Response model for token counting."""
    token_count = Field(..., description="Number of tokens in the text")
    model = Field(..., description="Model used for tokenization")
    processing_time_ms = Field(..., description="Processing time in milliseconds")
    text_id = Field(None, description="Client reference ID if provided")

class BatchTokenCountRequest(BaseModel):
    """Request model for batch token counting."""
    texts = Field(..., description="List of texts to count tokens for")
    model = Field(None, description="Default model to use for all texts")

class BatchTokenCountResponse(BaseModel):
    """Response model for batch token counting."""
    results = Field(..., description="Token counts for each text")

class HealthResponse(BaseModel):
    """Response model for health check."""
    status = Field("ok", description="Service status")
    version = Field("1.0.0", description="API version")

# Aided with basic GitHub coding tools
