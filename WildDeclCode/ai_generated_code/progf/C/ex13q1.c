//Author-rehaan sharma
//Cmput 201 lab 13 section D07
// references used;https://stackoverflow.com/questions/26409648/how-to-compile-a-c-program-with-make-on-mac-os-x-terminal
//https://stackoverflow.com/questions/26409648/how-to-compile-a-c-program-with-make-on-mac-os-x-terminal

//all my comments are from github copilot
//but gave all refernces manually used
//used a lot of internet resources

#include "ex13q1.h"//header file containing function prototypes and macros

#include <stdio.h>//standard input output library

#include <stdlib.h>// 
#include <string.h>//string manipulation

void initializeSets() {//first function to initialize the sets
    for (int i = 0; i <= MAX_STUDENTS; i++) {//max sutdents is 2 million
        parent[i] = i; 
    }
}

int findSet(int student) {
    // printf("Parent = %d, Student = %d\n", parent[student], student);
    if (parent[student] != student) {//if the parent is not the student
        parent[student] = findSet(parent[student]);//find the parent of the student
    }
    return parent[student];//return the parent of the student
}

void unionSets(int student1, int student2) {//union function
    int set1 = findSet(student1);//find the parent of student 1
    int set2 = findSet(student2);//find the parent of student 2

    if (set1 != set2) {//if the parents are not the same
        parent[set1] = set2;//set the parent of set 1 to set 2
    }
}
//https://www.tutorialspoint.com/cprogramming/c_command_line_arguments.htm
//reference for command lines arguement array called argv
int main(int argc, char *argv[]) {//main function
    if (argc != 4) { // check if arguments are provided
        exit(1);//exit if not
    }
    #ifdef FASTIO// as given in the lab
    //https://www.tutorialspoint.com/c_standard_library/c_function_atoi.htm
    //reference for atoi function
    //took a bit of help from the internet for this part including chatgpt
    int n = atoi(argv[1]); // number of lines in the input file
    char* buff = (char*)malloc(n*2); // x2 because of for ever char there's a newline
    #endif//end of if statement
    // int k = atoi(argv[2]); // number of students graduating from 201
    char *f = argv[3];//file name

    // Open file
    FILE *file = fopen(f, "r");//open the file
    if (file == NULL) {//if the file is null
        exit(1);//exit
    }
    char statement;//statement
    int x;//x
    int y;//    
    int buffIndex = 0;//buffer index

    initializeSets();//initialize the sets
    // Parse file
   // Loop through the input file and read statements until the end of the file is reached
while (fscanf(file, " %c %d %d", &statement, &x, &y) != EOF) {
    // Check if the current statement is a 'join' operation ('j')
    if (statement == 'j') {
        // If it is a 'join' operation, union the sets to which x and y belong
        unionSets(x, y);
    } 
    // Check if the current statement is a 'query' operation ('?')
    else if (statement == '?') {
        // If it is a 'query' operation, check if the sets of x and y have the same parent
        if (findSet(x) == findSet(y)) {
            #ifdef FASTIO
            // If using FASTIO, append 'T' (true) to the buffer and move the buffer index
            buffIndex += sprintf(buff + buffIndex, "T\n");
            #elif EASYIO
            // If using EASYIO, print 'T' (true) directly to the console
            printf("T\n");
            #endif
        } else {
            #ifdef FASTIO
            // If using FASTIO, append 'F' (false) to the buffer and move the buffer index
            buffIndex += sprintf(buff + buffIndex, "F\n");
            #elif EASYIO
            // If using EASYIO, print 'F' (false) directly to the console
            printf("F\n");
            #endif
        }
    }
}

    

    #ifdef FASTIO//as given in the lab
    printf("%s", buff);//print the buffer   
    free(buff);//free the buffer
    #endif//end of if statement


    fclose(file);//closing the file
}

//https://learn.microsoft.com/en-us/cpp/preprocessor/hash-ifdef-and-hash-ifndef-directives-c-cpp?view=msvc-170