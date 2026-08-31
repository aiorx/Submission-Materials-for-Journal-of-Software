```c
/* execute command -------------------------------------------------------------
* execute command line by operating system shell
* args   : char   *cmd      I   command line
* return : execution status (0:ok,0>:error)
*-----------------------------------------------------------------------------*/
extern int execcmd(const char *cmd)
{
#ifdef WIN32
    PROCESS_INFORMATION info;
    STARTUPINFO si={0};
    DWORD stat;
    char cmds[1024];

    trace(3,"execcmd: cmd=%s\n",cmd);

    si.cb=sizeof(si);
    sprintf(cmds,"cmd /c %s",cmd);
    if (!CreateProcess(NULL,(LPTSTR)cmds,NULL,NULL,FALSE,CREATE_NO_WINDOW,NULL,
        NULL,&si,&info)) return -1;
    WaitForSingleObject(info.hProcess,INFINITE);
    if (!GetExitCodeProcess(info.hProcess,&stat)) stat=-1;
    CloseHandle(info.hProcess);
    CloseHandle(info.hThread);
    return (int)stat;
#else
    trace(3,"execcmd: cmd=%s\n",cmd);

    return system(cmd);
#endif
}
```