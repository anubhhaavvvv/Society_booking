# app/core/llm.py

import requests

OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "mistral"


class LLMClient:
    def __init__(
        self,
        base_url: str = OLLAMA_BASE_URL,
        model: str = OLLAMA_MODEL,
        timeout: int = 60,
    ):
        self.base_url = base_url
        self.model = model
        self.timeout = timeout

    def generate(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }

        response = requests.post(
            f"{self.base_url}/api/generate",
            json=payload,
            timeout=self.timeout,
        )

        response.raise_for_status()
        data = response.json()

        return data.get("response", "").strip()


# Singleton instance (used across the app)
llm_client = LLMClient()
