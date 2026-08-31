```c
void proclore(int pid_given, long int process_id){
	int pid;
	if(!pid_given){
		pid = getpid();
	}
	else{
		pid = process_id;
	}
    char stat_path[100];
    FILE *stat_file;
	
    snprintf(stat_path, sizeof(stat_path), "/proc/%d/stat", pid);

    stat_file = fopen(stat_path, "r");
    if (stat_file == NULL) {
        perror("Error opening stat file");
        return;
    }

    char stat_line[1024];
    if (fgets(stat_line, sizeof(stat_line), stat_file) == NULL) {
        perror("Error reading file");
        fclose(stat_file);
        return;
    }

    fclose(stat_file);

	// This line was taken Adapted from standard coding samples. There was a failed attempt by me to use strtok and I was short on time.
    char *token;
    char *saveptr;
    token = strtok_r(stat_line, " ", &saveptr);

	String process_group_id = (String)malloc(sizeof(char) * 50);
	String terminal_pgid_str = (String)malloc(sizeof(char) * 50);
	char addPlus[5];

	String process_status = (String)malloc(sizeof(char) * 50);
	String virtual_memory = (String)malloc(sizeof(char) * 50);
	String PID = (String)malloc(sizeof(char) * 50);

    int tokenCount = 0;
    while (token != NULL) {
        switch (tokenCount) {
            case 0:
				strcpy(PID, token);
                break;
            case 2:
				strcpy(process_status, token);
                break;
            case 4:
				strcpy(process_group_id, token);
                break;
            case 22:
				strcpy(virtual_memory, token);
                break;
        }

        token = strtok_r(NULL, " ", &saveptr);
        tokenCount++;
	}

	// If the process group matches the terminal's, it's in the foreground
	if (strcmp(terminal_pgid_str, process_group_id) == 0) {
		strcpy(addPlus, "(+)");
	} else {
		strcpy(addPlus, "");
	}

	printf("PID: %s\n", PID);
	printf("Process Status: %s\n", process_status);
	printf("Process Group: %s %s\n", process_group_id, addPlus);
	printf("Virtual Memory: %s\n", virtual_memory);
	
	char executable_path[PATH_LENGTH];
	String exec_file_path = (String)malloc(sizeof(char) * PATH_LENGTH);
	snprintf(exec_file_path, PATH_LENGTH, "/proc/%d/exe", pid);
	ssize_t len = readlink(exec_file_path, executable_path, sizeof(executable_path) - 1);
	if (len != -1) {
		executable_path[len] = '\0';
		printf("Executable Path: %s\n", executable_path);
	} else {
		perror("Error reading executable path");
		return;
	}

}
```