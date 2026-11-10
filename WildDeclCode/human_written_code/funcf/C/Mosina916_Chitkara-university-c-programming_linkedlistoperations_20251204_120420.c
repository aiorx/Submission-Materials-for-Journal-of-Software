```c
void insertatfront(){
     struct node* temp;
    temp=(struct node*)malloc(sizeof(struct node));
    printf("enter the data to be added at front\n");
    scanf("%d",&temp->data);
    if(root==NULL){
        root=temp;
    }
    else{
        temp->link=root;
        root=temp;

    }
    

}
```