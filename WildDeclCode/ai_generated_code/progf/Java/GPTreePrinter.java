package oer_lab2_0036542895.test1.genetic.chromosome.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GPTreePrinter { // Code Supported via standard programming aids

    public static void printTree(GPTreeNode root) {
        printTreeInternal(Collections.singletonList(root), 1, root.maxDepth);
    }

    private static void printTreeInternal(List<GPTreeNode> nodes, int level, int maxLevel) {
        if (nodes.isEmpty() || allElementsNull(nodes)) return;

        int floor = maxLevel - level;
        int edgeLines = (int) Math.pow(2, Math.max(floor - 1, 0));
        int firstSpaces = (int) Math.pow(2, floor) - 1;
        int betweenSpaces = (int) Math.pow(2, floor + 1) - 1;

        printSpaces(firstSpaces);

        List<GPTreeNode> newNodes = new ArrayList<>();
        for (GPTreeNode node : nodes) {
            if (node != null) {
                System.out.print(node.name);
                newNodes.add(node.left);
                newNodes.add(node.right);
            } else {
                System.out.print(" ");
                newNodes.add(null);
                newNodes.add(null);
            }
            printSpaces(betweenSpaces);
        }
        System.out.println();

        for (int i = 1; i <= edgeLines; i++) {
            for (int j = 0; j < nodes.size(); j++) {
                printSpaces(firstSpaces - i);
                if (nodes.get(j) == null) {
                    printSpaces(edgeLines + edgeLines + i + 1);
                    continue;
                }

                if (nodes.get(j).left != null) System.out.print("/");
                else printSpaces(1);

                printSpaces(i + i - 1);

                if (nodes.get(j).right != null) System.out.print("\\");
                else printSpaces(1);

                printSpaces(edgeLines + edgeLines - i);
            }
            System.out.println();
        }

        printTreeInternal(newNodes, level + 1, maxLevel);
    }

    private static void printSpaces(int count) {
        for (int i = 0; i < count; i++) System.out.print(" ");
    }

    private static boolean allElementsNull(List<GPTreeNode> list) {
        for (GPTreeNode node : list) {
            if (node != null) return false;
        }
        return true;
    }
}