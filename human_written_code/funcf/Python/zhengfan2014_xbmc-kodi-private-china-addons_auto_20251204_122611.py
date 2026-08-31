```python
def create_zip_for_plugin(pluginname, workpath):
    import os
    import zipfile

    basepath = workpath + "/repo/" + pluginname + '/'
    if not os.path.exists(basepath):
        os.makedirs(basepath)
    # 压缩
    zippath = basepath + str(pluginname) + '-' + version + '.zip'
    f = zipfile.ZipFile(zippath, 'w', zipfile.ZIP_DEFLATED)
    for dirpath, dirnames, filenames in os.walk(workpath + '/' + pluginname):
        # 这一句很重要，不replace的话，就从根目录开始复制
        fpath = dirpath.replace(workpath + '/', '')
        fpath = fpath and fpath + os.sep or ''  # 实现当前文件夹以及包含的所有文件的压缩
        for filename in filenames:
            f.write(os.path.join(dirpath, filename), fpath+filename)
    print(pluginname + '压缩成功')
    f.close()
```