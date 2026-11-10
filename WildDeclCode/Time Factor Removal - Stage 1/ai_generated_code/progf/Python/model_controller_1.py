import httpx
from fastapi import HTTPException
import os
from typing import List
import json
from ..models.model_schemas import ModelInfo

class ModelController:
    @staticmethod
    async def get_all_models() :
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get("{}/api/tags".format(os.getenv('OLLAMA_BASE_URL')))
                if response.status_code == 200:
                    print(response.json(), flush=True)
                    return [ModelInfo(**model) for model in response.json()['models']]
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch models")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def chat(model, prompt) :
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "model": model,
                    "prompt": prompt,
                    "stream": False  # Ensure we get a complete response
                }
                
                print("Sending request to Ollama API: {}".format(payload), flush=True)
                
                response = await client.post(
                    "{}/api/generate".format(os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')),
                    json=payload,
                    timeout=30.0  # Add timeout
                )
                
                if response.status_code == 200:
                    try:
                        response_data = response.json()
                        print("Received response from Ollama API: {}".format(response_data), flush=True)
                        return {
                            "response": response_data.get('response', ''),
                            "model": model
                        }
                    except json.JSONDecodeError as e:
                        raise HTTPException(
                            status_code=500,
                            detail="Failed to parse response: {}".format(str(e))
                        )
                else:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail="Ollama API error: {}".format(response.text)
                    )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=500,
                detail="Failed to connect to Ollama API: {}".format(str(e))
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail="Unexpected error: {}".format(str(e))
            )

# Supported via standard GitHub programming aids
