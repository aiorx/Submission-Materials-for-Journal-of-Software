/* cat [file] : view contents of file
 * mkdir [name] : create folder called name
 * cp [source] [dest] : copy source into dest
 * mv [source] [dest] : move source into dest (deletes original)
 * rm [file] : removes file
 * ls : view files/directories in current directory
 * cd : change directory
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_NAME_LENGTH 20

#define GREEN	"\x1B[32m"
#define BLUE	"\x1B[34m"
#define RESET	"\x1B[0m"

struct File {
	char name[MAX_NAME_LENGTH];
	char contents[1000];
};

struct Directory {
	char name[MAX_NAME_LENGTH];
	struct File* files;
	struct SubdirectoryNode* subdirectories;
};

struct SubdirectoryNode {
	struct Directory* subdirectory;
	struct SubdirectoryNode* next;
};

struct File* createFile(const char* name) {
	struct File* newFile = (struct File*)malloc(sizeof(struct File));
	if (newFile == NULL) {
	}
	strncpy(newFile->name, name, MAX_NAME_LENGTH - 1);
	newFile->name[MAX_NAME_LENGTH - 1] = '\0';
	//newFile->contents = "";
}

struct Directory* createDirectory(const char* name) {
	struct Directory* newDir = (struct Directory*)malloc(sizeof(struct Directory));
	if (newDir == NULL) {
	}
	strncpy(newDir->name, name, MAX_NAME_LENGTH - 1);
	newDir->name[MAX_NAME_LENGTH - 1] = '\0';
	newDir->files = NULL;
	newDir->subdirectories = NULL;
	return newDir;
}

struct Directory* getDir(struct Directory* currentDir, char* path) {
	if (currentDir->subdirectories == NULL) {
	}
	int current;
	char *name = strtok(path, "/");
	printf("%s", name);
}


char *cd(struct Directory* initial, struct Directory* endPoint) {
	/* Set up a file system...
	 * Each folder has other folders, etc.
	 * Err if dir does not exist
	 */
}

char ls(struct Directory* currentDir) {
	if (currentDir->subdirectories == NULL) {
		return '\0';
	}
	if (currentDir->files == NULL) {
		return '\0';
	}
	printf("%s ", currentDir->subdirectories->subdirectory->name);
	printf("%s ", currentDir->files->name);
}

char cat(struct Directory* currentDir, char *instruction, char *extra) {
	if (instruction == ">") {
		currentDir->files = createFile(extra);
	}
	if (instruction == currentDir->files->name && extra == NULL) {
	}
}

/* Try to understand... thanks ChatGPT! */
void mkdir(struct Directory* currentDir, struct Directory* subdir) {
	/* Create new subdirectory */
	struct SubdirectoryNode* newSubdir = (struct SubdirectoryNode*)malloc(sizeof(struct SubdirectoryNode));
	/* If a new subdirectory isn't being created... */
	if (newSubdir == NULL) {
	}
	/* Add new subdirectory to the linked 'node' list */
	newSubdir->subdirectory = subdir;
	/* Set the next value in the list to NULL */ 
	newSubdir->next = NULL;
	/* If the list is currently empty... */
	if (currentDir->subdirectories == NULL) {
		/* Add new subdirectory to current Directory */
		currentDir->subdirectories = newSubdir;
	} 
	else {
		/* Current = head of linked list */
		struct SubdirectoryNode* current = currentDir->subdirectories;
		/* While there are still subdirectories... */
		while(current->next != NULL) {
			/* Push current value down to the end of the list */
			current = current->next;
		}
		/* New subdirectory is now the last value */
		current->next = newSubdir;
	}
}	

int main() {
	char command[6];
	char instruct[100];
	char name[MAX_NAME_LENGTH];
	struct Directory* currentDir = createDirectory("/");
	currentDir->subdirectories->subdirectory = createDirectory("usr");

	printf("Shell\n");
	while (1) {
		printf(GREEN "\nname@host" RESET ":" BLUE "%s" RESET "$ ", currentDir->name);
		scanf("%s", command);
		if (strcmp(command, "cd") == 0) {
			/* Actually change directory! */
			char *dirMove;
			scanf("%s", dirMove);
			getDir(currentDir, dirMove);
			//struct Directory dirMove = getDir(currentDir, dirMove);
			//cd(currentDir, dirMove);
		}
		else if (strcmp(command, "ls") == 0) {
			ls(currentDir);
		}
		else if (strcmp(command, "cat") == 0) {
			scanf("%s %s", instruct, name);
			cat(currentDir, instruct, name);
		}
		else if (strcmp(command, "mkdir") == 0) {
			scanf("%s", name);
			struct Directory* subDir = createDirectory(name);
			mkdir(currentDir, subDir);
		}
		else {
			printf("%s: command not found", command);
		}
	}
}
