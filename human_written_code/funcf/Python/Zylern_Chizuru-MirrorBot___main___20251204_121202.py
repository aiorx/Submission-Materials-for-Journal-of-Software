```python
async def start_services():
    print('\n')
    print('------------------- Initalizing Telegram Bot -------------------')
    await StreamBot.start()
    print('----------------------------- DONE -----------------------------')
    print('\n')
    print('--------------------------- Importing ---------------------------')
    for name in files:
        with open(name) as a:
            path_ = Path(a.name)
            plugin_name = path_.stem.replace(".py", "")
            plugins_dir = Path(f"WebStreamer/bot/plugins/{plugin_name}.py")
            import_path = ".plugins.{}".format(plugin_name)
            spec = importlib.util.spec_from_file_location(import_path, plugins_dir)
            load = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(load)
            sys.modules["WebStreamer.bot.plugins." + plugin_name] = load
            print("Imported => " + plugin_name)
#    if Var.ON_HEROKU:
#        print('------------------ Starting Keep Alive Service ------------------')
#        print('\n')
#        scheduler = BackgroundScheduler()
#        scheduler.add_job(ping_server, "interval", seconds=1200)
#        scheduler.start()
    print('-------------------- Initalizing Web Server --------------------')
    app = web.AppRunner(await web_server())
    await app.setup()
    bind_address = "0.0.0.0" if Var.ON_HEROKU else Var.BIND_ADRESS
    await web.TCPSite(app, bind_address, Var.PORT).start()
    print('----------------------------- DONE -----------------------------')
    print('\n')
    print('----------------------- Service Started -----------------------')
    print('                        bot =>> {}'.format((await StreamBot.get_me()).first_name))
    print('                        server ip =>> {}:{}'.format(bind_address, Var.PORT))
    if Var.ON_HEROKU:
        print('                        app running on =>> {}'.format(Var.FQDN))
    print('---------------------------------------------------------------')
    await idle()
```