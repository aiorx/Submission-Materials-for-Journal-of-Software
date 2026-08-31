```python
def send_notify(self, event):
    self._oprot.writeMessageBegin('notify', TMessageType.CALL, self._seqid)
    args = notify_args()
    args.event = event
    args.write(self._oprot)
    self._oprot.writeMessageEnd()
    self._oprot.trans.flush()
```