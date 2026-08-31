// Formed using common development resources, need to test.

// Function to map an input value to an output value based on a curve defined by breakpoints
float mapToCurve(float input, float breakpoints[][2], int numBreakpoints) {
    // Check if the input is within the range of the breakpoints
    if (input < 0.0 || input > 1.0) {
        return -1.0; // Return -1.0 to indicate an undefined value
    }

    // Calculate the x position for the given input value
    float x = input;

    // Check if there are not enough breakpoints
    if (numBreakpoints < 2) {
        return -1.0; // Return -1.0 to indicate an undefined value
    }

    // Find the segment containing the input x
    for (int i = 0; i < numBreakpoints - 1; i++) {
        float x1 = breakpoints[i][0];
        float y1 = breakpoints[i][1];
        float x2 = breakpoints[i + 1][0];
        float y2 = breakpoints[i + 1][1];

        if (x >= x1 && x <= x2) {
            // Linear interpolation
            float t = (x - x1) / (x2 - x1);
            float y = y1 + t * (y2 - y1);
            return y; // Return the output value in the range 0.0 - 1.0
        }
    }

    return -1.0; // Return -1.0 to indicate an undefined value
}

void setup() {
    Serial.begin(9600);

    // Example breakpoints array
    float breakpoints[4][2] = {
        {0.0, 0.0},
        {0.25, 0.5},
        {0.75, 0.75},
        {1.0, 1.0}
    };
    
    int numBreakpoints = 4;

    // Test the function
    float input = 0.5; // Example input value
    float output = mapToCurve(input, breakpoints, numBreakpoints);

    if (output >= 0.0) {
        Serial.print("Output for input ");
        Serial.print(input);
        Serial.print(" is ");
        Serial.println(output);
    } else {
        Serial.println("Output is undefined for the given input.");
    }
}

void loop() {
    // Your code here
}
