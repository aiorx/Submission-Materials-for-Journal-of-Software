import requests
import httpx
from typing import List, Dict

class OllamaService:
    def __init__(self, base_url = "http://localhost:11434"):
        self._base_url = base_url

    async def list_models(self) :
        """Fetch all available models from Ollama"""
        try:
            response = requests.get("{}/api/tags".format(self._base_url))
            if response.status_code == 200:
                return response.json().get('models', [])
            return []
        except Exception as e:
            print("Error fetching models: {}".format(e))
            return []

    async def generate_response(self, model, prompt) :
        """Generate response from the selected model"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "{}/api/generate".format(self._base_url),
                json={"model": model, "prompt": prompt}
            )
            if response.status_code == 200:
                return response.json()["response"]
            raise Exception("Failed to generate response: {}".format(response.text))

# Supported via standard GitHub programming aids
