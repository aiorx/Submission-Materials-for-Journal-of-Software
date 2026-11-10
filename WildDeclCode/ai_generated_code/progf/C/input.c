//input.c


/*Modified code initially Produced via common programming aids
https://chatgpt.com/share/35bfdeb0-151c-4111-bc8e-cfac26358a07 - first prompt
*/

#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <signal.h>
#include "constants.h"
#include "hop.h"
#include "pwd.h"
#include "reveal.h"
#include "proclore.h"
#include "log.h"
#include "seek.h"
#include "alias.h"
#include "activities.h"
#include "ping.h"
#include "iman.h"
#include "pipe.h"
#include "fgbg.h"
#include "neonate.h"

char *read_input(){
    char *input = malloc(MAX * sizeof(char));
    if(!input){
        fprintf(stderr, "allocation error\n");
        exit(EXIT_FAILURE);
    }

    if(fgets(input, MAX, stdin) == NULL){
        if(feof(stdin)){
            exit(EXIT_SUCCESS);  // EOF, exit shell
        }
        else{
            perror("read_input");
            exit(EXIT_FAILURE);
        }
    }

    return input;
}

char** tokenise_input(char* X){
    char* token;
    char** tokens = (char**)malloc(MAX*sizeof(char*));
    token=strtok(X, TOKEN_DELIMITERS);
    int count=0;
    while(token != NULL){
        tokens[count] = token;

        count++;
        //printf("%dth loop\n",count++); --debug
        //printf("%s\n",token);        
        token=strtok(NULL, TOKEN_DELIMITERS);
    }
    tokens[count] = NULL;
    return tokens;
}

int execute_command(char** tokens, char* homedir, char** ptrprevdir, char* input, AliasList* aliases, int expand_alias_flag, pid_t shell_pid);



int RUN_command(char** tokens, char* homedir, char** ptrprevdir, char* input, AliasList* aliases, int expand_alias_flag, pid_t shell_pid){
    if(there_are_pipes(tokens)<0){
        fprintf(stderr, ""RED"Invalid use of pipe"RESET"\n");
        return 1;
    }
    else if(there_are_pipes(tokens)){
        //printf("Send to handle pipes\n");  --debug
        execute_piped_commands(tokens, homedir, ptrprevdir, input, aliases, expand_alias_flag, shell_pid);
        //printf("Send to handle pipes:: RETURNED\n");
        return 0;
    }
    int ER = execute_command(tokens, homedir, ptrprevdir, input, aliases, expand_alias_flag, shell_pid);
    return ER; // ONAMANAPEAIA LINE OOO
}


