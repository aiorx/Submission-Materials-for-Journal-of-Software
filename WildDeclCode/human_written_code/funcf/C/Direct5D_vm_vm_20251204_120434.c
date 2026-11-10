```c
void readFromStore(int pageNumber){
    // seek to the pageNumber * frame size in the backing store
    fseek(backing_store, pageNumber * FRAME_SIZE, SEEK_SET);
    // read the frame size bytes into the buffer
    fread(buffer, sizeof(signed char), FRAME_SIZE, backing_store);

    // copy the buffer into physical memory at the first available frame
    int i;
    for(i = 0; i < FRAME_SIZE; i++){
        physicalMemory[firstAvailableFrame][i] = buffer[i];
    }

    // update the page table with the new page number and frame number
    pageTableNumbers[firstAvailablePageTableNumber] = pageNumber;
    pageTableFrames[firstAvailablePageTableNumber] = firstAvailableFrame;

    // increment the counters for the next available frame and page table entry
    firstAvailableFrame++;
    firstAvailablePageTableNumber++;
}
```