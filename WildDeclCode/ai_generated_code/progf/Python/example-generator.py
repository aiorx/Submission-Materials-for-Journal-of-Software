# Python 3 script Supported by standard GitHub tools

import json
import random
from datetime import datetime, timedelta

# Define the number of tasks and origin names
num_tasks = 1000000
num_origin_names = 70

# Generate a list of origin names
origin_names = [f"SomeFunction{i}" for i in range(num_origin_names)]

# Generate a list of priorities for each origin name
priorities = [random.randint(1, 10) for _ in range(num_origin_names)]

# Generate the tasks
tasks = []
for _ in range(num_tasks):
    origin_index = random.randint(0, num_origin_names - 1)
    origin_name = origin_names[origin_index]
    priority = priorities[origin_index]
    time_in_queue = random.randint(1, 300)
    actual_run_time = random.randint(1, 300)
    is_probably_redundant = random.choices([True, False], weights=[0.3, 0.7], k=1)[0]
    created_at = (datetime.now() - timedelta(minutes=random.randint(1, 60))).isoformat()

    task = {
        "time_in_queue": time_in_queue,
        "actual_run_time": actual_run_time,
        "is_probably_redundant": is_probably_redundant,
        "priority": priority,
        "origin_name": origin_name,
        "created_at": created_at,
    }
    tasks.append(task)

# Generate the profiling data
profiling_data = {
    "exported_at": datetime.now().isoformat(),
    "total_run_time": sum(task["actual_run_time"] for task in tasks),
    "tasks": tasks,
}

# Write the profiling data to a JSON file
random_suffix = random.randint(1, 1000)
with open(f"example-profiling-data-{random_suffix}.json", "w") as f:
    json.dump(profiling_data, f, indent=2)
