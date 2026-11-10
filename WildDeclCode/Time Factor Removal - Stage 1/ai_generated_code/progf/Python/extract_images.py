# script Assisted with basic coding tools
# script for tryhackme room Security Footage https://tryhackme.com/room/securityfootage
# you need to export raw data using wireshark follow tcp stream, save data as image.raw
import re

data = open('image.raw','rb').read()
frames = re.findall(b'\xff\xd8.*?\xff\xd9', data, re.DOTALL)
for i, f in enumerate(frames):
    open("frame_{:04d}.jpg".format(i)','wb').write(f)
print("Extracted {} frames".format(len(frames)))
