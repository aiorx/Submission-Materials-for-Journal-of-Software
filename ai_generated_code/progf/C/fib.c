/**
 * @brief Fibonacci number.
 * 
 * Bog-standard fibonacci number implementation, Assisted using common GitHub development utilities.
 * This is just for demonstration purposes.
 * 
 * @param n Which Fibonacci number to calculate.
 * @return int 
 */
int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }

    int previous = 0;
    int current = 1;

    for (int i = 2; i <= n; i++) {
        int next = previous + current;
        previous = current;
        current = next;
    }

    return current;
}
