```c
void fgetsCheck(char *parr,int len){ //to check and clear '\n' if it is the end of the charcter(it happens when fgets is used)
    if(*(parr+(len-1))=='\n')
        *(parr+(len-1))='\0';

}
```