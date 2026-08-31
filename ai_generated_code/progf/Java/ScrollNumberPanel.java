import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

//Composed with basic coding tools because no one on stackoverflow knows shit about this
//not going to use this but it's cool
//we can use + or - keys to zoom in and out
// https://docs.oracle.com/javase/8/docs/api/java/awt/event/MouseWheelEvent.html

public class ScrollNumberPanel extends JPanel implements MouseWheelListener {
    private int number = 1;

    public ScrollNumberPanel() {
        setPreferredSize(new Dimension(200, 100));
        setBackground(Color.WHITE);
        addMouseWheelListener(this);
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.setFont(new Font("SansSerif", Font.BOLD, 36));
        String text = Integer.toString(number);
        FontMetrics fm = g.getFontMetrics();
        int x = (getWidth() - fm.stringWidth(text)) / 2;
        int y = (getHeight() + fm.getAscent()) / 2 - fm.getDescent();
        g.setColor(Color.BLACK);
        g.drawString(text, x, y);
    }

    @Override
    public void mouseWheelMoved(MouseWheelEvent e) {
        // getPreciseWheelRotation allows better handling of trackpads
        double rotation = e.getPreciseWheelRotation();
        if (rotation < 0) {
            number++;
        } else if (rotation > 0 && number > 1) {
            number--;
        }
        repaint();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Scroll Number Panel");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.getContentPane().add(new ScrollNumberPanel());
            frame.pack();
            frame.setLocationRelativeTo(null);
            frame.setVisible(true);
        });
    }
}