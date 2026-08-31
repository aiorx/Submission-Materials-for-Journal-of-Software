```java
public double solveForTheta(double voltage) {//Formed using common development resources TODO: Test the formula
    //Formula from REV: (445.5((theta)-270))/((theta)^2-270(theta)-36450) = voltage;
    double a = voltage;
    double b = -445.5;
    double c = 120285 - 36450*voltage;
    double discriminant = b*b - 4*a*c;
    theta1 = (445.5 + Math.sqrt(discriminant)) / (2*a);
    theta2 = (445.5 - Math.sqrt(discriminant)) / (2*a);
    // Choose the appropriate solution based on the context of the problem
    if(isPositive(theta1)){return theta1;}
    else if (isPositive(theta2)){return theta2;}
    else return 0;
}
```