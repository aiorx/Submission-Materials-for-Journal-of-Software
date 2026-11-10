package de.ekert.mavendemo.ki.other;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.SwingConstants;

//please generate a java class that shows a countdown timer in a swing application
/** this is a class Aided using common development resources 4.0. It seems to be correct.
 * 
 * @author thomase
 *
 */
public class CountdownTimerOriginalFromChatGPT_OK implements Runnable {
    private static final int ONE_SECOND = 1000;
    private static final int COUNTDOWN_START = 10;
    private static final int COUNTDOWN_END = 0;

    private int countDown = COUNTDOWN_START;
    private JLabel label;

    public CountdownTimerOriginalFromChatGPT_OK(JLabel label) {
        this.label = label;
    }

    @Override
    public void run() {
    	double run = System.currentTimeMillis();
        while (countDown > COUNTDOWN_END) {
            try {
                Thread.sleep(ONE_SECOND);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            countDown--;
            label.setText(String.valueOf(countDown));
        }
        System.out.println(System.currentTimeMillis() - run);
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Countdown Timer");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JLabel label = new JLabel(String.valueOf(COUNTDOWN_START),SwingConstants.CENTER);
        label.setFont(label.getFont().deriveFont(48f));
        frame.getContentPane().add(label);

        frame.pack();
        frame.setVisible(true);

        CountdownTimerOriginalFromChatGPT_OK countdownTimer = new CountdownTimerOriginalFromChatGPT_OK(label);
        Thread thread = new Thread(countdownTimer);
        thread.start();
    }
}