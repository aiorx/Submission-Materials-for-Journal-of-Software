```python
def parse_playlist_id_to_name():
    file = open("neteasy_playlist_id_to_name_data.csv", 'a', encoding='utf8')
    for i in range(1, 1292):
        with open("neteasy_playlist_data/{0}.json".format(i), 'r', encoding='UTF-8') as load_f:
            load_dict = json.load(load_f)
            try:
                line_result = [load_dict['playlist']['id'], load_dict['playlist']['name']]
                for k, v in enumerate(line_result):
                    if k == len(line_result) - 1:
                        file.write(str(v))
                    else:
                        file.write(str(v) + ',')
                file.write('\n')
            except Exception:
                print(i)
                continue
    file.close()
```