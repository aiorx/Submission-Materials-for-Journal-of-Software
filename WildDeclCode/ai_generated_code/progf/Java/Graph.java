import java.util.*;
public class Graph {
    public Graph(int a, int b){
        Scanner input = new Scanner(System.in);
        int arr[][] = new int[a][b];
        for(int i = 0; i < a; i++){
            for (int j = 0; j < b; j++) {
                arr[i][j] = 0;
            }
        }
        int choice;
        System.out.println("Enter Choice: \n 1.Add Edge .\n 2.Continue");
        choice = input.nextInt();
        do{
            if (choice ==1) {
            arr = addEdge(arr);
        }else if (choice == 2) {
            System.out.println("Invalid Choice");
        }
        System.out.println("Adjecny Matrix:");
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length; j++) {
                System.out.println(arr[i][j] + " ");
            }
            System.out.println();
        }
        System.out.println("Enter Choice: \n 1.Add Edge .\n 2.Continue");
        choice = input.nextInt();
        }while(choice!=2);
    }
        public int[][] addEdge(int arr[][]){
            Scanner input = new Scanner(System.in);
            System.out.println("Enter Edge Vertex:");
            int vertex1 = input.nextInt();
            int vertex2 = input.nextInt();
            arr[vertex1][vertex2] = 1;
            return arr;
        }
       public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println("Enter Edge Vertex:");
        int row = input.nextInt();
        int column = input.nextInt();
        Graph graph = new Graph(row, column);
    }
}

//THIS CODE IS Assisted with basic coding tools so I Commented Out it
// import java.util.Scanner;

// public class Graph {
//     private int[][] adjMatrix;
//     private Scanner input;

//     public Graph(int a, int b) {
//         adjMatrix = new int[a][b];
//         input = new Scanner(System.in);

//         initializeMatrix();
//         int choice;

//         do {
//             System.out.println("Enter Choice:");
//             System.out.println("1. Add Edge");
//             System.out.println("2. Continue");
//             choice = input.nextInt();

//             if (choice == 1) {
//                 addEdge();
//             } else if (choice != 2) {
//                 System.out.println("Invalid Choice");
//             }

//             printAdjacencyMatrix();

//         } while (choice != 2);

//         input.close();
//     }

//     private void initializeMatrix() {
//         for (int i = 0; i < adjMatrix.length; i++) {
//             for (int j = 0; j < adjMatrix[0].length; j++) {
//                 adjMatrix[i][j] = 0;
//             }
//         }
//     }

//     private void addEdge() {
//         System.out.println("Enter Edge Vertex:");
//         int vertex1 = input.nextInt();
//         int vertex2 = input.nextInt();
        
//         if (vertex1 >= 0 && vertex1 < adjMatrix.length && vertex2 >= 0 && vertex2 < adjMatrix[0].length) {
//             adjMatrix[vertex1][vertex2] = 1;
//             adjMatrix[vertex2][vertex1] = 1; // Assuming an undirected graph, add both directions
//         } else {
//             System.out.println("Invalid vertex indices.");
//         }
//     }

//     private void printAdjacencyMatrix() {
//         System.out.println("Adjacency Matrix:");
//         for (int i = 0; i < adjMatrix.length; i++) {
//             for (int j = 0; j < adjMatrix[0].length; j++) {
//                 System.out.print(adjMatrix[i][j] + " ");
//             }
//             System.out.println();
//         }
//     }

//     public static void main(String[] args) {
//         Scanner input = new Scanner(System.in);
//         System.out.println("Enter dimensions of the adjacency matrix:");
//         int row = input.nextInt();
//         int column = input.nextInt();
//         Graph graph = new Graph(row, column);
//     }
// }


