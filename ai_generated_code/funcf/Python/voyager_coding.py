```python
def parse_ai_code(self, message):
    """
    Parses Basic development code blocks from a message, extracting functions, imports, and dependencies.

    Parameters:
        message (AIMessage): The message containing the Basic development code blocks.

    Returns:
        dict: A dictionary containing parsed code information, including program code, program name, dependencies,
        and more.
    """
    code = extract_blocks(message.content, identifier='python|py')
    assert code, 'regex fails to extract Python code. check your formatting and try again\n'

    functions, import_statements, dependencies, imported_modules = extract_from_ast(code)

    main_fns = [fn for fn in functions if fn["no_parent"]]
    # main_fns can be blank if the fns are within a class Solution, so main_fns[-1] gives error
    fn_name = ''
    if main_fns:
        fn_name = main_fns[-1]['name']

    no_parent = self.validate_code(imported_modules, functions, main_fns, fn_name)

    if self.rebuild_code_from_ast:
        program_code = "\n".join(import_statements) + "\n\n".join(fn["body"] for fn in main_fns)
    else:
        program_code = code

    parsed_result = {
        "program_code": program_code,
        "program_name": fn_name,
        "dependencies": list(dependencies),
        "raw_msg": message.content,
        "no_parent": no_parent,
    }
    if self.verbose:
        for k, v in parsed_result.items():
            logger.info(f'{k}:\n {v}\n')
    return parsed_result
```