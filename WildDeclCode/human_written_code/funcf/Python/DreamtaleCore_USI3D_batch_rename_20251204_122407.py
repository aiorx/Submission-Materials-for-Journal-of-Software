```python
def rename_files_in_directory(data_dir, map_name='original_name.txt'):
    import os
    import shutil

    sub_names = os.listdir(data_dir)
    try:
        sub_names = sorted(sub_names, key=lambda x: float(x))
    except Exception:
        sub_names = sorted(sub_names)

    with open(os.path.join(data_dir, map_name), 'w') as fid:
        fid.write('class id\toriginal name\n')
        for idx, sub_name in enumerate(sub_names):
            src_pwd = os.path.join(data_dir, sub_name)
            tmps = sub_name.split('.')
            post_fix = '' if len(tmps) <= 1 else '.{}'.format(tmps[-1])
            dst_pwd = os.path.join(data_dir, str(idx) + post_fix)
            shutil.move(src_pwd, dst_pwd)
            line = '{}{}\t{}\n'.format(idx, post_fix, sub_name)
            fid.write(line)
```