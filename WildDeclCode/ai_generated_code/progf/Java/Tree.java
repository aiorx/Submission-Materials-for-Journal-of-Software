import hu.notkulonme.tokenizer.Token;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class Tree {
    public Tree leftChild;
    public Tree rightChild;
    public Tree parent;
    public Token value;
    public ArrayList<Token> builderLeftChild;
    public ArrayList<Token> builderRightChild;

    public Tree(Tree leftChild, Tree rightChild, Token value) {
        this.leftChild = leftChild;
        this.rightChild = rightChild;
        this.parent = null;
        this.value = value;
    }

    public Tree(Tree leftChild, Tree rightChild, Tree parent, Token value) {
        this.leftChild = leftChild;
        this.rightChild = rightChild;
        this.parent = parent;
        this.value = value;
    }

    public Tree(Tree parent, Token value) {
        this.parent = parent;
        this.value = value;
    }

    public boolean isRoot() {
        return parent == null;
    }

    public Tree getRoot() {
        if (isRoot())
            return this;
        else
            return parent.getRoot();
    }

    public void delete() {
        if (parent.rightChild == this)
            parent.rightChild = null;
        else if (parent.leftChild == this)
            parent.leftChild = null;

        leftChild = null;
        rightChild = null;
        parent = null;
        value = null;
    }

    public void removeChildren() {
        leftChild = null;
        rightChild = null;
    }

    public void deleteChildren() {
        leftChild.delete();
        rightChild.delete();
    }

    public void setChildren(Tree left, Tree right) {
        this.leftChild = left;
        this.rightChild = right;
    }

    public boolean hasChildren() {
        return leftChild != null && rightChild != null;
    }


    public LinkedList<Tree> getLeafLevel() {
        var hasMoreLevel = true;
        LinkedList<Tree> list = new LinkedList<>();
        list.add(this.getRoot());
        do {
            var buffer = list.stream().filter(Tree::hasChildren).toList();
            if (!buffer.isEmpty()) {
                list = buffer.stream().flatMap(node -> Arrays.stream(new Tree[]{node.leftChild, node.rightChild})).collect(Collectors.toCollection(LinkedList::new));
            } else {
                hasMoreLevel = false;
            }
        } while (hasMoreLevel);

        return list;
    }

    public boolean leafLevelHasBuilder() {
        var leafLevel = getLeafLevel();
        return leafLevel.stream()
                .anyMatch(it -> it.builderLeftChild != null || it.builderRightChild != null);
    }

    //This function was Produced using common development resources
    public void printTree() {
        getRoot().printTree("", true);
    }

    //this function was Produced using common development resources
    private void printTree(String prefix, boolean isTail) {
        System.out.println(prefix + (isTail ? "└── " : "├── ") + value.getValue());

        List<Tree> children = new ArrayList<>();
        if (leftChild != null) children.add(leftChild);
        if (rightChild != null) children.add(rightChild);

        for (int i = 0; i < children.size(); i++) {
            boolean childIsTail = i == children.size() - 1;
            children.get(i).printTree(prefix + (isTail ? "    " : "│   "), childIsTail);
        }
    }

    public boolean exists() {
        return value != null;
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
