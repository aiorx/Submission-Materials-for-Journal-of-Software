package io.github.jeffreyxiecn.github.copilot;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

class TryAItools {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        print();
        System.out.println();
        print2();
    }

    int calculateDaysBetweenDates(String date1, String date2) {
        int days = 0;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date d1 = sdf.parse(date1);
            Date d2 = sdf.parse(date2);
            long diff = d2.getTime() - d1.getTime();
            days = (int) TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return days;
    }

    // find all images without alternate text
    // and give them a red border
    // and add a tooltip with the text "Please add alternate text"
    void process() {
//        for (int i = 0; i < images.length; i++) {
//            if (images[i].alt == "") {
//                images[i].style.border = "1px solid red";
//                images[i].title = "Please add alternate text";
//            }
//        }
    }

    // print out A to Z
    static void print() {
        for (char c = 'A'; c <= 'Z'; c++) {
            System.out.print(c);
        }
    }

    // print out A to Z on the same line, then print out a newline
    /* Documentation Aided using common development resources
    This code is a Java method named `print2`, which prints all uppercase letters of the alphabet from A to Z to the console, followed by a newline character. Here is a line-by-line breakdown of the code:

```
static void print2() {
```
This line declares a static method named `print2`. The method has a return type of `void`, which means it does not return any value. The method is declared as `static`, which means it can be called without creating an instance of the class that it belongs to.

```
for (char c = 'A'; c <= 'Z'; c++) {
```
This line begins a `for` loop that iterates over each character in the range from 'A' to 'Z', inclusive. The loop variable `c` is initialized to 'A' and incremented by one each time through the loop.

```
System.out.print(c);
```
This line prints the current value of `c` to the console, without appending a newline character.

```
}
```
This line ends the `for` loop.

```
System.out.println();
```
This line prints a newline character to the console, which has the effect of moving the cursor to the next line.

```
}
```
This line ends the `print2` method.
     */
    static void print2() {
        for (char c = 'A'; c <= 'Z'; c++) {
            System.out.print(c);
        }
        System.out.println();
    }

    static boolean isPrimeNumber2(int n) {
        if (n <= 1) {
            return false;
        }
        for (int i = 2; i < n; i++) {
            if (n % i == 0) {
                return false;
            }
        }
        return true;
    }

    static boolean isPrimeNumber(int n) {
        if (n <= 1) {
            return false;
        }
        for (int i = 2; i < Math.sqrt(n); i++) {
            if (n % i == 0) {
                return false;
            }
        }
        return true;
    }

    // Calculate the greatest common divisor (GCD) of two numbers
    // using Euclid's algorithm
    static int calculateGreatestCommonDivisor(int a, int b) {
        if (b == 0) {
            return a;
        }
        return calculateGreatestCommonDivisor(b, a % b);
    }


}
