```python
def kill_process(self, process):
	"""After the defined timeout, try to kill the process"""
	self.kill_status = self.settings['kill_status']['requested']
	if process.poll() is None:  # don't send the signal unless it seems it is necessary
		try:
			# Unix
			os.killpg(os.getpgid(process.pid), signal.SIGTERM)
			# Windows/Unix
			# process.kill()
			self.kill_status = self.settings['kill_status']['killed']
		except OSError:  # ignore
			self.kill_status = self.settings['kill_status']['not_killed']
	self.settings['logger'].debug("Killed process status: %s" % str(self.kill_status))
```