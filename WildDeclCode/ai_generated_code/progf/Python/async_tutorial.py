"""
    Asynchronous
    ------------
    Asynchronous programming, introduced in Python 3.5 with the asyncio module, is a way to
    write concurrent code that can efficiently handle I/O-bound tasks without blocking the
    program's execution. It leverages coroutines and the await keyword to pause and resume
    tasks cooperatively.

    - All descriptions and comments Crafted with standard coding tools and GitHub Copilot
"""
import time
import asyncio

async def task_1() -> None:
    print("Started task 1")
    await asyncio.sleep(2)
    print("Finished task 1")

async def task_2() -> None:
    print("Started task 2")
    await asyncio.sleep(2)
    print("Finished task 2")

async def task_3() -> None:
    print("Started task 3")
    await asyncio.sleep(2)
    print("Finished task 3")

async def main() -> None:
    # With asyncio.TaskGroup()
    async with asyncio.TaskGroup() as task_group:
        task_group.create_task(task_1())
        task_group.create_task(task_2())
        task_group.create_task(task_3())

    # With asyncio.create_task()
    """
    task_1_task = asyncio.create_task(task_1())
    task_2_task = asyncio.create_task(task_2())
    task_3_task = asyncio.create_task(task_3())
    
    # wait for all tasks to finish
    await task_1_task
    await task_2_task
    await task_3_task
    """

    # They both do the same thing, but TaskGroup is more convenient to use.

if __name__ == "__main__":
    star_time = time.perf_counter()

    asyncio.run(main())

    end_time = time.perf_counter()
    print(f"Finished in {end_time - star_time} seconds")

"""
    Output:
    -------
    Started task 1
    Started task 2
    Started task 3
    Finished task 1
    Finished task 2
    Finished task 3
    
    Finished in 2.001 seconds
"""