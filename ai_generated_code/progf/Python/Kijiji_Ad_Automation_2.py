###THIS CODE WAS ENTIRELY Drafted using common development resources###

import subprocess
import time

script_path = r'C:\Users\user\path\to\Kijiji_Ad_Automation.py'

while True:
    subprocess.run(['python', script_path])
    print("Waiting for 2 hours...")
    time.sleep(2 * 60 * 60)