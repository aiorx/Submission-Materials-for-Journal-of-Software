```python
def _logout(self):
    self._engine.stop()
    self._md.logout()
    self._td.logout()
    # 回收内存
    del self._engine
    del self._md
    del self._td
    gc.collect()
```