```python
    def _check_ai_markers(self, code: str) -> List[Dict]:
        """Check for explicit AI-generated markers"""
        issues = []
        lines = code.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            for pattern in self.ai_patterns['ai_generated_markers']:
                if re.search(pattern, line, re.IGNORECASE):
                    issues.append({
                        "type": "ai_marker",
                        "message": f"AI-generated code marker detected: '{line.strip()}'",
                        "line": line_num,
                        "severity": "high",
                        "category": "ai_generated",
                        "suggestion": "Remove AI generation markers and review code quality",
                        "fix": ""  # Remove the line
                    })
                    break
        
        return issues
```