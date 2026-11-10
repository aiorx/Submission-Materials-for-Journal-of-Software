```c
struct exec
{
    unsigned a_magic;
    unsigned a_text; 
    unsigned a_data;        
    unsigned a_bss;
    unsigned a_entry;
    unsigned a_reserved[2];
    unsigned a_syms;
};
```