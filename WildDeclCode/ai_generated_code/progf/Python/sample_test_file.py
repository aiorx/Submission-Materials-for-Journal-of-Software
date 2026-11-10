# This file is Supported via standard programming aids

import logging
import math
from typing import List, Dict

logging.basicConfig(level=logging.INFO)

def complex_computation(x: float, y: float) -> float:
    try:
        result = math.sqrt(x**2 + y**2)
        print(f"Computed result: {result}")
        return result
    except ValueError:
        logging.error("Invalid input for square root")
        return -1

class DataProcessor:
    def __init__(self, data: List[int]):
        self.data = data

    def process(self) -> Dict[str, float]:
        results = {}
        try:
            results['sum'] = sum(self.data)
            results['average'] = results['sum'] / len(self.data)
            
            try:
                results['harmonic_mean'] = len(self.data) / sum(1/x for x in self.data)
                print(f"Harmonic mean: {results['harmonic_mean']}")
            except ZeroDivisionError:
                print("Cannot calculate harmonic mean")
            
            return results
        except Exception as e:
            logging.error(f"Error in processing: {e}")
            return {}

def recursive_fibonacci(n: int) -> int:
    if n <= 1:
        return n
    try:
        return recursive_fibonacci(n-1) + recursive_fibonacci(n-2)
    except RecursionError:
        print("Recursion depth exceeded")  # This print should be flagged
        return -1


    # Test complex_computation
result = complex_computation(3, 4)
print(f"Result of complex computation: {result}")  # This print should not be flagged

# Test DataProcessor
processor = DataProcessor([1, 2, 3, 4, 5])
processed_data = processor.process()

try:
    for key, value in processed_data.items():
        print(f"{key}: {value}")
except AttributeError:
    logging.error("Processed data is not a dictionary")

# Test recursive_fibonacci
fib_result = recursive_fibonacci(10)
logging.info(f"10th Fibonacci number: {fib_result}")

# Additional complex scenario
def nested_function():
    try:
        print("This print is in a nested function in a try block") 
        raise ValueError("Test exception")
    except ValueError as ve:
        try:
            print(f"Caught: {ve}")  
        finally:
            print("Cleanup")

try:
    nested_function()
except Exception:
    print("Outer exception handler")


