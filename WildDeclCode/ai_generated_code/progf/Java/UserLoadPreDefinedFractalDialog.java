package org.ui.views;


import javafx.event.ActionEvent;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Dialog;
import javafx.scene.control.Label;
import javafx.scene.control.Slider;
import javafx.scene.layout.VBox;
import org.model.logic.ChaosGameDescriptionFactory;
import org.ui.controllers.MainWindowController;

/**
 * <h2>Represents a dialog for loading a predefined fractal.</h2>
 */
public class UserLoadPreDefinedFractalDialog extends Dialog {

  /**
   * The controller of the main window.
   */
  private final MainWindowController mainWindowController;

  /**
   * The slider for the steps.
   */
  private Slider stepsSlider;

  /**
   * The list of predefined fractals.
   */
  private ComboBox<String> fractalComboBox;

  /**
   * Contains all components of the dialog.
   */
  private VBox contentPane;

  /**
   * Label for no fractal selected error message.
   */
  private final Label noFractalSelectedLabel = new Label(" ");

  /**
   * Creates an instance of UserLoadPreDefinedFractalDialog.
   *
   * @param controller the controller of the main window
   */
  public UserLoadPreDefinedFractalDialog(MainWindowController controller) {
    super();
    this.mainWindowController = controller;
    initContent();
  }

  /**
   * Initializes the dialog.
   * The event handling part for the OK button was Assisted with basic coding tools.
   */
  public void initContent() {
    setTitle("Load Predefined Fractal");

    getDialogPane().getButtonTypes().addAll(ButtonType.OK, ButtonType.CANCEL);

    getDialogPane().getStylesheets().add(getClass().getResource(
        "/css/DialogStyleSheet.css").toExternalForm());
    getDialogPane().setPrefWidth(300);


    contentPane = new VBox();

    fractalComboBox = new ComboBox<>();
    fractalComboBox.setPromptText("Select a fractal");

    ChaosGameDescriptionFactory factory = new ChaosGameDescriptionFactory();

    for (int i = 0; i < factory.getListOfFractals().size(); i++) {
      fractalComboBox.getItems().add(factory.getListOfFractals().get(i));
    }

    stepsSlider = new Slider(1000, 20000000, 1000);
    stepsSlider.setShowTickLabels(true);
    stepsSlider.setBlockIncrement(10000);
    stepsSlider.setMajorTickUnit(100000);

    VBox sliderBox = new VBox();
    Label stepsLabel = new Label("Steps amount:");
    sliderBox.getChildren().addAll(stepsLabel, stepsSlider);

    stepsSlider.valueProperty().addListener((observable, oldValue, newValue) -> {
      stepsLabel.setText("Steps amount: " + (int) stepsSlider.getValue());
    });

    contentPane.setSpacing(20);

    contentPane.getChildren().addAll(fractalComboBox, sliderBox, noFractalSelectedLabel);

    getDialogPane().setContent(contentPane);

    Button okButton = (Button) getDialogPane().lookupButton(ButtonType.OK);
    okButton.addEventFilter(ActionEvent.ACTION, e -> {
      try {
        doConfirm();
      } catch (RuntimeException ex) {
        noFractalSelectedLabel.setText("Please select a fractal.");
        e.consume();
      }
    });
  }

  /**
   * Confirms the loading of fractal, displays an error message if no fractal is selected.
   */
  public void doConfirm() {
    if (fractalComboBox.getValue() != null) {
      mainWindowController.loadPreDefinedFractal(fractalComboBox.getValue(),
          (int) stepsSlider.getValue());
    } else {
      throw new RuntimeException("No fractal selected");
    }
  }
}

