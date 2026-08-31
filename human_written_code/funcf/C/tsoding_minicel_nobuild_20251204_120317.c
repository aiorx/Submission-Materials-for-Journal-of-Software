```c
const char *cc(void)
{
    const char *result = getenv("CC");
    return result ? result : "cc";
}
```