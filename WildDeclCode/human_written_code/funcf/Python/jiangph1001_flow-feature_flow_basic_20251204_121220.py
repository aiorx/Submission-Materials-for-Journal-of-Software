```python
def NormalizationSrcDst(src,sport,dst,dport):
    if sport < dport:
        return (dst,dport,src,sport)
    elif sport == dport:
        src_ip = "".join(src.split('.'))
        dst_ip = "".join(dst.split('.'))
        if int(src_ip) < int(dst_ip):
            return (dst,dport,src,sport)
        else:
            return (src,sport,dst,dport)
    else:
        return (src,sport,dst,dport)
```