```c
int sblist_grow_if_needed(sblist* l) {
	char* temp;
	if(l->count == l->capa) {
		temp = realloc(l->items, (l->capa + l->blockitems) * l->itemsize);
		if(!temp) return 0;
		l->capa += l->blockitems;
		l->items = temp;
	}
	return 1;
}
```