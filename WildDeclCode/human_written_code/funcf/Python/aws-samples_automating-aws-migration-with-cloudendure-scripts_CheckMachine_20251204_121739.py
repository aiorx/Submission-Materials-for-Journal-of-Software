```python
def status(session, headers, endpoint, HOST, project_id, configfile, launchtype, dryrun):
    if launchtype == "test" or launchtype == "cutover":
       with open(os.path.join(sys.path[0], configfile), 'r') as ymlfile:
            config = yaml.load(ymlfile)
    machine_status = 0
    m = requests.get(HOST + endpoint.format('projects/{}/machines').format(project_id), headers=headers, cookies=session)
    for i in range(1, config["project"]["machinecount"]+1):
        index = "machine" + str(i)
        machine_exist = False
        for machine in json.loads(m.text)["items"]:
           if config[index]["machineName"] == machine['sourceProperties']['name']:
              machine_exist = True
              # Check if replication is done
              if 'lastConsistencyDateTime' not in machine['replicationInfo']:
                  print("ERROR: Machine: " + machine['sourceProperties']['name'] + " replication in progress, please wait for a few minutes....")
                  sys.exit(1)
              else:
                  # check replication lag
                  a = int(machine['replicationInfo']['lastConsistencyDateTime'][11:13])
                  b = int(machine['replicationInfo']['lastConsistencyDateTime'][14:16])
                  x = int(datetime.datetime.utcnow().isoformat()[11:13])
                  y = int(datetime.datetime.utcnow().isoformat()[14:16])
                  result = (x - a) * 60 + (y - b)
                  if result > 180:
                      print("ERROR: Machine: " + machine['sourceProperties']['name'] + " replication lag is more than 180 minutes....")
                      print("- Current Replication lag for " + machine['sourceProperties']['name'] + " is: " + str(result) + " minutes....")
                      sys.exit(6)
                  else:
                    # Check dryrun flag and skip the rest of checks
                    if dryrun == "Yes":
                       machine_status += 1
                    else:
                       # Check if the target machine has been tested already
                        if launchtype == "test":
                            if 'lastTestLaunchDateTime' not in machine["lifeCycle"] and 'lastCutoverDateTime' not in machine["lifeCycle"]:
                                machine_status += 1
                            else:
                                print("ERROR: Machine: " + machine['sourceProperties']['name'] + " has been tested already....")
                                sys.exit(2)
                        # Check if the target machine has been migrated to PROD already
                        elif launchtype == "cutover":
                            if 'lastTestLaunchDateTime' in machine["lifeCycle"]:
                                if 'lastCutoverDateTime' not in machine["lifeCycle"]:
                                    machine_status += 1
                                else:
                                    print("ERROR: Machine: " + machine['sourceProperties']['name'] + " has been migrated to PROD already....")
                                    sys.exit(3)
                            else:
                                print("ERROR: Machine: " + machine['sourceProperties']['name'] + " has not been tested yet....")
                                sys.exit(4)
        if not machine_exist:
            print("ERROR: Machine: " + config[index]["machineName"] + " does not exist in the project....")
            sys.exit(5)
    return machine_status
```