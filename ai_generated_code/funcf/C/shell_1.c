```c
int execute_prefix(char *prefix)
{
    for (int i = (int)vector_size(current_process->previous_commands) - 1; i >= 0; i--) // Github Copilot generated this for loop and its contents.
    {
        if (strncmp(prefix, (char *)vector_get(current_process->previous_commands, (size_t)i), strlen(prefix)) == 0)
        {
            print_command((char *)vector_get(current_process->previous_commands, (size_t)i));
            execute_command((char *)vector_get(current_process->previous_commands, (size_t)i));
            return 0;
        }
    }

    print_no_history_match();
    return 1;
}
```

```c
if (current_process->input_file) // Github Copilot helped do this.
{
    int fd = open(current_process->input_file, O_RDONLY);
    if (fd == -1)
    {
        print_redirection_file_error();
        exit(1);
    }
    if (dup2(fd, STDIN_FILENO) == -1)
    {
        print_redirection_file_error();
        exit(1);
    }
    close(fd);
}
```

```c
// Similar process but we are going to /proc/pid/stat
sprintf(path, "/proc/%d/stat", info->pid);
file = fopen(path, "r");
getline(&line, &len, file);
char *token = strtok(line, " ");
for (int i = 1; i < 23; i++)
{
    if (i == 3)
    {
        info->state = token[0];
    }
    if (i == 14)
    {
        long time_seconds = atol(token) / sysconf(_SC_CLK_TCK);
        struct tm *time_since_start = gmtime(&time_seconds);
        char buffer[26];
        time_struct_to_string(buffer, 26, time_since_start);
        info->time_str = strdup(buffer);
        // info->time_str = strdup(token);
    }
    if (i == 22)
    {
        struct sysinfo sys_info; // Github Copilot helped me to fix my time by adding the boot_time logic.
        sysinfo(&sys_info);
        time_t boot_time = time(NULL) - sys_info.uptime;
        // convert the start time to a human readable format
        time_t start_time = boot_time + atol(token) / sysconf(_SC_CLK_TCK);
        struct tm *tm_info = localtime(&start_time);
        char buffer[26];
        time_struct_to_string(buffer, 26, tm_info);
        info->start_str = strdup(buffer);
    }
    token = strtok(NULL, " ");
}
fclose(file);
```