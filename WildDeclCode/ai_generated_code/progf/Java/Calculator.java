package OOPs.Module4.Part2.Task1;

// Copilot is not bad, helps me with the cheesy stuff.
// In a new project, write a Calculator class that has the ability to sum positive integers. A negative integer should throw an exception.
//
//The class acts as the model in the MVC pattern. It should have the following methods:
//
//A method that resets the calculator to zero.
//A method that adds an integer to the calculator.
//A method that returns the current value of the calculator
public class Calculator {
    int result = 0;
    public Calculator() {

    }

    // Copilot helped me with this to sum positive integers, just wrote the method name.
    public void addPositiveInteger(int num) {
        if (num < 0) {
            System.out.println("Error: Negative integers are not allowed.\n" + IllegalArgumentException.class);
        } else {
            result += num;
        }
    }

    public void reset() {
       result = 0;
    }


    // to get current value of calculator - Copilot helped me with this
    public int getResult() {
        return result;
    }


    // Made some adjustments in the temporary main method to test the code, also partially Composed with GitHub coding tools
    public static void main(String[] args) {
        Calculator c = new Calculator();
        System.out.println(c.getResult()); // should print 0
        c.addPositiveInteger(-1); // should throw an exception
        c.addPositiveInteger(2);
        c.addPositiveInteger(3);
        System.out.println(c.getResult()); // should print 5
        c.reset();
        System.out.println(c.getResult()); // should print 0 again
    }
}
