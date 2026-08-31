import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;


public class Main {


    // Built using basic development resources
    static String red = "\u001B[38;2;255;0;0m"; // Hex #FF0000
    static String green = "\u001B[38;2;0;255;0m"; // Hex #00FF00
    static String blue = "\u001B[38;2;0;0;255m"; // Hex #0000FF
    static String orange = "\u001B[38;5;214m"; // Orange color
    static String reset = "\u001B[0m"; // Reset color
    //

    public static List<Todo> list = new ArrayList<>();
    static Scanner scan = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("Welcome to my todo-list project!");
        ShowOptions();
    }

    public static int ValidInt() {
        int action = 0;

        // Keep asking for input until the user enters a valid integer
        boolean validInput = false;
        while (!validInput) {
            System.out.println("-- Please enter a valid number -- ");
            if (scan.hasNextInt()) {
                action = scan.nextInt();
                validInput = true; // Exit loop if input is valid
            } else {
                System.out.println("Invalid input. Please enter a valid integer.");
                scan.next(); // Clear the invalid input
            }
        }
        return action;
    }

    public static int ValidIntRange(int min, int max, String message) {
        int input = -1;

        while (true) {  // Infinite loop until valid input is received
            System.out.println(message);

            // Check if the input is an integer
            if (scan.hasNextInt()) {
                input = scan.nextInt();

                // Check if the input is within the specified range
                if (input >= min && input <= max) {
                    break;  // Exit the loop if valid input is entered
                } else {
                }
            } else {
                System.out.println("Invalid input. Please enter a valid integer.");
                scan.next(); // Clear the invalid input
            }
        }
        return input;
    }

    static void ShowOptions() {
        System.out.println("Please choose your action | \n" + green + " [1] Manage Tasks " + blue + "[2] Show Tasks" + reset);

        int action = ValidInt();
        scan.nextLine(); // consume the left-over, to prevent errors

        switch (action) {
            case 1:
                ManageTasks();
                break;
            case 2:
                ShowTasks();
                break;
            default:
                System.out.println(red + "Not a valid action!" + reset);
                ShowOptions();
                break;
        }
    }

    public static void ManageTasks() {
        System.out.println("Please choose your action | \n" + green + " [1] Add Task " + red + " [2]  Task " + blue + "[3] Set Status" +  reset + " [4] Go Back");
        int action = ValidInt();
        scan.nextLine(); // consume the left-over, to prevent errors

        switch (action) {
            case 1:
                AddTask();
                break;
            case 2:
                RemoveTask();
                break;
            case 3:
                SetStatus();
                break;
            case 4:
                ShowOptions();
                break;
            default:
                System.out.println(red + "Not a valid action!" + reset);
                ManageTasks();
                break;
        }
    }

    private static void SetStatus() {

        if (GetListSize() <= 0) {
            System.out.println(orange + "No tasks available!" + reset);
            ShowOptions();
            return;
        }

        ShowTasksOnly();
        System.out.println("");
        int id = ValidIntRange(0, GetListSize(), "type task ID: ") - 1;
        String message1 = green + "[1] done " + orange + "[2] in progress" + red + " [3] pending" + reset;
        int action = ValidIntRange(1, 3, message1);
        scan.nextLine(); // consume left-over

        switch (action) {
            case 1:
                list.get(id).setStatus(Todo.Status.DONE);
                break;
            case 2:
                list.get(id).setStatus(Todo.Status.DOING);
                break;
            case 3:
                list.get(id).setStatus(Todo.Status.PENDING);
                break;
        }
        ShowTasks();
    }

    private static void AddTask() {
        Todo todo = new Todo(GetListSize() + 1, "", "", Todo.Status.PENDING);
        System.out.println("");
        System.out.print("Name of your Task: ");
        String name = scan.nextLine();
        todo.setName(name);

        System.out.println("");
        System.out.print("Task: ");
        String task = scan.nextLine();
        todo.setDescription(task);

        System.out.println(green + "Task added successfully!" + reset);
        list.add(todo);
        ShowTasks();
    }

    private static void RemoveTask() {
        if (GetListSize() <= 0) {
            System.out.println(orange + "No tasks available!" + reset);
            ShowOptions();
            return;
        }

        ShowTasksOnly();
        String message = "type task ID: ";
        int removeID = ValidIntRange(1, GetListSize(), message) - 1;

        while (removeID > GetListSize() - 1 || removeID < 0) {
            System.out.println("Not a valid ID!");
            RemoveTask();
        }


        list.remove(removeID);
        System.out.println(green + "Task removed successfully!" + reset);
        ShowTasks();
    }

    private static void ShowTasks() {

        if (GetListSize() <= 0) {
            System.out.println(orange + "No tasks available!" + reset);
            ShowOptions();
            return;
        }

        System.out.println("==========");
        for (int i = 0; i < list.size(); i++) {
            list.get(i).getInfo();
        }
        System.out.println("==========");

        ShowOptions();
    }

    private static void ShowTasksOnly() {
        for (int i = 0; i < list.size(); i++) {
            list.get(i).getInfo();
        }
    }

    public static int GetListSize() {
        return list.size();
    }

}