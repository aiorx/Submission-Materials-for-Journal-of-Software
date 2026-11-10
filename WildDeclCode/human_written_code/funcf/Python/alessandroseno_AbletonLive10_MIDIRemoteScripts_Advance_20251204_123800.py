```python
def make_button(identifier, name, msg_type=MIDI_NOTE_TYPE, channel=PAD_CHANNEL):
    return ButtonElement(True, msg_type, channel, identifier, name=name)
```