```python
def generate_code_example(data):
    """Generate a code example using AI based on accumulated data and user request."""
    
    user_message = data.get("user_message", "")
    current_code = data.get("code", "")
    analysis = data.get("analysis", "")
    search_results = data.get("search_results", "")
    
    # Build context for AI
    context_parts = []
    
    if current_code and not current_code.startswith("Error:"):
        context_parts.append(f"Current game code:\n```javascript\n{current_code}\n```")
    
    if analysis:
        context_parts.append(f"Code analysis results:\n{analysis}")
    
    if search_results:
        context_parts.append(f"Documentation findings:\n{search_results}")
    
    context_str = "\n\n".join(context_parts) if context_parts else "No current code context available."
    
    prompt = f"""You are a Phaser.js expert. Generate a specific, working code example for the user's request.

User Request: {user_message}

Context:
{context_str}

Requirements:
1. Provide ONLY working JavaScript/Phaser.js code
2. Include clear comments explaining each part
3. Make the code integrate well with existing code structure
4. Use Phaser.js best practices
5. Make it copy-paste ready
6. If modifying existing code, show the specific changes needed

Generate a practical code example that directly addresses the user's request:"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        instructions=prompt,
        input=user_message
    )

    return f"Basic development code blocks example:\n\n{response.output_text}"
```