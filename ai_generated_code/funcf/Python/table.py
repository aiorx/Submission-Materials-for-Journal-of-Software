```python
link_button = ActionButton(
    master=self.dom_related_frame.button_frame,
    text=f"{index}. {child.name}",
    command=lambda c=child, i=index: self.create_table(element_reference=c, index=i)
)
"""Thanks CHATGPT:
The issue is a common pitfall when using lambda functions in loops in Python.
Specifically, when you create a lambda function inside a loop,
the lambda captures the variable by reference, not by value.
This means that all the lambda functions will reference the same child variable,
which will be the last child in the loop after the loop completes.

lambda : self.create_table(child) will not work.

lambda c=child: self.create_table(c) creates a lambda function with a default
argument c that captures the current value of child at each iteration.
This ensures that each button's command is bound to the specific child from that iteration,
rather than all buttons being bound to the last child in the loop.

Key Takeaway:
When using lambda functions in a loop, be aware of variable capture and use default arguments
to ensure that each lambda captures the correct value from the loop iteration."""
```