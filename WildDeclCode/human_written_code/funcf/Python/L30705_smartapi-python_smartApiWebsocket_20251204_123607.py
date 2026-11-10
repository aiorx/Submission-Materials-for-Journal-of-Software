```python
def heartBeat(self):        
    try:
        request = {"task": "hb", "channel": "", "token": self.feed_token, "user": self.client_code,
                   "acctid": self.client_code}
        print(request)
        self.ws.send(
            six.b(json.dumps(request))
        )

    except:
        print("HeartBeat Sending Failed")
        # time.sleep(60)
```