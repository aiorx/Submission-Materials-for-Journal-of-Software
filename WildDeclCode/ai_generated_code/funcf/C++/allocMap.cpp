uint64_t allocMap::remove(void* addr)
{
    //Penned via standard GitHub programming aids (wow lol)
    uint32_t index = this->index(addr);
    alloc** head = this->table + index;
    alloc* curr = *head;
    uint32_t ret = 0; 
    //if there is an alloc in this space, search it for addr
    if (curr)
    {
        //if the first alloc is the one we want to remove, remove it and free next if applicable
        if (curr->thisAlloc == addr)
        {
            ret = curr->allocSize;
            if (curr->nextAlloc)
            {
                alloc* tmp = curr->nextAlloc;
                tmp->lastAlloc = nullptr;
                *head = tmp;
            }
            else
            {
                *head = nullptr;
            }
            smallFree(curr);
            this->size--;
        }
        //if further in list or non-existent, search list
        else
        {
            while(curr)
            {
                if (curr->thisAlloc == addr)
                {
                    ret = curr->allocSize;
                    curr->lastAlloc->nextAlloc = curr->nextAlloc;
                    if (curr->nextAlloc)
                        curr->nextAlloc->lastAlloc = curr->lastAlloc;
                    this->size--; 
                    break;
                }
                curr = curr->nextAlloc;
            }
        }
    }
    if (ret > 0 && this->cap > MIN_CAP && (this->size/this->cap) < MIN_LOAD)
        resizeDown();
    return ret;
}