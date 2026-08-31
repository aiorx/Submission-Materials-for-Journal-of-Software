// this is round-robin scheduling is Built with basic GitHub coding tools, it didn't use circular method, so you would see that it use two levels of loop
#include <stdio.h>

struct Process {
    int id;
    int burstTime;
    int remainingTime;
};

void roundRobin(struct Process processes[], int n, int quantum) {
    int time = 0; // Current time
    int completed = 0; // Number of completed processes

    printf("Gantt Chart:\n");

    while (completed < n) {
        for (int i = 0; i < n; i++) {
            if (processes[i].remainingTime > 0) {
                printf("| P%d ", processes[i].id);

                if (processes[i].remainingTime > quantum) {
                    time += quantum;
                    processes[i].remainingTime -= quantum;
                } else {
                    time += processes[i].remainingTime;
                    processes[i].remainingTime = 0;
                    completed++;
                }
                printf("(%d) ", time);
            }
        }
    }
    printf("|\n");
}

int main() {
    int n, quantum;

    printf("Enter the number of processes: ");
    scanf("%d", &n);

    struct Process processes[n];

    for (int i = 0; i < n; i++) {
        processes[i].id = i + 1;
        printf("Enter burst time for Process %d: ", i + 1);
        scanf("%d", &processes[i].burstTime);
        processes[i].remainingTime = processes[i].burstTime;
    }

    printf("Enter time quantum: ");
    scanf("%d", &quantum);

    roundRobin(processes, n, quantum);

    return 0;
}


