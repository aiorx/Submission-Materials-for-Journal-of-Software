
// proclore.c

/*
Code initially Written with routine coding tools : https://chatgpt.com/share/35bfdeb0-151c-4111-bc8e-cfac26358a07
prompt : proclore is used to obtain information regarding a process. If an argument is missing, print the information of your shell.
        Information required to print :
        pid ,Process Status (R/R+/S/S+/Z), Process group, Virtual Memory, Executable path of process
*/
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include "constants.h"
#define PID_LIMIT 10 // enough for 64 bit machines
int proclore(char** tokens) {
    char path[256];
    char buffer[1024];
    FILE *fp;
    int pid;
    if(tokens[1] == NULL){
        pid = getpid();
    }else {
        int ij = 0;
        for(ij=0;tokens[1][ij]!='\0';ij++){
            
            if(tokens[1][ij]<'0' || '9'<tokens[1][ij] || ij>PID_LIMIT){ // check if pid valid
                fprintf(stderr, ""RED"proclore: please enter valid pid\n"RESET"");
                return 1;
            }
        }
        pid = atoi(tokens[1]);
        
    }
    // Construct the path to the /proc/[pid]/status file
    snprintf(path, sizeof(path), "/proc/%d/status", pid);

    // Open the status file
    fp = fopen(path, "r");
    if (fp == NULL) {
        //perror(""RED"fopen"RESET"");
        fprintf(stderr, ""RED"proclore: No such process\n"RESET"");
        return 1;
    }

    // Initialize variables to store process information
    char process_status = '\0';
    int process_group = -1;
    unsigned long virtual_memory = 0;

    // Read the status file line by line
    while (fgets(buffer, sizeof(buffer), fp)) {
        if (strncmp(buffer, "State:", 6) == 0) {
            process_status = buffer[7];
        } else if (strncmp(buffer, "Tgid:", 5) == 0) {
            sscanf(buffer + 5, "%d", &process_group);
        } else if (strncmp(buffer, "VmSize:", 7) == 0) {
            sscanf(buffer + 7, "%lu", &virtual_memory);
        }
    }

    fclose(fp);

    // Construct the path to the /proc/[pid]/exe symbolic link
    snprintf(path, sizeof(path), "/proc/%d/exe", pid);
    ssize_t len = readlink(path, buffer, sizeof(buffer) - 1);
    if (len == -1) {
        perror(""RED"readlink"RESET"");
        return 1;
    }

    buffer[len] = '\0';  // Null-terminate the string

    // Print the process information
    printf("PID: %d\n", pid);
    printf("Process Status: %c\n", process_status);
    printf("Process Group ID: %d\n", process_group);
    printf("Virtual Memory (kB): %lu\n", virtual_memory);
    printf("Executable Path: %s\n", buffer);

    return 0;
}
/* 
int main(int argc, char *argv[]) {
    int pid;

    if (argc == 2) {
        pid = atoi(argv[1]);
    } else {
        pid = getpid();  // Get the current shell's PID if no argument is provided
    }

    proclore(pid);

    return 0;
}
 */
