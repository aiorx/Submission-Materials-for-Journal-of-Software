// log.c

/*Written with routine coding tools https://chatgpt.com/share/35bfdeb0-151c-4111-bc8e-cfac26358a07  (2nd last prompt)
prompt: I literally just pasted the rest of my files and politely asked it to implement a history

*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include "constants.h"
#include "log.h"
#include "input.h"
#include "alias.h"
#include "utils.h"


int log_func(char** tokens, char* homedir, char** ptrprevdir, char* input, AliasList* aliases, pid_t shell_pid){
    char* history_file = pre_process_path(HISTORY_FILE, homedir);
    if(tokens[1] == NULL){
        print_history(history_file);
    }
    else if(strcmp(tokens[1], "purge")==0){
        clear_history(history_file);
    }
    else if(strcmp(tokens[1], "execute")==0){
        int index = atoi(tokens[2]);
        execute_history_command(index, homedir, ptrprevdir, input, history_file, aliases, shell_pid);
    }
    return 0;

}

void execute_history_command(int index, char* homedir, char** ptrprevdir, char* input, char* history_file, AliasList* aliases, pid_t shell_pid){
    FILE *fptr = fopen(history_file, "r");
    if (!fptr) {
        perror("Failed to open history file");
        return;
    }

    char buffer[MAX];
    int count = 0;
    while (fgets(buffer, MAX, fptr)) {
        if (++count == index) {
            buffer[strcspn(buffer, "\n")] = 0; // Remove newline
            // Execute command
            char **args = tokenise_input(buffer);
            execute_command(args, homedir, ptrprevdir, input, aliases, 1, shell_pid);
            free(args);
            break;
        }
    }
    fclose(fptr);
}

void update_history(char* command, char* history_file) {
    command[strlen(command)-1]=0;
    if (is_log_command(command)) return; // do not update history

    FILE *fptr = fopen(history_file, "r+");
    if (!fptr) {
        fptr = fopen(history_file, "w");
        if (!fptr) {
            perror("Failed to open history file");
            return;
        }
    }

    char history[MAX_HISTORY][MAX];
    int count = 0;
    while (fgets(history[count], MAX, fptr) && count < MAX_HISTORY) {
        history[count][strcspn(history[count], "\n")] = 0; // Remove newline
        count++;
    }
    fclose(fptr);

    // printf("last command:%s:\npresent command:%s:\nequality is %d\n",history[count - 1], command, strcmp(history[count - 1], command) == 0);
    if (count > 0 && strcmp(history[count - 1], command) == 0) {
        // Don't store duplicate command
        //printf("Do not duplicate\n");
        return;
    }

    fptr = fopen(history_file, "w");
    int start = (count >= MAX_HISTORY) ? 1 : 0;
    for (int i = start; i < count; i++) {
        fprintf(fptr, "%s\n", history[i]);
    }
    fprintf(fptr, "%s", command);
    fclose(fptr);
}

void print_history(char* history_file) {
    FILE *fptr = fopen(history_file, "r");
    if (!fptr) {
        perror("Failed to open history file");
        return;
    }

    char buffer[MAX];
    int count = 0;
    while (fgets(buffer, MAX, fptr)) {
        printf("%d %s", count + 1, buffer);
        count++;
    }
    printf("\n");
    fclose(fptr);
}

void clear_history(char* history_file) {
    FILE *fptr = fopen(history_file, "w");
    if (fptr) {
        fclose(fptr);
    }
}


int is_log_command(const char* command) {
    if(strcmp(command, "log")==0) return 1;
    return strstr(command, "log ") != NULL;
}

