```python
def father(iplist):
    print(Vcolors.OKGREEN+ "正在对目标地址进行存活检测~~"+ Vcolors.ENDC)
    ascii_banner = pyfiglet.figlet_format("AssetScan")
    print(Vcolors.PURPLE + ascii_banner+Vcolors.ENDC)
    print(Vcolors.OKGREEN+"请选择存活探测的方式~")
    print(Vcolors.OKBLUE+'''(1)Ping探测~(适用于内网内没有禁用Ping)\n(2)ARP探测~（适用于内网内禁用Pin探测,不能跨网段)\n\n    任意键退出程序~'''+Vcolors.ENDC)
    print("\n")
    livecase = input(Vcolors.YELLOW+u"请选择探测存活方式->"+Vcolors.ENDC)
    
    alive_queue = Queue(len(iplist))
    for ip in iplist:
        alive_queue.put(ip)
    thread_list = []
    for u in range(500):
        t = Request(alive_queue,livecase)
        t.start()
        thread_list.append(t)
    for i in thread_list:
        i.join()
    print(Vcolors.OKGREEN + "存活地址已成功写入alive.txt中" + Vcolors.ENDC)
    print("\n")
    vullist = []
    portdic = []
    alivelist = []
    ipdata = open("./file/alive.txt","r")
    alivedata = ipdata.readlines()
    for i in alivedata:
        alivelist.append(i.strip("\n"))
    ipdata.close()
    ascii_banner = pyfiglet.figlet_format("AssetScan")
    print(Vcolors.PURPLE + ascii_banner+Vcolors.ENDC)
    print(Vcolors.OKGREEN+"请选择端口扫描的方式~")
    print(Vcolors.OKBLUE+'''(1)风险端口探测 (Socket方式,适用于少IP)\n(2)风险端口探测 (Masscan方式,适用于多IP)\n(3)常规端口探测 (Nmap方式,Nmap的top1000端口)\n(4)全端口探测   (Socket方式,适用于少IP，准确率高)\n(5)全端口探测   (Masscan方式,适用于多IP,存在误报率)\n\n    任意键退出程序,并生成当前进度报告~'''+Vcolors.ENDC)
    print("\n")
    scancase = input(Vcolors.YELLOW+u"请填写扫描方式->"+Vcolors.ENDC)
    if scancase == "1":
        portdic = portscan()
    elif scancase == "2":
        threadd = input(Vcolors.PURPLE+u"请填写进程配置(默认2000)->"+Vcolors.ENDC)
        if threadd == "":
            threadd ="2000"
        portdic = portmasscan_vul(threadd)
    elif scancase == "3":
        portdic = nmapscan()
    elif scancase == "4":
        portdic = portscanalll()
    elif scancase == "5":
        threadd = input(Vcolors.PURPLE+u"请填写进程配置(默认2000)->"+Vcolors.ENDC)
        if threadd == "":
            threadd ="2000"
        portdic = portmasscan_all(threadd)
    else:
        resultreport(iplist,alivelist,portdic,vullist)
        exit()
    print("\n")
    ascii_banner = pyfiglet.figlet_format("AssetScan")
    print(Vcolors.PURPLE + ascii_banner+Vcolors.ENDC)
    print(Vcolors.OKGREEN+"是否进行风险端口漏洞探测~")
    print(Vcolors.OKBLUE+'''(1)探测风险端口\n\n    任意键退出程序，并生成当前进度报告~'''+Vcolors.ENDC)
    print("\n")
    scancase = input(Vcolors.YELLOW+u"请选择是否进行漏洞探测->"+Vcolors.ENDC)
    if scancase == "1":
        #vullist是存在漏洞的ip地址以及漏洞信息 
        vullist = p21(portdic)+p23(portdic)+p22(portdic)+p80(portdic)+p110(portdic)+p143(portdic)+p443(portdic)+p445(portdic)+p873(portdic)+p1433(portdic)+p3306(portdic)+p6379(portdic)+p8080(portdic)+p9200(portdic)+p11211(portdic)+p27017(portdic)+p1521(portdic)+p2601(portdic)+vulnall(portdic)+p4848(portdic)+p2181(portdic)+p389(portdic)+p5432(portdic)+p3389(portdic)+p7001(portdic)+p7002(portdic)+p8009(portdic)+p6378(portdic)+p50070(portdic)+p50030(portdic)+p2181(portdic)+p2375(portdic)+p2376(portdic)+p2379(portdic)+p2380(portdic)+p2377(portdic)+p2378(portdic)+p2379(portdic)+p2380(portdic)+p2377(portdic)+p2378(portdic)+p2379(portdic)+p2380(portdic)+p2377(portdic)+p2378(portdic)+p2379(portdic)+p2380(portdic)+p2377(portdic)+p2378(portdic)+p2379(portdic)+p2380(portdic)+p2377(portdic)+p2378(portdic)+p2379(portdic)+p2380(portdic)+p2377(portdic)+p2378(portdic)+p2379(portdic)+p2380(portdic)
    resultreport(iplist,alivelist,portdic,vullist)
```