package org.example.foersteaarseksamen.repositories;


import org.example.foersteaarseksamen.models.Employee;
import org.example.foersteaarseksamen.models.Task;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class EmployeeRepository {

    private final JdbcTemplate jdbcTemplate;

    public EmployeeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
/*
    TO-DO: tilføje ny employee til projektet fra en dropdown menu
  */

    //Employeees are created without assignd foreign keys
    public void CreateEmployee(String employeeName, Integer calculatorTableId) {
        String query = "INSERT INTO employee_table (employee_name, calculator_table_id) VALUES (?, ?)";
        jdbcTemplate.update(query, employeeName, calculatorTableId);
    }

    //KSG with aid Referenced via basic programming materials
    public List<Employee> ReadAllEmployees() {
        // Corrected SQL query to retrieve data from the database
        String query = "\n" +
"SELECT \n" +
"    e.employee_id, \n" +
"    e.employee_name, \n" +
"    e.calculator_table_id,\n" +
"    t.tasks_id, \n" +
"    t.task_name, \n" +
"    t.estimated_work_hours_per_task\n" +
"FROM \n" +
"    employee_table e\n" +
"LEFT JOIN \n" +
"    calculator_table c ON e.calculator_table_id = c.calculator_table_id\n" +
"LEFT JOIN \n" +
"    project_management p ON c.project_management_id = p.project_management_Id\n" +
"LEFT JOIN \n" +
"    employee_tasks et ON e.employee_id = et.employee_id\n" +
"LEFT JOIN \n" +
"    tasks t ON et.tasks_id = t.tasks_id\n";

        // Fetch employee data from the database
        List<Map<String, Object>> rows = fetchEmployeeData(query);

        // Process each row and build the employee map
        Map<Integer, Employee> employeeMap = processEmployeeData(rows);

        // Return the list of employees
        return new ArrayList<>(employeeMap.values());
    }

    //KSG with aid Referenced via basic programming materials
    private List<Map<String, Object>> fetchEmployeeData(String query) {
        try {
            // Using jdbcTemplate to fetch data from the database
            return jdbcTemplate.queryForList(query);
        } catch (DataAccessException e) {
            e.printStackTrace(); // Log or handle the exception as needed
            return Collections.emptyList(); // Return an empty list in case of error
        }
    }

    //Chat GPT, debugged SQL table names and variables commonly
    private Map<Integer, Employee> processEmployeeData(List<Map<String, Object>> rows) {
        Map<Integer, Employee> employeeMap = new HashMap<Integer, Employee>();

        for (Map<String, Object> row : rows) {
            // Use Integer instead of int to handle null values
            Integer employeeId = (Integer) row.get("employee_id");

            // Check if employeeId is null
            if (employeeId != null) {
                // Retrieve or create the employee object
                Employee employee = employeeMap.computeIfAbsent(employeeId, id -> new Employee(
                        id,
                        (String) row.get("employee_name"),
                        (Integer) row.get("calculator_table_id"),  // Cast to Integer
                        new ArrayList<>()
                ));

                // Add tasks if they exist
                Integer taskId = (Integer) row.get("tasks_id");
                if (taskId != null) {
                    Task task = new Task(
                            taskId,
                            (String) row.get("task_name"),  // Fixed column name
                            (Integer) row.get("estimated_work_hours_per_task")  // Cast to Integer
                    );
                    employee.getTasks().add(task);
                }
            }
        }

        return employeeMap;

    }

}
