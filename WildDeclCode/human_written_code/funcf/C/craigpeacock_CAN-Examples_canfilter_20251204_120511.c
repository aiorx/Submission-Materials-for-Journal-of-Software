```c
void print_can_frame(const struct can_frame *frame)
{
    int i;
    printf("0x%03X [%d] ", frame->can_id, frame->can_dlc);

    for (i = 0; i < frame->can_dlc; i++)
        printf("%02X ", frame->data[i]);

    printf("\r\n");
}
```