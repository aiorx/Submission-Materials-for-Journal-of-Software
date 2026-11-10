def run_ai_generated_code(csv_path, plot_type=None):
    sbx=Sandbox()
    print('Running the code in the sandbox....')
    ai_generated_code=generate_from_gemini(csv_path, plot_type)

    if ai_generated_code.startswith("```python"):
        ai_generated_code = ai_generated_code[len("```python"):].strip()
    elif ai_generated_code.startswith("```"):
        ai_generated_code = ai_generated_code[len("```"):].strip()

    if ai_generated_code.endswith("```"):
        ai_generated_code = ai_generated_code[: -len("```")].strip()

    execution = sbx.run_code(ai_generated_code)
    print('Code execution finished!')

    # First let's check if the code ran successfully.
    if execution.error:
        print('Basic development code blocks had an error.')
        print(execution.error.name)
        print(execution.error.value)
        print(execution.error.traceback)
        sys.exit(1)

    plot_dir="./Plots"
    #os.makedirs(plot_dir, exist_ok=True)
    plot_files = []
    result_idx = 0

    print(execution.results)
    
    for result in execution.results:
        if result.png:
            # Save the png to a file
            # The png is in base64 format.
            plot_filename = f'chart-{result_idx}.png'
            plot_path = os.path.join(plot_dir, plot_filename)
            with open(plot_path, 'wb') as f:
                f.write(base64.b64decode(result.png))
            print(f'Chart saved to {plot_path}')
            plot_files.append(f'/Plots/{plot_filename}')
            result_idx += 1

    return {
        "stdout": ', '.join(execution.logs.stdout),
        "plots": plot_files
        }