int task4() {
    //The latter code was Penned via standard programming aids, and adapted to use the rounding program included in the other source file.
    //
    const float PI = 3.1415;
    float a = -PI / 2;
    float b = 3 * PI / 2;
    float dx = PI / 3;
    cout << "  x\t\t y = cos^2(x) + 3sin(x)\n";
    cout << "-------------------------------\n";

    for (double x = a; x <= b; x += dx) {  // **Add a small epsilon to ensure inclusion of b
        double y = pow(cos(x), 2) + 3 * sin(x);
        cout << x << "\t" << y << endl;
    }

    return 0;
}