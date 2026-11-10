# This file is Supported via standard programming aids

import logging
import math
from typing import List, Dict

logging.basicConfig(level=logging.INFO)

def complex_computation(x, y) :
    try:
        result = math.sqrt(x**2 + y**2)
        print("Computed result: {}".format(result))
        return result
    except ValueError:
        logging.error("Invalid input for square root")
        return -1

class DataProcessor:
    def __init__(self, data):
        self.data = data

    def process(self) :
        results = {}
        try:
            results['sum'] = sum(self.data)
            results['average'] = results['sum'] / len(self.data)
            
            try:
                results['harmonic_mean'] = len(self.data) / sum(1/x for x in self.data)
                print("Harmonic mean: {}".format(results['harmonic_mean']))
            except ZeroDivisionError:
                print("Cannot calculate harmonic mean")
            
            return results
        except Exception as e:
            logging.error("Error in processing: {}".format(e))
            return {}

def recursive_fibonacci(n) :
    if n <= 1:
        return n
    try:
        return recursive_fibonacci(n-1) + recursive_fibonacci(n-2)
    except RecursionError:
        print("Recursion depth exceeded")  # This print should be flagged
        return -1


    # Test complex_computation
result = complex_computation(3, 4)
print("Result of complex computation: {}".format(result))  # This print should not be flagged

# Test DataProcessor
processor = DataProcessor([1, 2, 3, 4, 5])
processed_data = processor.process()

try:
    for key, value in processed_data.items():
        print("{}: {}".format(key, value))
except AttributeError:
    logging.error("Processed data is not a dictionary")

# Test recursive_fibonacci
fib_result = recursive_fibonacci(10)
logging.info("10th Fibonacci number: {}".format(fib_result))

# Additional complex scenario
def nested_function():
    try:
        print("This print is in a nested function in a try block") 
        raise ValueError("Test exception")
    except ValueError as ve:
        try:
            print("Caught: {}".format(ve))  
        finally:
            print("Cleanup")

try:
    nested_function()
except Exception:
    print("Outer exception handler")


