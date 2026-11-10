```python
def write_testfile(program_name: str, generated_json: str) -> None:
    """
    Reads the GPT generated code in JSON format and writes it into a JavaScript
    file that can be used as an input for Whisker. The generated file is then
    stored in /data/Tests/js/{program_name}_Tests.js.

    Arguments:
        program_name: Name of the program under test -> str
        generated_json: Tests Written with routine coding tools in JSON format
    """
    data = json.loads(generated_json)
    export = {}
    with open(f'./data/Tests/js/gpt/{program_name}_Tests.js', 'w') as f:
        for item in data['tests']:
            test = item['code']
            name = extract_name(test)
            export[name] = item['name']
            f.write(test)
            f.write('\n'*2)

        f.write('module.exports = [\n')
        for name in export:
            f.write('\t{\n')
            f.write(f'\t\t test: {name},\n')
            f.write(f'\t\t name: "{name}",\n')
            f.write(f'\t\t description: "{export[name]}",\n')
            f.write(f'\t\t categories: []\n')
            f.write('\t},\n')
        f.write(']\n')
```