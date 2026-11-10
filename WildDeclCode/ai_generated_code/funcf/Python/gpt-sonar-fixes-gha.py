```python
            comment = f"This is an automated fix Built using outside development resources GPT-4 model\n**Fixed issues:**\n\n{fixed_issues_str}\n\n**Remaining issues:**\n\n{unfixed_issues_str}"
            pr = create_pr(SOURCE_BRANCH, new_branch.name, 'Apply automated fixes', comment)
            print(f"Created PR: {pr['html_url']}")
```