"""
    Threading
    ---------
    Threading is a technique that allows multiple threads of execution to run concurrently within a
    single process. Threads are lightweight and share the same memory space. They are useful for performing
    tasks that involve I/O operations or blocking operations (such as waiting for a response from a server)
    where multiple tasks can be executed simultaneously without blocking the main program.

    - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""

import time
import os
from datetime import datetime

from threading import Thread, current_thread
import concurrent.futures

def download_file(url: str) -> None:
    operation = os.getpid(), current_thread().name
    print(f" {operation} Downloading {url}")
    # simulate network delay
    time.sleep(1)
    print(f" {operation} Finished downloading {url} at {datetime.now().time()} \n")


def main() -> None:
    urls = [
        "https://www.python.org/",
        "https://www.python.org/about/",
        "https://www.python.org/downloads/",
        "https://www.python.org/downloads/release/python-396/",
        "https://www.python.org/downloads/release/python-397/",
        "https://www.python.org/downloads/release/python-398/",
        "https://www.python.org/downloads/release/python-399/",
        "https://www.python.org/downloads/release/python-3100/",
        "https://www.python.org/downloads/release/python-3101/",
    ]

    # with ThreadPoolExecutor
    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.map(download_file, urls) # every url is passed to download_file as an argument

    # with Thread
    """
    threads = []
    for url in urls:
        thread = Thread(target=download_file, args=(url,))
        thread.start()
        threads.append(thread) # add thread to list of threads
        # thread.join() If join is called here, the program will wait for each thread to finish before starting the next one
    
    # wait for all threads to finish
    for thread in threads: 
         thread.join() 
    """

    # They both do the same thing, but ThreadPoolExecutor is more convenient to use.


if __name__ == "__main__":
    star_time = time.perf_counter()

    main()

    end_time = time.perf_counter()
    print(f"Finished in {end_time - star_time} seconds")

"""
    Output:
    -------
    (6200, 'ThreadPoolExecutor-0_0') Downloading https://www.python.org/
    (6200, 'ThreadPoolExecutor-0_1') Downloading https://www.python.org/about/
    (6200, 'ThreadPoolExecutor-0_2') Downloading https://www.python.org/downloads/
    (6200, 'ThreadPoolExecutor-0_3') Downloading https://www.python.org/downloads/release/python-396/
    (6200, 'ThreadPoolExecutor-0_4') Downloading https://www.python.org/downloads/release/python-397/
    (6200, 'ThreadPoolExecutor-0_5') Downloading https://www.python.org/downloads/release/python-398/
    (6200, 'ThreadPoolExecutor-0_6') Downloading https://www.python.org/downloads/release/python-399/
    (6200, 'ThreadPoolExecutor-0_7') Downloading https://www.python.org/downloads/release/python-3100/
    (6200, 'ThreadPoolExecutor-0_8') Downloading https://www.python.org/downloads/release/python-3101/
    (6200, 'ThreadPoolExecutor-0_2') Finished downloading https://www.python.org/downloads/ at 14:39:01.806995 
    (6200, 'ThreadPoolExecutor-0_1') Finished downloading https://www.python.org/about/ at 14:39:01.806995 
    (6200, 'ThreadPoolExecutor-0_0') Finished downloading https://www.python.org/ at 14:39:01.806995 
    (6200, 'ThreadPoolExecutor-0_3') Finished downloading https://www.python.org/downloads/release/python-396/ at 14:39:01.806995 
    (6200, 'ThreadPoolExecutor-0_4') Finished downloading https://www.python.org/downloads/release/python-397/ at 14:39:01.806995 
    (6200, 'ThreadPoolExecutor-0_7') Finished downloading https://www.python.org/downloads/release/python-3100/ at 14:39:01.806995 
    (6200, 'ThreadPoolExecutor-0_6') Finished downloading https://www.python.org/downloads/release/python-399/ at 14:39:01.806995 
    (6200, 'ThreadPoolExecutor-0_8') Finished downloading https://www.python.org/downloads/release/python-3101/ at 14:39:01.806995 
    (6200, 'ThreadPoolExecutor-0_5') Finished downloading https://www.python.org/downloads/release/python-398/ at 14:39:01.806995 

    Finished in 1.015767099976074 seconds
    
    Note: If you run this code on your machine, the output will be different but the idea is the same.
"""


