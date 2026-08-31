```c
while (fgets(line, filesize, fptr)) {
	// here to 4 lines below is Assisted with basic coding tools because new_item is fucking stupid (i know why it needs strdup, but WHY did they make it NEED strdup?????)
    line[strcspn(line, "\n")] = '\0'; // safely remove newline
	artn = malloc(strlen(argv1) + strlen(line) + 2);
	strcpy(artn, argv1);
	strcat(artn, "/");
	strcat(artn, line);
    likeSongCount++;
    likeSongsItems = realloc(likeSongsItems, likeSongCount * sizeof(ITEM*));
	if(artistName(artn)[0] != '\0') {
    likeSongsItems[likeSongCount - 1] = new_item(strdup(line), stradd(" - ", artistName(artn)));
	} else {
    likeSongsItems[likeSongCount - 1] = new_item(strdup(line), "");
	}
	free(artn);
}
```