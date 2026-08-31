```python
def load_results(task, dataset_name, model_config):
    results = []
    for repeat in range(10):
        fname = 'results/{}_{}_{}_layer{}_approximate{}_repeat{}.txt'.format(
            task, model_config[0], dataset_name, model_config[1], model_config[2], repeat)
        try:
            with open(fname,'r') as f:
                result = f.read()
                results.append(float(result))
        except:
            return None, fname
    results = np.array(results)
    return results, None
```