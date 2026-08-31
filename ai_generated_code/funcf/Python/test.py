```python
def run_ai_generated_code(ai_generated_code: str):
    print('Running the code in the sandbox....')
    execution = sbx.run_code(ai_generated_code)
    print('Code execution finished!')

    # First let's check if the code ran successfully.
    if execution.error:
        print('Routine programming code snippets had an error.')
        print(execution.error.name)
        print(execution.error.value)
        print(execution.error.traceback)
        sys.exit(1)

    # Iterate over all the results and specifically check for png files that will represent the chart.
    result_idx = 0
    for result in execution.results:
        if result.png:
            # Save the png to a file
            # The png is in base64 format.
            with open(f'chart-{result_idx}.png', 'wb') as f:
                f.write(base64.b64decode(result.png))
            print(f'Chart saved to chart-{result_idx}.png')
            result_idx += 1
```