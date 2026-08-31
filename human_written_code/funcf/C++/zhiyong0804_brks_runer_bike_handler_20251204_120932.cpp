```cpp
iEvent* RunnerEventHandler::handle(const iEvent* ev)
{
    if (ev == NULL)
    {
        LOG_ERROR("input ev is NULL");
        return NULL;
    }

    u32 eid = ev->get_eid();

    if (eid == EEVENTID_UNLOCK_REQ)
    {
        return handle_unlock_req((UnlockEv*) ev);
    }
    else if (eid == EEVENTID_LOCK_REQ)
    {
        return handle_lock_req((LockEv*) ev);
    }
    else if (eid == EEVENTID_LIST_TRAVELS_REQ)
    {
        return handle_list_travel_records_req((ListTravelRecordsReqEv*) ev);
    }

    return NULL;
}
```