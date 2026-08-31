"""
    Multiprocessing
    ---------------
    Multiprocessing is a module in Python that allows the execution of multiple processes in parallel.
    Unlike threads, processes run in separate memory spaces, enabling true parallelism on multi-core CPUs.
    Each process has its own Python interpreter and memory, so they can run Python bytecode simultaneously.

    - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""
import time
import os
from datetime import datetime

from multiprocessing import Process, current_process
import concurrent.futures

def calculate_square(number: int) -> None:
    operation = os.getpid(), current_process().name
    print(f" {operation} Square of {number} is {number * number}")
    # simulate CPU-intensive task
    time.sleep(1)
    print(f" {operation} Finished calculating square of {number} at {datetime.now().time()} \n")


def main() -> None:
    squares = [1, 2, 3, 4, 5]

    # with ProcessPoolExecutor
    with concurrent.futures.ProcessPoolExecutor() as executor:
        executor.map(calculate_square, squares)  # every square is passed to calculate_square as an argument

    # with Process
    """
    processes = []
    for square in squares:
        process = Process(target=calculate_square, args=(square,))
        process.start()
        processes.append(process) # add process to list of processes
        # process.join() If join is called here, the program will wait for each process to finish before starting the next one
        
    # wait for all processes to finish
    for process in processes:
        process.join() 
    """

    # They both do the same thing, but ProcessPoolExecutor is more convenient to use.


if __name__ == "__main__":
    star_time = time.perf_counter()

    main()

    end_time = time.perf_counter()
    print(f"Finished in {end_time - star_time} seconds")


"""
    Output:
    -------
    (5864, 'SpawnProcess-1') Square of 1 is 1
    (11664, 'SpawnProcess-2') Square of 2 is 4
    (14560, 'SpawnProcess-3') Square of 3 is 9
    (14584, 'SpawnProcess-4') Square of 4 is 16
    (19404, 'SpawnProcess-5') Square of 5 is 25
    (11664, 'SpawnProcess-2') Finished calculating square of 2 at 15:02:19.844913 
    (5864, 'SpawnProcess-1') Finished calculating square of 1 at 15:02:19.844913 
    (14560, 'SpawnProcess-3') Finished calculating square of 3 at 15:02:19.860924 
    (14584, 'SpawnProcess-4') Finished calculating square of 4 at 15:02:19.860924 
    (19404, 'SpawnProcess-5') Finished calculating square of 5 at 15:02:19.860924 

    Finished in 1.2887270000064746 seconds
    
    Note: If you run this code on your machine, the output will be different but the idea is the same.
"""