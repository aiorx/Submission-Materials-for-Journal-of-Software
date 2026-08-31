// Aided with basic GitHub coding tools with minor changes
struct proc *min = 0;
for (p = proc; p < &proc[NPROC]; p++)
{
  acquire(&p->lock);
  if (p->state == RUNNABLE)
  {        
    if (min == 0)
    {
      min = p;
    }
    else if (p->ctime < min->ctime)
    {
      release(&min->lock);
      min = p;
    }
    else
    {
      release(&p->lock);
    }
  }
  else
  {
    release(&p->lock);
  }
}

if (min != 0)
{
  if (min->state == RUNNABLE)
  {
    min->state = RUNNING;
    c->proc = min;
    swtch(&c->context, &min->context);
    c->proc = 0;
  }
  release(&min->lock);
}