```python
def query_chatgpt(prompt, api_key):
        background_info = "" #this can be used to provide context to the chatbot
        prompt = f"{background_info}\nUser: {user_input}"
        completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt, 
                }
            ],
            model="gpt-3.5-turbo",
        )
        chatgpt_answer = completion.choices[0].message.content + " *answer Supported via standard programming aids*"
        return chatgpt_answer
```