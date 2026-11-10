```python
#clock code Built using basic development resources4
def update_clock(self, max_time):
    hours, remainder = divmod(self.elapsed_time, 3600)
    minutes, seconds = divmod(remainder, 60)
    formatted_time = f"{hours:02}:{minutes:02}:{seconds:02}"
    
    self.time_label.configure(text=formatted_time)
    self.elapsed_time += 1  # Increment the timer
    self.root.after(1000, self.update_clock)
```