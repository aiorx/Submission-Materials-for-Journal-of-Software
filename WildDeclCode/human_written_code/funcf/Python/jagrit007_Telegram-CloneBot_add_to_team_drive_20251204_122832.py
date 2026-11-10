```python
def add_permissions_to_drive(drive, did, acc_dir):
    batch = drive.new_batch_http_request()
    aa = glob.glob('%s/*.json' % acc_dir)
    pbar = progress.bar.Bar("Readying accounts", max=len(aa))
    for i in aa:
        ce = json.loads(open(i, 'r').read())['client_email']
        batch.add(drive.permissions().create(fileId=did, supportsAllDrives=True, body={
            "role": "fileOrganizer",
            "type": "user",
            "emailAddress": ce
        }))
        pbar.next()
    pbar.finish()
    print('Adding...')
    batch.execute()
```