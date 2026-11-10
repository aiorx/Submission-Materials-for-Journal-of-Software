```c
bool do_exec_redirect(const char *outputfile, int count, ...)
{
    va_list args;
    va_start(args, count);
    char * command[count+1];
    int i;
    for(i=0; i<count; i++)
    {
        command[i] = va_arg(args, char *);
    }
    command[count] = NULL;

    
    // this line is to avoid a compile warning before your implementation is complete
    // and may be removed
 //   command[count] = command[count];


/*
 * TODO
 *   Call execv, but first using https://stackoverflow.com/a/13784315/1446624 as a refernce,
 *   redirect standard out to a file specified by outputfile.
 *   The rest of the behaviour is same as do_exec()
 *
*/

   if(check_abs_path(command[0])==false)
    {
        syslog(LOG_ERR, "Path must be an absolute path \n");
        va_end(args);
        return false;
    }
    pid_t pid = fork();
    if(pid==0)
    {
    // Open the output file for writing, create if it doesn't exist, truncate to zero length
    int fd = open(outputfile, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) {
        perror("open failed");
        _exit(EXIT_FAILURE);
    }
     //Lines 241 to 245 are partially Aided using common development resources using the search "redirecting standard out to a file specified by outputfile"
    // Redirect stdout (file descriptor 1) to the file
    if (dup2(fd, STDOUT_FILENO) == -1)
     {
        perror("dup2 failed");
        close(fd);
        _exit(EXIT_FAILURE);
    }

        // Close the file descriptor since it's now duplicated to stdout
        close(fd);
        execv(command[0],command);
        perror("execv failed");
        _exit(EXIT_FAILURE);
    }
    else if(pid==-1)
    {
        perror("fork failed");
        va_end(args);
        return false;
    }
    else
    {
        int wait_status;
        if(waitpid(pid,&wait_status,0)==-1)
        {
            syslog(LOG_ERR,"waitpid failed\n");
            va_end(args);
            return false;
        }
        if(WIFEXITED(wait_status) )
        {
            if(WEXITSTATUS(wait_status) == 0)
            {
                va_end(args);
                return true;
            }
            else{
                va_end(args);
                return false;
            }
        }
    }
    va_end(args);

    return true;
}
```