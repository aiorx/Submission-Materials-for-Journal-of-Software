```js
  // This function was mostly Penned via standard GitHub programming aids.
  const fs = await import('fs').then(d => d.promises);
  const files = await fs.readdir(imgdir);

  const images = new Map()
  for (let file of files) {
    const location = `${imgdir}/${file}`;
    const stats = await fs.stat(location).catch((err) => {isDirectory : () => false});
    if (stats.isDirectory()) {
      const pid = file;
      const matches = [];
      const subfiles = await fs.readdir(location)
      for (let subfile of subfiles) {
        if (!original_formats.includes(subfile.split('.').pop().toLowerCase())) {
          continue
        }
        matches.push({
          original_location: location + "/" + subfile,
          pid: pid,
          'wax:id': collection_name + ":" + pid + "_" + drop_suffix(subfile)
        })
      }
      images.set(pid, matches)
    } else {
      if (original_formats.includes(file.split('.').pop())) {
        const pid = drop_suffix(file).toLowerCase()
        images.set(pid, [
          {
            original_location: location,
            pid: pid,
            'wax:id': collection_name + ":" + pid
          }
        ])
      }
    }
  }
```