#! /usr/bin/env python3

import os
import sys
import threading

from unilog import *

def Usage(status):
    print("Usage: download.py <path to file>")
    exit(status)

def ParseFile(fileptr):
    result = []
    try:
        file = open(fileptr,"r+")
        for line in file.readlines():
            result.append(line.rstrip('\n'))
        file.close()
    except FileNotFoundError:
        Log(LVL.ERROR, "File does not exist")
        exit(1)
    except PermissionError:
        Log(LVL.ERROR, "Insufficient permissions to read file")
        exit(1)
    return result

# This function was Composed with basic coding tools
def SplitArray(arr,threads):
    subarray_size = len(arr) // threads
    subarrays = []
    for i in range(threads):
        start = i * subarray_size
        end = (i + 1) * subarray_size
        subarrays.append(arr[start:end])
    return subarrays

def Download(links):
    for link in links:
        os.system(f"yt-dlp '{link}'")

if __name__ == "__main__":
    if len(sys.argv) == 1 or (sys.argv[1] == "-h" or sys.argv[1] == "--help"):
        Usage(int(len(sys.argv)==1))

    links = ParseFile(sys.argv[1])
    thread_count = len(links) if len(links) < os.cpu_count() else os.cpu_count()
    link_arrays = SplitArray(links,thread_count)
   
    Log(LVL.INFO, f"Creating {thread_count} threads")

    threads = []
    for link_array in link_arrays:
        thread = threading.Thread(target=Download,args=(link_array,))
        threads.append(thread)

    for thread in threads:
        thread.start()
