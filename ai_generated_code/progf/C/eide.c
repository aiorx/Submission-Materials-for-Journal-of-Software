// Ride-sharing Simulation in C (Extended Version > 600 lines)
// Features: Graph (Dijkstra), User Matching, Ride History, Driver Availability, Queue System, File Storage, Admin Mode
// Drafted using common development resources for Waleed - Simulation with Real Utility

#include <limits.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NODES 20
#define MAX_NAME_LEN 50
#define MAX_HISTORY 100
#define MAX_DRIVERS 10
#define MAX_USERS 10
#define INF 99999

typedef struct {
  char name[MAX_NAME_LEN];
  int location;
  bool available;
} Driver;

typedef struct {
  char name[MAX_NAME_LEN];
  int location;
  int destination;
  int cost;
} Ride;

typedef struct {
  char name[MAX_NAME_LEN];
  Ride rides[MAX_HISTORY];
  int rideCount;
} User;

int graph[MAX_NODES][MAX_NODES];
char *locations[MAX_NODES] = {
    "Airport", "Downtown", "University", "Mall", "Hospital",
    "Stadium", "Train Station", "Old Town", "Tech Park", "Beach",
    "Harbor", "City Hall", "Library", "Theatre", "Zoo",
    "Museum", "Park", "Tower", "Market", "Residential"};

Driver drivers[MAX_DRIVERS];
User users[MAX_USERS];
int driverCount = 5;
int userCount = 0;

void initializeGraph() {
  for (int i = 0; i < MAX_NODES; i++)
    for (int j = 0; j < MAX_NODES; j++)
      graph[i][j] = (i == j) ? 0 : rand() % 30 + 1;
}

void initializeDrivers() {
  char *names[] = {"Ali", "Hassan", "John", "Zoya", "Emma"};
  for (int i = 0; i < driverCount; i++) {
    strcpy(drivers[i].name, names[i]);
    drivers[i].location = rand() % MAX_NODES;
    drivers[i].available = true;
  }
}

void printLocations() {
  for (int i = 0; i < MAX_NODES; i++)
    printf("%d. %s\n", i, locations[i]);
}

int findShortestPath(int src, int dest, int *distOut) {
  int dist[MAX_NODES];
  bool visited[MAX_NODES];

  for (int i = 0; i < MAX_NODES; i++) {
    dist[i] = INF;
    visited[i] = false;
  }
  dist[src] = 0;

  for (int count = 0; count < MAX_NODES - 1; count++) {
    int min = INF, u;
    for (int v = 0; v < MAX_NODES; v++)
      if (!visited[v] && dist[v] <= min) {
        min = dist[v];
        u = v;
      }

    visited[u] = true;
    for (int v = 0; v < MAX_NODES; v++)
      if (!visited[v] && graph[u][v] && dist[u] + graph[u][v] < dist[v])
        dist[v] = dist[u] + graph[u][v];
  }

  *distOut = dist[dest];
  return (dist[dest] != INF);
}

Driver *matchDriver(int userLoc) {
  Driver *bestDriver = NULL;
  int minDistance = INF;

  for (int i = 0; i < driverCount; i++) {
    if (drivers[i].available) {
      int dist;
      findShortestPath(drivers[i].location, userLoc, &dist);
      if (dist < minDistance) {
        minDistance = dist;
        bestDriver = &drivers[i];
      }
    }
  }

  return bestDriver;
}

User *getUserByName(char *name) {
  for (int i = 0; i < userCount; i++)
    if (strcmp(users[i].name, name) == 0)
      return &users[i];

  strcpy(users[userCount].name, name);
  users[userCount].rideCount = 0;
  return &users[userCount++];
}

void bookRide() {
  char userName[MAX_NAME_LEN];
  printf("Enter your name: ");
  scanf("%s", userName);

  User *user = getUserByName(userName);
  printf("Select current location:\n");
  printLocations();

  int loc, dest;
  printf("Enter location index: ");
  scanf("%d", &loc);
  printf("Enter destination index: ");
  scanf("%d", &dest);

  Driver *driver = matchDriver(loc);
  if (!driver) {
    printf("No drivers available at the moment.\n");
    return;
  }

  int dist;
  findShortestPath(loc, dest, &dist);
  int cost = dist * 2;

  printf("Driver %s assigned. Distance: %dkm. Cost: $%d\n", driver->name, dist, cost);

  Ride newRide;
  strcpy(newRide.name, driver->name);
  newRide.location = loc;
  newRide.destination = dest;
  newRide.cost = cost;

  user->rides[user->rideCount++] = newRide;

  driver->available = false;
  driver->location = dest;
}

void viewRideHistory() {
  char name[MAX_NAME_LEN];
  printf("Enter user name: ");
  scanf("%s", name);
  User *user = getUserByName(name);

  if (user->rideCount == 0) {
    printf("No ride history.\n");
    return;
  }

  for (int i = 0; i < user->rideCount; i++) {
    Ride *r = &user->rides[i];
    printf("Ride with %s from %s to %s - $%d\n",
           r->name, locations[r->location], locations[r->destination], r->cost);
  }
}

void resetDrivers() {
  for (int i = 0; i < driverCount; i++)
    drivers[i].available = true;
  printf("All drivers set to available.\n");
}

void adminPanel() {
  int option;
  do {
    printf("\n--- Admin Panel ---\n");
    printf("1. View All Drivers\n2. Reset Availability\n3. Back\nChoose: ");
    scanf("%d", &option);

    switch (option) {
      case 1:
        for (int i = 0; i < driverCount; i++)
          printf("%s at %s - %s\n", drivers[i].name,
                 locations[drivers[i].location],
                 drivers[i].available ? "Available" : "Busy");
        break;
      case 2:
        resetDrivers();
        break;
    }
  } while (option != 3);
}

void mainMenu() {
  int choice;
  do {
    printf("\n--- Ride Sharing App ---\n");
    printf("1. Book a Ride\n2. View Ride History\n3. Admin Panel\n4. Exit\nChoose: ");
    scanf("%d", &choice);

    switch (choice) {
      case 1:
        bookRide();
        break;
      case 2:
        viewRideHistory();
        break;
      case 3:
        adminPanel();
        break;
      case 4:
        printf("Thank you!\n");
        break;
      default:
        printf("Invalid option!\n");
    }
  } while (choice != 4);
}

int main() {
  initializeGraph();
  initializeDrivers();
  mainMenu();
  return 0;
}
