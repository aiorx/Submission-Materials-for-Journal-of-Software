```python
def ARPScanInterface(name, ip, iplen, lis, max_time_per_interface = 10, verbose=False):
    """Parallelizable arp-scan on a certain interface

    :param name: name of the interface
    :param ip: ip address
    :param iplen: ip mask
    :param max_time_per_interface: max time spent scanning on the interface in seconds
    :param lis: a common multiprocess-protected list where several processes can append
    :param verbose: (bool) be verbose or not

    Returns a list of ArpRTSPScanResult objects
    """
    ip_mac_pattern = re.compile(r'(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)\s+([0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2})')
    # .. thanks chatgpt!
    comst = f"arp-scan -g -retry=2 --interface={name} {ip}/{iplen}" # e.g. eno1 192.168.30.149/24
    # verbose = True
    if verbose: print("ARPScanInterface: starting for", comst)
    stdout = ""
    # as per: https://stackoverflow.com/questions/12419198/python-subprocess-readlines-hangs
    # the ONLY way to read process output on-the-fly
    master_fd, slave_fd = pty.openpty()
    # signal.alarm(max_time_per_interface) # in secs
    try:
        proc = Popen(comst.split(), stdin=slave_fd, stdout=slave_fd, stderr=STDOUT, close_fds=True)
    except FileNotFoundError:
        print(f"No arp-scan found: install with 'sudo apt-get install arp-scan'.  You also need extra rights to run it: 'sudo chmod u+s /usr/sbin/arp-scan'")
        return []
    os.close(slave_fd)
    timecount = 0
    try:
        while 1:
            if timecount > max_time_per_interface:
                print(f"WARNING: arp-scan '{comst}' took more than {max_time_per_interface} secs - aborting")
                break        
            t0 = time.time()
            try:
                r, w, e = select.select([ master_fd ], [], [], 1)
                dt = time.time() - t0
                timecount += dt
                if verbose: print("timecount>", timecount)
                if master_fd in r:
                    data = os.read(master_fd, 512)
                else:
                    continue
            except OSError as e:
                if e.errno != errno.EIO:
                    raise
                break # EIO means EOF on some systems
            else:
                if not data: # EOF
                    break
                # if verbose: print('>' + repr(data))
                if verbose: print('>', data.decode("utf-8"))
                stdout += data.decode("utf-8")
    finally:
        os.close(master_fd)
        if proc.poll() is None:
            proc.kill()
        proc.wait()
    if proc.returncode > 0:
        print("arp-scan error:", stdout)
        print("You might need to grant extra rights with: 'sudo chmod u+s /usr/sbin/arp-scan'")
        return []

    lis_ = []
    for line in stdout.split("\n"):
        m = ip_mac_pattern.match(line)
        if (m is None) or (m.lastindex != 2):
                continue
        ip = m.group(1)
        mac = m.group(2)
        if verbose: print("ip, mac>", ip, mac)
        if verbose: print("ARPScanInterface: appending", ip)
        lis_.append(ArpRTSPScanResult(
            interface=name,
            mac=mac,
            ip=ip
        ))

    if verbose: print("ARPScanInterface: finished for", comst)

    if len(lis_) < 1:
        if verbose: print("ARPScanInterface: did not find anything")
    for l in lis_: # append to multiprocess-protected list
        lis.append(l)
    # return lis_
```