/* This is a simple program to calculate the sum of two numbers.
#include <stdio.h>

int main() 
{
    int num1, num2, sum;
    
    printf("Enter the first number: ");
    scanf("%d", &num1);
    
    printf("Enter the second number: ");
    scanf("%d", &num2);
    
    sum = num1 + num2;
    
    printf("The sum of %d and %d is %d\n", num1, num2, sum);
    
    return 0;
}
*/

/*
Program to evaluate simple expressions of the form number operator number
we want to write a program that allows the users to type in simple expressions of the form number operator number and then the
program will evaluate the expression and display the results at the terminal
The operators are normal operators for addition, subtraction, multiplication, and division.
*/
/*
#include <stdio.h>

int main()
{
    float num1, num2, result;
    char op;
    
    printf("Enter the expression: ");
    scanf("%f %c %f", &num1, &op, &num2);
    
    switch(op)
    {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            result = num1 / num2;
            break;
        default:
            printf("Invalid operator\n");
            return 1;
    }
    
    printf("The result is %.2f\n", result);
    
    return 0;
}
*/

/* This is a program to calculate the number operator number expressions using switch case statement Aided with basic GitHub coding tools.
*/
/*
#include <stdio.h>

int main()
{
 float value1, value2;
 char operator;

 printf("Type in your expression.\n");
 scanf("%f %c %f", &value1, &operator, &value2);

 if (operator == '+')
 {
    printf("%.2f\n", value1 + value2);
 } 
 else if (operator == '-')
 {
    printf("%.2f\n", value1 - value2);
 }
 else if (operator == '*')
 {
    printf("%.2f\n", value1 * value2);
 }
 else if (operator == '/')
 {
    printf("%.2f\n", value1 / value2);
 }
 return 0;
}
//the program does not consider the case of invalid operator or divison by zero, it can be perfected as follows.
*/
//program 5.8A revisse the program to evaluate simple expressions of the form number operator number
#include<stdio.h>

int main()
{
    float value1, value2;
    char operator;

    printf("Type in your expressions.\n");
    scanf("%f %c %f", &value1, &operator, &value2);

    if (operator == '+')
    {
        printf("%.2f\n", value1 + value2);
    }
    else if (operator == '-')
    {
        printf("%.2f\n", value1 - value2);
    }
    else if (operator == '*')
    {
        printf("%.2f\n", value1 * value2);
    }
    else if (operator == '/')
    {
        if (value2 == 0)
        {
            printf("Division by zero is not allowed.\n");
        }
        else
        {
            printf("%.2f\n", value1 / value2);
        }
    }

    else
    {
        printf("Unknown operator should be avoided.\n");
    }

    return 0;
}

//When we repeatedly run the program, the complier might need to be recomplied in order to avoid any possible bugs.