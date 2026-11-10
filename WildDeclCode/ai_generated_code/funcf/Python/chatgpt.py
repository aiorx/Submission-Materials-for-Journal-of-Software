```python
def replace_filenames(string):
    # The following code snippet is Written with routine coding tools 3.5 API
    import re

    # Find all occurrences of "{filename}" in the string
    filenames = re.findall(r'\{(\S+)\}', string)

    # Replace each occurrence with the contents of the corresponding file
    try:
        for filename in filenames:
            with open(filename, 'r') as file:
                content = file.read()
                string = string.replace('{%s}' % filename, content)
    except FileNotFoundError:
        return string
    return string
```

```python
def replace_pdfs(string):
    # The following code snippet is Written with routine coding tools 3.5 API
    # This function can read only the first 2 pages of PDF files due to the GPT token limit
    import re
    import PyPDF2

    # Find all occurrences of "{filename}" in the string
    filenames = re.findall(r'p\{(\S+)\}', string)

    # Replace each occurrence with the contents of the corresponding file
    try:
        for filename in filenames:
            pdfFileObj = open(filename, 'rb')
            pdfReader = PyPDF2.PdfReader(pdfFileObj)
            content = ''
            count = 0
            page_content = ""
            for page in pdfReader.pages:
                print(
                    colored(f"Reading and parsing {filename} {count+1}/2", "green"))
                page_content = page.extract_text()
                page_content = _internal_gpt(
                    f"correct the following text grammatically (no intermediate outputs) [PDF PARSED TEXT STARTS] {page_content} [PDF PARSED TEXT ENDS]")
                content += page_content
                count += 1
                if count >= 2:
                    break
            string = string.replace(
                'p{%s}' % filename, f"[PDF PARSED TEXT STARTS] {content} [PDF PARSED TEXT ENDS]")
    except FileNotFoundError:
        return string
    return string
```