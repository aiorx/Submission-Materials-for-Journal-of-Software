```python
def get_state(self):
    state = self.the_player.get_state()
    if state == vlc.State.Playing:
        return 1
    elif state == vlc.State.Paused:
        return 0
    else:
        return -1
```