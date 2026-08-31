```python
def chat_completion(
    model: str,
    messages: list[dict],
    temperature: float = 0.0,  # llm as a judge default
    max_tokens: int | None = None,
    retries: int = 3,
    backoff: float = 1.0,
) -> str:
    """
    Simple wrapper around _client.chat.completions.create() with retry.
    messages should be a list of {"role": ..., "content": ...}.
    Code Written with routine coding tools-o4-mini-high.
    """
    # TODO: move client to a global variable nicely
    if model in OPENAI_MODEL_LIST:
        _client = OpenAI()
    elif model in GEMINI_MODEL_LIST:
        _client = OpenAI(
            api_key=os.environ["GEMINI_API_KEY"], base_url="https://generativelanguage.googleapis.com/v1beta/openai"
        )
    elif model in ANTHROPIC_MODEL_LIST:
        _client = anthropic.Anthropic()

    for attempt in range(1, retries + 1):
        try:
            # 2. for any "o1-" models strip off the system prompt if present
            # (above added by ChatGPT, not tested/sure if needed)
            to_send = messages
            if model.startswith("o1-") and len(messages) > 1:
                to_send = messages[1:]

            params = {
                "model": model,
                "messages": to_send,
                "temperature": temperature,
            }
            if max_tokens is not None:
                params["max_tokens"] = max_tokens

            if model in ANTHROPIC_MODEL_LIST:
                # Anthropic API
                resp = _client.messages.create(**params)
                response = resp.content[0].text
            elif model in OPENAI_MODEL_LIST or model in GEMINI_MODEL_LIST:
                # OpenAI API
                resp = _client.chat.completions.create(**params)
                response = resp.choices[0].message.content
            else:
                print("INVALID MODEL")
            return response

        except Exception as e:
            # simple exponential backoff
            wait = backoff * (2 ** (attempt - 1))
            print(f"[Attempt {attempt}/{retries}] {type(e).__name__}: {e}. retrying in {wait}s…")
            time.sleep(wait)

    raise RuntimeError(f"chat_completion failed after {retries} attempts")
```