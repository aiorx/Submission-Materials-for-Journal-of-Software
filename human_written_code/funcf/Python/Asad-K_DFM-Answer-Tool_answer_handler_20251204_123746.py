```python
def catch(func):
    @functools.wraps(func)
    def stub(self, *args, **kwargs):
        try:
            return func(self, *args, *kwargs)
        except NoQuestionFound:  # raised in parser, questions finished
            return True, True
        except KeyboardInterrupt:
            sys.exit()  # quits script
        except BaseException as e:
            return None, e

    return stub
```