void handle_sigchld() {
    // Wait for all dead child processes
    while (waitpid(-1, NULL, WNOHANG) > 0);
}

    
int execute_command(char** tokens, char* homedir, char** ptrprevdir, char* input, AliasList* aliases, int expand_alias_flag, pid_t shell_pid){
    if(tokens[0]==NULL) return 0;
    //printf("inside\n");
    int bg_flag=0;
    int loc=0;
    int saved_stdin, saved_stdout;

    // Save the original file descriptors for stdin and stdout
    saved_stdin = dup(STDIN_FILENO);
    saved_stdout = dup(STDOUT_FILENO);

    if(expand_alias_flag){
        for (int i = 0; i < aliases->alias_count; i++) { // check for aliases
            if (strcmp(aliases->element[i].alias, tokens[0]) == 0) {
                char** newtokens = use_alias(tokens, input, aliases, i);
                int errco = execute_command(newtokens, homedir, ptrprevdir, input, aliases, 0, shell_pid);
                dup2(saved_stdin, STDIN_FILENO);
                dup2(saved_stdout, STDOUT_FILENO);
                close(saved_stdin);
                close(saved_stdout);
                return errco;
            }
        }
    }
    for(int i=0; tokens[i] != NULL; i++){
        if(strcmp(tokens[i], ";")==0){
            // replace first semicolon with NULL
            // and execute the tokens before it
            // and then recursively apply execute to the rest of the tokens
            tokens[i]=NULL; 
            execute_command(tokens, homedir, ptrprevdir, input, aliases, 1, shell_pid); 
            execute_command(tokens+i+1, homedir, ptrprevdir, input, aliases, 1, shell_pid);
            return 0;
        }
    }
    for(int i=0; tokens[i] != NULL; i++){
        if(strchr(tokens[i], '&')){
            if(strcmp(tokens[i], "&")==0){
                if(tokens[i+1]!=NULL){
                    fprintf(stderr, ""RED"unexpected token '&'"RESET"\n");
                    dup2(saved_stdin, STDIN_FILENO);
                    dup2(saved_stdout, STDOUT_FILENO);
                    close(saved_stdin);
                    close(saved_stdout);
                    return 1;
                }
                tokens[i] = NULL;
                bg_flag = 1;
            }
            else{
                fprintf(stderr, ""RED"invalid use of '&'"RESET"\n");
                dup2(saved_stdin, STDIN_FILENO);
                dup2(saved_stdout, STDOUT_FILENO);
                close(saved_stdin);
                close(saved_stdout);
                return 1;
            }
        }
    }
    int is_redirec = handle_redirection(tokens);
    if(strcmp(tokens[0], "alias")==0){
        alias(tokens, aliases);
    }
    else if(strcmp(tokens[0],"hop")==0){
        char cwd[MAX];
        getcwd(cwd, MAX);
        if(hop(tokens, homedir, *ptrprevdir) == 0){
            if(strcmp(*ptrprevdir,"NULL")==0){
                *ptrprevdir = (char*)malloc(MAX*sizeof(char));
            }
            strcpy(*ptrprevdir, cwd);
        }
    }else if(strcmp(tokens[0], "pwd")==0){
        pwd();
        printf("\n"); // goto nextline
    }else if(strcmp(tokens[0], "reveal")==0){
        reveal(tokens, homedir, *ptrprevdir);
    }else if(strcmp(tokens[0], "proclore")==0){
        proclore(tokens);
    }
    else if(strcmp(tokens[0], "log")==0){
        log_func(tokens, homedir, ptrprevdir, input, aliases, shell_pid);
    }
    else if(strcmp(tokens[0], "seek")==0){
        seek(tokens, homedir);
    }
    else if(strcmp(tokens[0], "activities")==0){
        activities();        
    }
    else if(strcmp(tokens[0], "ping")==0){
        ping(tokens);
    }
    else if(strcmp(tokens[0], "iMan")==0){
        iman(tokens);
    }
    else if(strcmp(tokens[0], "fg")==0){
        fg(tokens);
    }
    else if(strcmp(tokens[0], "bg")==0){
        bg(tokens);
    }
    else if(strcmp(tokens[0], "neonate")==0){
        neonate(tokens);
    }
    else{
        struct sigaction sa;
        sa.sa_handler = &handle_sigchld;
        sa.sa_flags = SA_RESTART | SA_NOCLDSTOP;
        sigemptyset(&sa.sa_mask);
        if (sigaction(SIGCHLD, &sa, NULL) == -1) {
            perror("sigaction");
            exit(1);
        }
        //printf("make new child\n");
        int pid = fork();
        if(pid<0){
            fprintf(stderr, ""RED" Failed to run command (fork failed)"RESET"");
            return 1;
        }else if(pid==0){
            if(bg_flag) setpgid(0, 0);
            if(execvp(tokens[0], tokens) == -1){
                fprintf(stderr, ""RED"INVALID COMMAND"RESET"\n");
                return -1;
            }
            exit(1);
        }else if(pid>0){
            if(bg_flag){
                printf("Process running in background with PID: %d\n", pid);
            }else{
                int status;
                waitpid(pid, &status, 0);
            }
        }
    }
    dup2(saved_stdin, STDIN_FILENO);
    dup2(saved_stdout, STDOUT_FILENO);
    close(saved_stdin);
    close(saved_stdout);


    return 0;
}

