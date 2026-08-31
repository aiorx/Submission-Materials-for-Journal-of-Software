```python
def settings_menu():
    print("""
       {}{}{}Settings{}
       Download
       \t 1- User Agent
       \t 2- Up-to-Date Proxy
       
       Change
       \t 3- Site url 
       \t 4- Site port 
       \t 5- Number of threads(max:500) 
       \t 6- Current wordlist
       \t 7- Project name
       """.format(colors.BOLD, colors.OKBLUE, colors.UNDERLINE, colors.ENDC))

    choose = input("\nb- Back\nSettings | Choose\t: ")
    if choose == "1":
        func.Configuration.download("useragent")
    elif choose == "2":
        func.Configuration.download("proxy")
    elif choose == "3":
        func.Configuration.setUrl()
    elif choose == "4":
        func.Configuration.setPort()
    elif choose == "5":
        func.Configuration.setThreadNum()
    elif choose == "6":
        func.Configuration.selectWordlist()
    elif choose == "7":
        func.Configuration.isDirectoryExist()
    elif choose == "b":
        pass
    else:
        print("Try again...")
        sleep(1)
```