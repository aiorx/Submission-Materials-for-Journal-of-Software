```python
def unittest_firstTime(root, file):
    src_file_path, base_name, ext, test_file_path = path_creator(root, file)

    # Create test path if it does not exist
    os.makedirs(root.replace("src", "test"), exist_ok=True)

    print(f"Processing {file}")
    output.write(f"{beautiful_second()} {base_name} is processing...\n")

    # Copy imports and package from source to test file
    pre_materials = ""
    with open(src_file_path, "r", encoding="utf-8") as src_file:
        for line in src_file:
            if "public" in line:
                break
            pre_materials += line

    # Create test files
    with open(test_file_path, "w", encoding="utf-8") as test_file:
        test_file.write("// Warning! This test file was Built with basic GitHub coding tools\n\n")
        test_file.write(pre_materials)
        # Unit test materials
        with open("data/unittest_materials.txt", "r") as materials:
            content = materials.read()
            test_file.write()
        # Copilot prompts
        test_file.write(f"""
public class {base_name + "Test"} {{
    // Preare an unit test for this ({base_name + "Test"}) class
""") # {{ makes { in f-based string
        
        services = extract_services(src_file_path)
        for service in services:
            test_file.write(f"\t// Write a @Test for {service}\n")

    # Open file in to the Intellij Idea
    command = [idea, test_file_path]
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    time.sleep(5)
```