```python
def search_wrapper(gen):
    while True:
        gen_back = copy(gen)
        try:
            yield next(gen)
        except StopIteration:
            raise
        except github.exceptions.ForbiddenError as e:
            search_rate_limit = gh.rate_limit()['resources']['search']
            # limit_remaining = search_rate_limit['remaining']
            reset_time = search_rate_limit['reset']
            current_time = int(time.time())
            sleep_time = reset_time - current_time + 1
            stderr.write(
                'GitHub Search API rate limit reached. Sleeping for %d seconds.\n\n'
                % (sleep_time))
            time.sleep(sleep_time)
            yield next(gen_back)
        except Exception as e:
            raise e
```