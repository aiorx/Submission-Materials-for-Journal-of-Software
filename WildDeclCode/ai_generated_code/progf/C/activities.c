/*
Code Produced via common programming aids
Look at the last prompt of the give link
https://chatgpt.com/share/35bfdeb0-151c-4111-bc8e-cfac26358a07
*/

#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<dirent.h>
#include<unistd.h>
#include<ctype.h>
#include "activities.h"
#include "constants.h"


// Function to get the parent process ID of a given process
ProcessIDetails* get_process_info(pid_t pid, pid_t *ppid, char *state, char *name) {
    
    char path[256];
    snprintf(path, sizeof(path), "%s/%d/%s", PROC_DIR, pid, STATUS_FILE);
    
    FILE *file = fopen(path, "r");
    if (!file){
        return NULL;  // Could not open file
    }
    
    //char* line = (char*)malloc(MAX_LINE_LENGTH*sizeof(char));  --- WHY DOES THIS NOT WORK ?????
    char line[MAX];
    while (fgets(line, sizeof(line), file)) {
        if (strncmp(line, "PPid:", 5) == 0) {
            *ppid = atoi(line + 6);  // Extract parent process ID
        } else if (strncmp(line, "State:", 6) == 0) {
            *state = line[7];  // Extract process state
        } else if (strncmp(line, "Name:", 5) == 0) {
            sscanf(line, "Name: %s", name);  // Extract process name
        }
    }
    ProcessIDetails* S = (ProcessIDetails*)malloc(1*sizeof(ProcessIDetails));
    //S[0]={pid, *ppid, *state, name};
    S->pid = pid;
    S->ppid = *ppid;
    S->state = *state;
    S->name = name;
    
    fclose(file);
    return S;
}

// Function to get the state as a string
const char* get_state_string(char state) {
    switch (state) {
        case 'R': return "Running";
        case 'S': return "Sleeping";
        case 'T': return "Stopped";
        default: return "Unknown";
    }
}

// __compar_fn_t' (aka 'int (*)(const void *, const void *)
int compare_processes(const void* A, const void* B){ // pass this into qsort
    ProcessInfo* procA = (ProcessInfo*)A;
    ProcessInfo* procB = (ProcessInfo*)B;
    return (procA->pid - procB->pid);
}



int activities(){
    pid_t shell_pid = getpid();  // Get the PID of this shell
    struct dirent *entry;
    DIR *dir = opendir(PROC_DIR);
    
    if (!dir) {
        perror("Unable to open /proc directory");
        return 1;
    }
    
    ProcessInfo child_PROCESSES[MAX];
    int process_count = 0;

    while ((entry = readdir(dir)) != NULL) {
        // Skip non-numeric directories in /proc
        if (!isdigit(entry->d_name[0])) {
            continue;
        }
        
        pid_t pid = atoi(entry->d_name);
        pid_t ppid;
        char state;
        char name[256];
        
        // Get process info for the given PID
        //if (get_process_info(pid, &ppid, &state, name) == S0) {// wut ??
        ProcessIDetails* procdetails = get_process_info(pid, &ppid, &state, name);
        if (procdetails != NULL){ // no error
            //printf("pid(%d,%d) ppid(%d,%d)\n", pid, procdetails->pid, ppid, procdetails->ppid); --debug lines
            if (ppid == shell_pid && process_count < MAX) {
                child_PROCESSES[process_count].pid = pid;
                strcpy(child_PROCESSES[process_count].name, name);
                child_PROCESSES[process_count].state = state;
                process_count++;
            }
        }
    }
    
    closedir(dir);
    
    // Sort processes by PID in lexicographical order
    qsort(child_PROCESSES, process_count, sizeof(ProcessInfo), compare_processes);
    
    // Print sorted processes
    for (int i = 0; i < process_count; i++) {
        printf("%d : %s - %s\n", child_PROCESSES[i].pid, child_PROCESSES[i].name, get_state_string(child_PROCESSES[i].state));
    }

    return 0;
}
/* 
int main(){
    int a = 1;
    int fd = fork();
    if(fd==0){
        while(1){
            a++;
            a--;
        }
    }
    fd = fork();
    if(fd==0){
        while(1){
            a++;
            a--;
        }
    }
    fd = fork();
    if(fd==0){
        while(1){
            a++;
            a--;
        }
    }
    activities();
    return 0;
} */