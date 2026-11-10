```java
public static Schedule scheduleBuild(Schedule s) { // Supported via standard programming aids
    // Load OR-Tools native libraries.
	Loader.loadNativeLibraries();
	        
	// Retrieve the scheduling period from the Schedule object.
	LocalTime startTime = s.getStartTime();
	LocalTime endTime = s.getEndTime();
	int startHour = startTime.getHour();
	int endHour = endTime.getHour();
	int numSlots = endHour - startHour;  // Assumes whole-hour slots
	
	// Create the CP-SAT model.
	CpModel model = new CpModel();
	
	// Assume the schedule is for Monday.
	DayOfWeek scheduleDay = DayOfWeek.MONDAY;
	
	// Get the list of employees from the Schedule object.
	ArrayList<Employee> employees = s.getEmployees();
	Map<Integer, BoolVar[]> assignments = new HashMap<>();
	
	for (Employee e : employees) {
	    BoolVar[] vars = new BoolVar[numSlots];
	    for (int t = 0; t < numSlots; t++) {
	        vars[t] = model.newBoolVar("emp_" + e.getEmployeeId() + "_slot_" + t);
	        
	        // Check if this slot falls into an unavailable period for the employee on the given day.
	        Availability unavail = e.getAvailabilities().get(scheduleDay.toString());
	        if (unavail != null) {
	            LocalTime slotStart = LocalTime.of(startHour + t, 0);
	            LocalTime slotEnd = LocalTime.of(startHour + t + 1, 0);
	            for (TimeRange tr : unavail.getTimeRanges()) {
	                // If the timeslot overlaps an unavailable period, force the variable to 0.
	                if (slotStart.isBefore(tr.getEnd()) && slotEnd.isAfter(tr.getStart())) {
	                    model.addEquality(vars[t], 0);
	                    break;
	                }
	            }
	        }
	    }
	    assignments.put(e.getEmployeeId(), vars);
	}
	
	// Add constraint: each timeslot must be covered by exactly one employee.
	for (int t = 0; t < numSlots; t++) {
	    List<BoolVar> slotVars = new ArrayList<>();
	    for (Employee e : employees) {
	        slotVars.add(assignments.get(e.getEmployeeId())[t]);
	    }
	    // Convert the List<BoolVar> to an array for LinearExpr.sum()
	    model.addEquality(LinearExpr.sum(slotVars.toArray(new BoolVar[0])), 1);
	}
	// 1. Create an IntVar that counts each employee's total assigned slots.
			Map<Integer, IntVar> loadVars = new HashMap<>();
			for (Employee e : employees) {
			    BoolVar[] empSlots = assignments.get(e.getEmployeeId());
			    IntVar load = model.newIntVar(0, numSlots, "load_emp_" + e.getEmployeeId());
			    model.addEquality(load, LinearExpr.sum(empSlots));
			    loadVars.put(e.getEmployeeId(), load);
			}

			// 2. Define vars for the maximum and minimum load.
			IntVar maxLoad = model.newIntVar(0, numSlots, "maxLoad");
			IntVar minLoad = model.newIntVar(0, numSlots, "minLoad");

			// 3. Constrain them so maxLoad ≥ every load, and minLoad ≤ every load.
			for (IntVar load : loadVars.values()) {
			    model.addLessOrEqual(load, maxLoad);
			    model.addGreaterOrEqual(load, minLoad);
			}

			// 4. Set the objective to minimize the difference (maxLoad – minLoad).
			// This drives the solver to equalize assignments as much as possible.
			model.minimize(LinearExpr.newBuilder()
			    .addTerm(maxLoad,  1)
			    .addTerm(minLoad, -1)
			    .build());
			
			// Add constraint: each employee must work at least one slot.
			for (Employee e : employees) {
			    BoolVar[] empVars = assignments.get(e.getEmployeeId());
			    // Sum(empVars) ≥ 1 ensures this employee is scheduled at least once.
			    model.addGreaterOrEqual(LinearExpr.sum(empVars), 1);
			}
	
	// Solve the model.
	CpSolver solver = new CpSolver();
	CpSolverStatus status = solver.solve(model);
	
	List<Shift> shifts = new ArrayList<>();
	if (status == CpSolverStatus.OPTIMAL || status == CpSolverStatus.FEASIBLE) {
	    // For each timeslot, determine the assigned employee and create a shift.
	    for (int t = 0; t < numSlots; t++) {
	        int assignedEmployeeId = -1;
	        for (Employee e : employees) {
	            if (solver.value(assignments.get(e.getEmployeeId())[t]) == 1) {
	                assignedEmployeeId = e.getEmployeeId();
	                break;
	            }
	        }
	        LocalTime slotStart = LocalTime.of(startHour + t, 0);
	        LocalTime slotEnd = LocalTime.of(startHour + t + 1, 0);
	        shifts.add(new Shift(assignedEmployeeId, scheduleDay, slotStart, slotEnd));
	    }
	} else {
	    System.out.println("No solution found.");
	}
	
	// Sort the shifts by start time.
	Collections.sort(shifts, Comparator.comparing(Shift::getStart));
	
	// Set the sorted shifts into the Schedule object.
	s.setShifts(shifts);
	
	return s;
	}
```