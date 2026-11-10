package cs5044.adventure.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Container extends GameObject implements Openable {
    public List<GameObject> children;
   // private boolean isLocked = false;
    private boolean isVisible = false;
    private boolean isOpen = false;

    // Visibility method
    public boolean isVisible() {
        return this.isVisible;
    }


    // Fields used in contentsDescription
    protected String contentsPrefix = "In " + theName() + " you see";
    protected String contentsSuffix = ".";

    // Constructor calls through to super
    public Container(String name) {
        super(name);
        children = new ArrayList<>();
    }

    public void setContentsPrefix(String contentsPrefix) {
        this.contentsPrefix = contentsPrefix;
    }

    public void setContentsSuffix(String contentsSuffix) {
        this.contentsSuffix = contentsSuffix;
    }

    // Visibility of hidden objects
    public void setVisible(boolean visible) {
        this.isVisible = visible;
    }


    public String getContentsDescription() {
        if (!isVisible) {
            return " ";
        }

        if (children == null || children.isEmpty()) {
            return "It is empty.";
        }

        List<String> aList = children.stream()
                .filter(this::shouldBeListed)
                .map(GameObject::aName)
                .toList();

        if (aList.isEmpty()) {
            return "It is empty.";
        }

        return contentsPrefix + " " + Message.commaSep(aList) + contentsSuffix;
    }

    private boolean shouldBeListed(GameObject gameObject) {
        return (!(gameObject instanceof Person) && (gameObject instanceof Item || gameObject instanceof Container));
    }

    public void addChild(GameObject gameObject) {
        if (this.hasAncestor(gameObject)) {
            throw new IllegalArgumentException("Cannot add a GameObject as a child of itself or its descendant");
        }
        gameObject.setParent(this);
        children.add(gameObject);
        // Force update of subtree map
        getSubtreeMap().put(gameObject.getName(), gameObject);
    }

    public void removeChild(GameObject gameObject) {
        gameObject.setParent(null);
        children.remove(gameObject);
        // we do not remove the game object from the map
        // when a game object is created, it is added to the map, and it's parent is null
        // when a game object is added to a container, it's parent becomes the container
        // when a game object is removed from a container, it's parent becomes null again,
        // but it stays in the world map
    }

    // Adapted from standard coding samples, modified
    public Map<String, GameObject> getSubtreeMap() {
        Map<String, GameObject> subtreeMap = new HashMap<>();
        populateSubtreeMap(this, subtreeMap);
        return subtreeMap;
    }

    // Recursive helper method to populate the subtree map
    private void populateSubtreeMap(GameObject component, Map<String, GameObject> map) {
        map.put(component.getName(), component);

        if (component instanceof Container) {
            Container container = (Container) component;
            for (GameObject child : container.children) {
                populateSubtreeMap(child, map);
            }
        }
    }

    // Content Discovery Helper Method
    private boolean contentsRevealed = false;

    public boolean isContentsRevealed() {
        return contentsRevealed;
    }

    // Game objects open-close status
    public void open () {
        if (isOpen) {
            World.currentMessage = "The " + theName() + " is already open.";
        } else {
            isOpen = true;
            World.currentMessage = "You open the " + theName() + ".";
        }
    }
    public boolean isOpen() {
        return isOpen;
    }

    public void setOpen(boolean open) {
        this.isOpen = open;
    }

    public void close() {
        if (!isOpen) {
            World.currentMessage = "The " + theName() + " is already closed.";
        } else {
            isOpen = false;
            World.currentMessage = "You close the " + theName() + ".";
        }
    }
    public void revealContents() {
        this.contentsRevealed = true;
    }

}

