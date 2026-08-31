```python
# 获取代码段的范围
def getSegAddr():
    textStart = []
    textEnd = []

    for seg in idautils.Segments():
        if (idc.get_segm_name(seg)).lower() == '.text' or (
        idc.get_segm_name(seg)).lower() == 'text':
            tempStart = idc.get_segm_start(seg)
            tempEnd = idc.get_segm_end(seg)

            textStart.append(tempStart)
            textEnd.append(tempEnd)

    return min(textStart), max(textEnd)
```