```python
def output_error(problems):
    if problems[MISSING]:
        print 'Your report.yaml file is', MISSING, 'the following keys:', \
                problems[MISSING]
    if problems[EXTRA]:
        print 'Your report.yaml file has the following', EXTRA, 'keys:', \
                problems[EXTRA]
```