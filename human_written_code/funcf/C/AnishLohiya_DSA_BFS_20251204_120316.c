```c
int dequeue()
{
    int x = -1;
    if (front == NULL)
    {
        printf("Queue is empty\n");
    }
    else
    {
        struct Node *temp = front;
        x = temp->data;
        front = front->next;
        free(temp);
    }
    return x;
}
```