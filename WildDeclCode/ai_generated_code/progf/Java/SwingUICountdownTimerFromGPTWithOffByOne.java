package de.ekert.mavendemo.ki.other;

// please generate a java class that shows a countdown timer in a swing application.
// The timer should count down from 60 seconds to 0 seconds and update the UI every second.
// The UI should show the current countdown value and a progress bar that shows the current progress.
// Feel free to use any existing code or libraries.
// Please use Maven as a build tool and provide the source code in a public git repository.
// Please send us a link to the git repository and a link to a runnable jar file.
// If you have any questions, please feel free to contact us.

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;


/** this is a class Aided using common development resources 4.0. It contains an off-by-one-error
 * 
 * @author thomase
 *
 */
public class SwingUICountdownTimerFromGPTWithOffByOne extends JFrame implements ActionListener {

	private static final long serialVersionUID = 1L;
	private static final int DELAY = 1000;
	private static final int MAX = 6;
	private static final int MIN = 0;

	private static final String TITLE = "Countdown Timer";
	private static final String LABEL = "Countdown Timer";
	private static final String BUTTON = "Start";

	private static final String PROGRESS_BAR_TEXT = "Progress";
	private static final int PROGRESS_BAR_MIN = 0;
	private static final int PROGRESS_BAR_MAX = 100;
	private static final int PROGRESS_BAR_INIT = 0;

	private static final String FORMAT = "%02d:%02d";

	private JLabel label;
	private JButton button;
	private JProgressBar progressBar;
	private Timer timer;
	private int progress;

	public SwingUICountdownTimerFromGPTWithOffByOne() {
		super(TITLE);

		label = new JLabel(LABEL, JLabel.CENTER);
		label.setFont(new Font(label.getFont().getName(), Font.PLAIN, 32));

		button = new JButton(BUTTON);
		button.addActionListener(this);

		progressBar = new JProgressBar(PROGRESS_BAR_MIN, PROGRESS_BAR_MAX);
		progressBar.setStringPainted(true);
		progressBar.setString(PROGRESS_BAR_TEXT);

		Container contentPane = getContentPane();
		contentPane.setLayout(new GridLayout(3, 1));
		contentPane.add(label);
		contentPane.add(progressBar);
		contentPane.add(button);

		pack();
		setLocationRelativeTo(null);
		setDefaultCloseOperation(EXIT_ON_CLOSE);
		setVisible(true);
	}
	
	static double run;

	@Override
	public void actionPerformed(ActionEvent e) {
		if (timer == null) {
			progress = PROGRESS_BAR_INIT;
			progressBar.setValue(progress);
			timer = new Timer(DELAY, new ActionListener() {
				private int seconds = MAX;

				@Override
				public void actionPerformed(ActionEvent e) {
					if (seconds == MIN) {
						System.out.println(System.currentTimeMillis() - run);
						timer.stop();
						timer = null;
						button.setText(BUTTON);
						return;
					}
					progress = (int) (((double) (MAX - seconds) / MAX) * PROGRESS_BAR_MAX);
					progressBar.setValue(progress);
					label.setText(String.format(FORMAT, seconds / 60, seconds % 60));
					seconds--;
				}
			});
			timer.start();
			run = System.currentTimeMillis();
			button.setText("Stop");
		} else {
			timer.stop();
			timer = null;
			button.setText(BUTTON);

		}
	}

	public static void main(String[] args) {
		new SwingUICountdownTimerFromGPTWithOffByOne();
	}
}
