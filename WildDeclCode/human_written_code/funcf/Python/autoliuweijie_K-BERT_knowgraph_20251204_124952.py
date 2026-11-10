```python
def _create_lookup_table(self):
    lookup_table = {}
    for spo_path in self.spo_file_paths:
        print("[KnowledgeGraph] Loading spo from {}".format(spo_path))
        with open(spo_path, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    subj, pred, obje = line.strip().split("\t")    
                except:
                    print("[KnowledgeGraph] Bad spo:", line)
                if self.predicate:
                    value = pred + obje
                else:
                    value = obje
                if subj in lookup_table.keys():
                    lookup_table[subj].add(value)
                else:
                    lookup_table[subj] = set([value])
    return lookup_table
```