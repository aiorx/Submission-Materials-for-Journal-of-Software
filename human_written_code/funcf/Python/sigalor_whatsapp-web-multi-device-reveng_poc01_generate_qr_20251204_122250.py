```python
def on_open(ws):
  global client_id

  try:
    client_id = to_base64(os.urandom(16))
    payload = json.dumps(["admin", "init", [2, 2126, 11], [
        "Linux", "Chrome", "x86_64"], client_id, True], separators=(',', ':'))
    ws.send(get_message_tag("ask_for_qr") + "," + payload)
  except:
    eprint(traceback.format_exc())
```