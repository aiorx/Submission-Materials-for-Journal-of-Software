package MainUI;

import javax.swing.*;
import javax.swing.tree.*;
import java.awt.*;

public class WrappedTreeRndr extends DefaultTreeCellRenderer {
    //This class was Composed with basic coding tools

    JTextArea textArea;

    public WrappedTreeRndr() {
        textArea = new JTextArea();
        textArea.setLineWrap(true);
        textArea.setWrapStyleWord(true);
    }

    @Override
    public Component getTreeCellRendererComponent(JTree tree, Object value,
                                                  boolean sel, boolean expanded,
                                                  boolean leaf, int row, boolean hasFocus) {
        Component c = super.getTreeCellRendererComponent(
                tree, value, sel, expanded, leaf, row, hasFocus);
        if (leaf) {
            textArea.setText(value.toString());
            return textArea;
        } else {
            return c;
        }
    }

}
