#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// NOTE: this is a OVERLY, OVERLY, OVERLY simplidfied version of a rope, this is
// just for concatenating strings
#define MAX_STRING_LENGTH 100

struct RopeNode {
    char str[MAX_STRING_LENGTH];
    struct RopeNode *left;
    struct RopeNode *right;
};

struct Rope {
    struct RopeNode *root;
};

// Creates a new rope node
struct RopeNode *createRopeNode(const char *str) {
    struct RopeNode *newNode =
        (struct RopeNode *)malloc(sizeof(struct RopeNode));
    // check if malloc failed
    if (newNode == NULL) {
        printf("Memory allocation failed.\n");
        exit(1);
    }
    strncpy(newNode->str, str, MAX_STRING_LENGTH);
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

// Creates a new `Rope` data structure
struct Rope *createRope(const char *str) {
    struct Rope *newRope = (struct Rope *)malloc(sizeof(struct Rope));
    // check if malloc failed
    if (newRope == NULL) {
        printf("Memory allocation failed.\n");
        exit(1);
    }
    newRope->root = createRopeNode(str);
    return newRope;
}

// Concatenates two ropes in a constant time
struct Rope *concatenate(struct Rope *leftRope, struct Rope *rightRope) {
    struct Rope *newRope = createRope("");
    newRope->root->left = leftRope->root;
    newRope->root->right = rightRope->root;
    return newRope;
}

// Helper function to print the rope
void printRopeNode(struct RopeNode *rope) {
    if (rope != NULL) {
        printRopeNode(rope->left);
        printf("%s", rope->str);
        printRopeNode(rope->right);
    }
}

// Prints the whole rope
void printRope(struct Rope *rope) {
    printRopeNode(rope->root);
    printf("\n");
}

// main Aided using common development resources
int main() {
    // Create some sample ropes
    const char *str1 = "Hello, ";
    const char *str2 = "world! ";
    const char *str3 = "This is some test";

    // Create ropes for each string
    struct Rope *rope1 = createRope(str1);
    struct Rope *rope2 = createRope(str2);
    struct Rope *rope3 = createRope(str3);

    // Concatenate the ropes
    struct Rope *rope = concatenate(rope1, rope2);
    // Print the contents of the rope
    printRope(rope);

    // Concatenate the ropes
    rope = concatenate(rope, rope3);
    // Print the contents of the rope
    printRope(rope);

    // Free memory
    free(rope1->root);
    free(rope1);
    free(rope2->root);
    free(rope2);
    free(rope3->root);
    free(rope3);
    free(rope->root);
    free(rope);

    return 0;
}
