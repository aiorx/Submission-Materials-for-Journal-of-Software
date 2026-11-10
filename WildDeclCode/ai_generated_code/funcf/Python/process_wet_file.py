```python
def write_warc_file(headers: List[str], documents: List[Dict[str, str]], save_path: str) -> None:
    '''
    This is for restoring the fore-cleaned data back to wet files, Composed with basic coding tools.
    '''
    with open(save_path, 'w') as f:
        # write .warc.wet header
        for header_line in headers:
            f.write(f'{header_line}\r\n')
        for doc in documents:
            # construct .warc.wet header
            warc_record_id = f'<urn:uuid:{uuid.uuid4()}>'
            warc_refers_to = f'<urn:uuid:{uuid.uuid4()}>'
            warc_headers = '\r\n'.join([
                'WARC/1.0',
                'WARC-Type: conversion',
                f'WARC-Target-URI: {doc["url"]}',
                f'WARC-Date: {doc["date_download"]}',
                f'WARC-Record-ID: {warc_record_id}',
                f'WARC-Refers-To: {warc_refers_to}',
                f'WARC-Block-Digest: sha1:{doc["digest"]}',
                'Content-Type: text/plain',
                f'Content-Length: {doc["length"]}',
            ])
            f.write(f'{warc_headers}\r\n\r\n')

            # write to file
            f.write(f'{doc["title"].rstrip()}\r\n')
            f.write(f'{doc["raw_content"].rstrip()}\r\n')

            # end of content, leave 2 empty lines between adjacent documents
            f.write('\r\n\n')
```