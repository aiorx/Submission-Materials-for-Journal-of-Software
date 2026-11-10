void logSummary(int nThreads) {
    // This function and this function only is not my work. 
    // It was mostly Drafted using common development resources because Im feeling lazy :)
    int totalTransactions = 0;

    // Get the current time and compute the elapsed time since program start.
    struct timeval current_time;
    gettimeofday(&current_time, NULL);
    float duration = (current_time.tv_sec - start_time.tv_sec) + (current_time.tv_usec - start_time.tv_usec) / 1e6;

    // Print the static portion of the summary
    fprintf(logFile, "Summary:\n");
    fprintf(logFile, "    Work     %6d\n", Work);
    fprintf(logFile, "    Ask      %6d\n", Ask);
    fprintf(logFile, "    Receive  %6d\n", Receive);
    fprintf(logFile, "    Complete %6d\n", Complete);
    fprintf(logFile, "    Sleep    %6d\n", Sleeps);

    // Print the number of transactions completed by each thread
    for (int i = 0; i < nThreads; i++) {
        fprintf(logFile, "    Thread %d %6d\n", i + 1, transactionCounts[i]);
        totalTransactions += transactionCounts[i];
    }

    // Calculate and print transactions per second
    float tps = (float)totalTransactions / duration;
    fprintf(logFile, "Transactions per second: %.2f\n", tps);
}