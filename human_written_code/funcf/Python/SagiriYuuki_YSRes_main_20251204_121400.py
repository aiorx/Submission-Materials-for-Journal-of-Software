```python
def DumpAvatarExcel():
    cmd = ['ksdump', '-f', 'json', './bin/ExcelBinOutput/AvatarExcelConfigData.bin', './ksy/avatar_excel.ksy']

    with open('./json/Dump_AvatarExcelConfigData.json', 'w') as out:
        return_code = subprocess.call(cmd, stdout=out)
```