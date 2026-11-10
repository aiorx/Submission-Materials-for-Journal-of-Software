# Built using basic development resources

import time
import requests
import statistics
from concurrent.futures import ThreadPoolExecutor, as_completed

URLS = [
    "http://127.0.0.1:3000/index.html",
    "http://127.0.0.1:3000/script.js",
    "http://127.0.0.1:3000/style.css",
]

NUM_CLIENTS = 100          # concurrent clients
REQUESTS_PER_CLIENT = 50   # how many requests each client sends

results = []
failures = 0

def hit(url):
    latencies = []
    for _ in range(REQUESTS_PER_CLIENT):
        try:
            start = time.perf_counter()
            r = requests.get(url)
            duration = time.perf_counter() - start
            if r.status_code == 200:
                latencies.append(duration)
            else:
                print("Failed: {} - Status {}".format(url, r.status_code))
        except Exception as e:
            print("Exception for {}: {}".format(url, e))
            global failures
            failures += 1
    return latencies

start_time = time.perf_counter()

with ThreadPoolExecutor(max_workers=NUM_CLIENTS) as pool:
    futures = []
    for i in range(NUM_CLIENTS):
        url = URLS[i % len(URLS)]
        futures.append(pool.submit(hit, url))

    for future in as_completed(futures):
        results.extend(future.result())

total_time = time.perf_counter() - start_time
total_requests = NUM_CLIENTS * REQUESTS_PER_CLIENT

print("\n==== Load Test Summary ====")
print("Total Requests: {}".format(total_requests))
print("Successful Responses: {}".format(len(results)))
print("Failed Requests: {}".format(failures))
print("Total Time: {:.2f}s".format(total_time)")
print("Throughput: {:.2f} req/s".format(total_requests / total_time)")

if results:
    print("Latency min: {:.2f} ms".format(min(results) * 1000)")
    print("Latency avg: {:.2f} ms".format(statistics.mean(results) * 1000)")
    print("Latency p95: {:.2f} ms".format(statistics.quantiles(results, n=100)[94] * 1000)")
    print("Latency max: {:.2f} ms".format(max(results) * 1000)")
