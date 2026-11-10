```python
def run_gpt_code(num):
	print("Running GPT Code")
	if num == 0:
		try:
			result = subprocess.check_output(["python","./LLM/gpt_code.py"] , stderr=subprocess.STDOUT)
		except subprocess.CalledProcessError as e:
			print(suggestions(e.output))
			rospy.loginfo(suggestions(e.output))
			# print("Error occured while running the code. You can consult the administrators")
			return
	else:
		try:
			result = subprocess.check_output(["python","./LLM/gpt_code_"+str(num)+".py"] , stderr=subprocess.STDOUT)
		except subprocess.CalledProcessError as e:
			print(suggestions(e.output))
			rospy.loginfo(suggestions(e.output))
			# print("Error occured while running the code. You can consult the administrators")
			return

	result = parse_output(result)
	print(result)
```