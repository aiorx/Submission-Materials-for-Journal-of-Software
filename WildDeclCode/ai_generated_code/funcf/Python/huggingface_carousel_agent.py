```python
if extracted_code:
    # Save the generated fix
    fix_file = self.workspace / "ai_generated_navigation_fix.py"
    fix_file.write_text(extracted_code)
    print(f"✅ AI-generated navigation fix saved: {fix_file}")
```