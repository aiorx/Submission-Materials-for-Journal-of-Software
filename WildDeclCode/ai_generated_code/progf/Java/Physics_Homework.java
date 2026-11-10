import javax.swing.*;
import java.awt.*;
import java.awt.geom.Point2D;

public class PhysicsHomework { 

    public static void main(String[] args) {
        long studentNumber = 20220808038L; // Replace with your student number

        double initialVelocity = getInitialVelocity(studentNumber);
        double initialAngle = getAngle(studentNumber);
        double timeOfFlight = time(initialVelocity, initialAngle);
        double maxHeight = maxHeight(initialVelocity, initialAngle);
        double range = calculateRange(initialVelocity, initialAngle, timeOfFlight);

        System.out.println("Time of flight: " + timeOfFlight + " seconds");
        System.out.println("Maximum height: " + maxHeight + " meters");
        System.out.println("Range: " + range + " meters");

        plotTrajectory(initialVelocity, initialAngle, timeOfFlight);
        question3();
    }
    
    // Method for getting digits
    public static int getDigit(long number, int position) {
        return (int) (number / Math.pow(10, position - 1)) % 10;
    }
    
    // Calculating initial velocity
    public static double getInitialVelocity(long studentNumber) {
        int thirdDigit = getDigit(studentNumber, 2);
        int fourthDigit = getDigit(studentNumber, 4);
        return (thirdDigit * 10 + fourthDigit) * 2; // Multiply by 2 as per the instructions
    }

    // Calculating angle
    public static double getAngle(long studentNumber) {
        int tenthDigit = getDigit(studentNumber, 10);
        int eleventhDigit = getDigit(studentNumber, 11);
        double angle = tenthDigit * 10 + eleventhDigit;
        if (angle < 20) {
            angle += 20;
        }
        return Math.toRadians(angle);
    }

    // Calculating time
    public static double time(double initialVelocity, double angle) {
    	double g = 9.8;
        return (2 * initialVelocity * Math.sin(angle)) / g;
    }

    // Calculating max height
    public static double maxHeight(double initialVelocity, double angle) {
    	double g = 9.8;
        return Math.pow(initialVelocity * Math.sin(angle), 2) / (2 * g);
    }

    // Calculating range
    public static double calculateRange(double initialVelocity, double angle, double time_of_flight) {
        return initialVelocity * Math.cos(angle) * time_of_flight;
    }

    // I took this part of code Adapted from standard coding samples
    private static void plotTrajectory(double initialVelocity, double initialAngle, double timeOfFlight) {
        JFrame frame = new JFrame("Projectile Motion Trajectory");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(800, 600);

        JPanel panel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2d = (Graphics2D) g;

                // Set up the drawing environment
                g2d.setColor(Color.BLACK); // Set color to black for drawing

                double timeStep = 0.1; // Adjust time step for smoother drawing
                for (double t = 0; t <= timeOfFlight; t += timeStep) {
                    // Calculate the x and y coordinates of the projectile at time t
                    double x = initialVelocity * Math.cos(initialAngle) * t;
                    double y = initialVelocity * Math.sin(initialAngle) * t - 0.5 * 9.8 * t * t;

                    // Translate the x and y coordinates to the panel's coordinate system
                    int drawX = (int) x; // No need for translation in this simple example
                    int drawY = getHeight() - (int) y; // Invert y-axis to match the panel's coordinate system

                    // Draw a small dot at the calculated point to represent the projectile's position
                    g2d.fillRect(drawX, drawY, 2, 2); // Use fillRect to draw a small square instead of oval
                }
            }
        };

        frame.add(panel);
        frame.setVisible(true);
    }

    private static Point2D translatePoint(double x, double y, int width, int height) {
        return new Point2D.Double(x + width / 2, height - y);
    }
    
    // Question 3 (Hasan Saygılı helped in this part)
    public static void question3(){
        double g=9.8;
        double m= 5;
        double h1=70;
        double h2=5;
        double totalPotantialEnergy=m*g*h1;
        double lastPotantialEnergy=m*g*h2;
        double lastKineticEnergy=totalPotantialEnergy-lastPotantialEnergy;
        System.out.print("The answer of the last quesiton is: ");
        System.out.println("The last kinetic energy is: "+lastKineticEnergy+" joule");
    }
}
