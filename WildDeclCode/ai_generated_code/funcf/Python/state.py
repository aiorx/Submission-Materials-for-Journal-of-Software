```python
elif prof is not None and subject is not None and self.timetable[day][interval][classroom] is None:
    new_timetable[day][interval][classroom] = (prof, subject)
    new_profs[prof].append((day, interval))

    if len(new_profs[prof]) > 7:
        new_fitness['c_intervals'] += HARD_QUOTIENTS['c_intervals']

    new_students[subject] += State.CLASSROOMS[classroom][CAPACITATE]
    new_fitness['c_stud_left'] = State.__compute_c_stud_left(new_students)

    # if prof is in multiple places at the same time
    old_num_apps = reduce(lambda acc, x: acc + 1 if x == (day, interval) else acc, self.profs[prof], 0)
    if old_num_apps > 0:
        new_fitness['c_mult'] += HARD_QUOTIENTS['c_mult']
    
    # update soft constraints
    if day in State.CONSTRAINTS[prof][DAY_CONSTRAINTS]:
        new_fitness['c_soft'] += SOFT_QUOTIENT
    if interval in State.CONSTRAINTS[prof][INT_CONSTRAINTS]:
        new_fitness['c_soft'] += SOFT_QUOTIENT

    # update the pause constraint
    new_fitness['c_pause'] = State.__compute_c_pause(new_timetable, new_profs)
```