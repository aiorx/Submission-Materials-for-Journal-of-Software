```c
for (; fgets(line, sizeof(line), p) != NULL; counter++) {
    if (strchr(line, ';') != NULL) {
        char *token = strtok(line, ";");
        fprintf(f, "%s\n", token);
        token = strtok(NULL, ";");
        token = token + 1;
        fprintf(f, "%s", token);
        counter++;
        count++;
        continue;
    }
    fprintf(f, "%s", line);
}
```