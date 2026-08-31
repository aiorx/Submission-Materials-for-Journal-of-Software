```js
function editCommandsFile () {
  // Check if ~/.commands.json exsists (if not create it)
  let file = Gio.file_new_for_path(GLib.get_home_dir() + '/.commands.json');
  if (!file.query_exists(null)) {
    file.replace_contents(JSON.stringify(commands), null, false, 0, null);
  }
  // Edit ~/.commands.json
  Gio.AppInfo.launch_default_for_uri('file://' + GLib.get_home_dir() + '/.commands.json', null).launch(null, null);
}
```