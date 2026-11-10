void LoadDisplay(struct Node *node) {
    int count = 0; // Count to keep track of the number of elements printed in a row
    int countFKeys = 0;
    printf("\tC1\tC2\tC3\tC4\tC5\tC6\tC7\n");
    while (node != NULL) {
        count++;
        printf("\t[]");
        // If 7 elements have been printed, start a new line - This was help Derived using common development resources
        if (count % 7 == 0)
            printf("\n");

        node = node->next;

    }

    printf("\n");
}