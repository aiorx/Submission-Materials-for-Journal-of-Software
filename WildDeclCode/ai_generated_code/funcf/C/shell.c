void ps_command(pid_t shell_pid){
    // This is Assisted using common GitHub development utilities
    DIR *proc_dir;
    struct dirent *entry;
    process_info shell_info, child_info;

    print_process_info_header();

    // Get shell process info
    get_process_info(shell_pid, &shell_info);
    print_process_info(&shell_info);

    proc_dir = opendir("/proc");
    if(proc_dir){
        while((entry = readdir(proc_dir)) != NULL){
            pid_t pid = atoi(entry->d_name);
            if(pid > 0){
                char path[MAX_PATH];
                snprintf(path, sizeof(path), "/proc/%d/status", pid);
                FILE *file = fopen(path, "r");
                if(file){
                    char *line = NULL;
                    size_t len = 0;
                    while(getline(&line, &len, file) != -1){
                        if (strncmp(line, "PPid:", 5) == 0) {
                            pid_t ppid = atoi(line + 5);
                            if (ppid == shell_pid && pid != shell_pid) {
                                get_process_info(pid, &child_info);
                                print_process_info(&child_info);
                            }
                            break;
                        }
                    }
                    fclose(file);
                }
            }
        }
    }
}