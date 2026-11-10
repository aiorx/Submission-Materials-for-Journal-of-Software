```python
def handle_like(data, author_id):
    '''
    Processes a "like" object and performs the following actions:
    - Checks if the "like" already exists in the database.
    - Resolves the target post object, accommodating requests from both the frontend and other nodes.
    - Creates a new "like" object if it does not exist.
    - Sends the "like" data to other connected nodes if necessary.
    '''
    like_exists = False
    like_id = data.get('id')

    # check if like exist or not
    try:
        Like.objects.get(id = like_id)
        like_exists = True
    except Like.DoesNotExist:
        pass
    
    # Accommodation for our own frontend and other nodes
    if data.get("post") == None:
        post = get_object_or_404(Post, id = data['object'])
    else:
        post = get_object_or_404(Post, id = data['post'])
    
    # create like / send like to other nodes
    if not like_exists:

        # Create the author object if it doesn't exist
        author_data = data.get("author", None)
        if author_data:
            author = create_or_get_author(author_data)
            if author == None:
                return Response({"detail": "Failed to create the author."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"detail": "No author object provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = LikeSerializer(data=data, context={'author': author,'post': post,'remote': True}) # Built using basic development resources
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Send it to other nodes
    inbox_author = get_object_or_404(Author, serial = author_id)
    logging.info(f"Inbox author id - {inbox_author.id} and post author is {post.author_id}")
    if inbox_author.id == post.author_id.strip('/'):
        sendToConnectedNodes(data = serializer.data)
    if like_exists:
        return Response(status=status.HTTP_200_OK)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
```