package org.ui.views;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Vector;
import java.util.concurrent.atomic.AtomicReference;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.Slider;
import javafx.scene.control.ToggleButton;
import javafx.scene.control.ToggleGroup;
import javafx.scene.control.Tooltip;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.image.PixelWriter;
import javafx.scene.image.WritableImage;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.util.Duration;
import org.enums.TransformationType;
import org.model.entity.AffineTransform2D;
import org.model.entity.Complex;
import org.model.entity.JuliaTransform;
import org.model.entity.Transform2D;
import org.model.entity.Vector2D;
import org.model.logic.ChaosCanvas;
import org.model.logic.ChaosGame;
import org.model.logic.ChaosGameObserver;
import org.ui.controllers.MainWindowController;

/**
 * Represents the main window of the application.
 * Responsible for viewing the main window of the application.
 */
public class MainWindow implements ChaosGameObserver {

  /**
   * The width of the canvas.
   */
  private final int canvasWidth = 2840;

  /**
   * The height of the canvas.
   */
  private final int canvasHeight = 1800;

  /**
   * The main node of the main window.
   */
  private final BorderPane mainNode = new BorderPane();

  /**
   * The sidebar of the main window.
   */
  private BorderPane sideBar;

  /**
   * The grid of the sidebar.
   */
  private GridPane sideBarGrid;

  /**
   * The controller of the main window.
   */
  private final MainWindowController mainWindowController = new MainWindowController(this);

  /**
   * The visible canvas of the main window.
   */
  private ImageView visibleCanvas;

  /**
   * The container for the transformation labels.
   */
  private VBox transformValueLabelContainer;

  /**
   * The label for the steps.
   */
  private Label stepsValueLabel;

  /**
   * The label for the minimum coordinates.
   */
  private Label minCoordsValueLabel;

  /**
   * The label for the maximum coordinates.
   */
  private Label maxCoordsValueLabel;

  /**
   * Button for selecting affine transformation.
   */
  private ToggleButton affineButton;

  /**
   * Button for selecting Julia transformation.
   */
  private ToggleButton juliaButton;

  /**
   * Container for the julia sliders.
   */
  private final VBox juliaComponentsContainer = new VBox();

  /**
   * Julia real part slider.
   */
  private Slider juliaRealPartSlider;

  /**
   * Julia imaginary part slider.
   */
  private Slider juliaImaginaryPartSlider;


  /**
   * Creates an instance of the main window.
   */
  public MainWindow() {
  }

  /**
   * Initializes the main window.
   */
  public void init() {
    initWelcomeScreen();
  }

  /**
   * Returns the main node of the main window.
   *
   * @return the main node of the main window
   */
  public BorderPane getMainNode() {
    return mainNode;
  }

  /**
   * Returns the width of the canvas.
   *
   * @return the width of the canvas
   */
  public int getCanvasWidth() {
    return this.canvasWidth;
  }

  /**
   * Returns the height of the canvas.
   *
   * @return the height of the canvas
   */
  public int getCanvasHeight() {
    return this.canvasHeight;
  }

  /**
   * Adds a game observer to the main window.
   *
   * @param game the game to add the observer for
   */
  public void addGameObserver(ChaosGame game) {
    game.addObserver(this);
  }

  /**
   * Initializes the welcome screen of the main window.
   */
  private void initWelcomeScreen() {
    Button startButton = new Button("Play");
    startButton.setStyle("-fx-font-size: 40");

    startButton.getStyleClass().add("welcome-screen-button");

    startButton.setOnAction(e -> {
      initGameScreen();
    });

    ImageView chaosGameLogo = new ImageView(new Image(Objects.requireNonNull(
        getClass().getResourceAsStream("/logos/welcome-screen-logo.png"))));

    VBox welcomeScreenContainer = new VBox();
    welcomeScreenContainer.getChildren().addAll(chaosGameLogo, startButton);
    welcomeScreenContainer.setAlignment(Pos.CENTER);
    welcomeScreenContainer.setSpacing(10);

    welcomeScreenContainer.getStyleClass().add("welcome-screen");
    this.mainNode.setCenter(welcomeScreenContainer);
  }

  /**
   * Initializes the game screen of the main window.
   */
  private void initGameScreen() {
    initSideBar();
    initSideBarGrid();
    initTransformTypeButtons();
    initSideBarValueLabels();
    initSideBarButtons();
    initCanvas();
  }

  /**
   * Initializes the canvas of the main window.
   */
  private void initCanvas() {
    StackPane canvasContainer = new StackPane();
    this.mainNode.setCenter(canvasContainer);
    BorderPane.setAlignment(canvasContainer, Pos.CENTER);
    WritableImage canvas = new WritableImage(this.canvasWidth, this.canvasHeight);

    canvasContainer.setMinWidth(canvasWidth);
    canvasContainer.setMinHeight(canvasHeight);

    this.visibleCanvas = new ImageView(canvas);
    visibleCanvas.setPreserveRatio(true);
    canvasContainer.getChildren().add(visibleCanvas);

    this.visibleCanvas.setFitHeight(0);
    this.visibleCanvas.setFitWidth(0);

    canvasContainer.setMinHeight(0);
    canvasContainer.setMinWidth(0);

    this.visibleCanvas.fitHeightProperty().bind(canvasContainer.heightProperty());
    this.visibleCanvas.fitWidthProperty().bind(canvasContainer.widthProperty());

    addCanvasEventListeners(canvasContainer);
  }

  /**
   * Adds event listeners to canvas.
   */
  private void addCanvasEventListeners(StackPane canvasContainer) {
    canvasContainer.setOnScroll(e -> {
      int direction = e.getDeltaY() > 0 ? 1 : -1;
      mainWindowController.handleZoom(new Vector2D(e.getX(), e.getY()), direction, canvasContainer);
    });

    List<Vector2D> mousePosition = new ArrayList<>();

    canvasContainer.setOnMousePressed(event -> {
      double mouseX = event.getSceneX();
      double mouseY = event.getSceneY();
      mousePosition.add(new Vector2D(mouseX, mouseY));
    });

    canvasContainer.setOnMouseDragged(event -> {
      double mouseX = event.getSceneX();
      double mouseY = event.getSceneY();
      Vector2D currMousePosition = new Vector2D(mouseX, mouseY);

      Vector2D mouseDelta = currMousePosition.subtract(mousePosition.getLast());
      mainWindowController.handlePan(mouseDelta, canvasContainer);

      mousePosition.clear();
      mousePosition.add(currMousePosition);
    });
  }

  /**
   * Updates the canvas of the main window.
   *
   * @param canvas canvas data to update the canvas with
   */
  public void updateCanvas(ChaosCanvas canvas) {
    int width = canvas.getWidth();
    int height = canvas.getHeight();

    WritableImage writableImage = new WritableImage(width, height);
    PixelWriter pixelWriter = writableImage.getPixelWriter();

    for (int i = 0; i < height; i++) {
      for (int j = 0; j < width; j++) {
        if (canvas.getCanvasArray()[i][j] >= 1) {
          int canvasPixelValue = canvas.getCanvasArray()[i][j] * 50;

          int red = (canvasPixelValue >> 2) & 0xff;
          int green = (canvasPixelValue >> 1) & 0xff;
          int blue = (canvasPixelValue) & 0xff;
          Color color = Color.rgb(red, green, blue);

          pixelWriter.setColor(j, i, color);
        }
      }
    }

    visibleCanvas.setImage(writableImage);
  }

  /**
   * Initializes the sidebar of the main window.
   */
  private void initSideBar() {
    this.sideBar = new BorderPane();
    mainNode.setLeft(sideBar);
    HBox chaosGameContainer = new HBox();
    chaosGameContainer.setAlignment(Pos.CENTER);

    ImageView chaosGameLogo = new ImageView(new Image(Objects.requireNonNull(
        getClass().getResourceAsStream("/logos/chaos-game-sidebar-logo.png"))));

    chaosGameLogo.setFitWidth(330);
    chaosGameLogo.setFitHeight(70);

    chaosGameContainer.getChildren().add(chaosGameLogo);
    chaosGameContainer.setAlignment(Pos.CENTER);
    this.sideBar.setTop(chaosGameContainer);
    sideBar.getStyleClass().add("sidebar");
  }

  /**
   * Initializes the grid of the sidebar.
   */
  private void initSideBarGrid() {
    this.sideBarGrid = new GridPane();

    sideBarGrid.setMaxWidth(330);

    this.sideBar.setLeft(sideBarGrid);
    this.sideBarGrid.add(this.juliaComponentsContainer, 0, 3);
    this.juliaComponentsContainer.setSpacing(10);
    this.juliaComponentsContainer.setPadding(new Insets(10));
  }

  /**
   * Initializes the transformation type buttons of the sidebar.
   */
  private void initTransformTypeButtons() {
    this.affineButton = new ToggleButton("Affine");
    this.affineButton.setPrefSize(138, 32);

    this.juliaButton = new ToggleButton("Julia");
    this.juliaButton.setPrefSize(138, 32);

    ToggleGroup transformTypeGroup = new ToggleGroup();
    this.affineButton.setToggleGroup(transformTypeGroup);
    this.juliaButton.setToggleGroup(transformTypeGroup);

    this.juliaButton.setOnAction(e -> {
      this.mainWindowController.initializeTransformation(TransformationType.JULIA);
    });
    this.affineButton.setOnAction(e -> {
      this.mainWindowController.initializeTransformation(TransformationType.AFFINE_2D);
    });

    HBox buttonContainer = new HBox();
    VBox transformTypeContainer = new VBox();
    buttonContainer.getChildren().addAll(this.affineButton, this.juliaButton);
    buttonContainer.setSpacing(10);
    transformTypeContainer.getChildren().addAll(buttonContainer);

    transformTypeContainer.setPadding(new Insets(10));
    this.sideBarGrid.add(transformTypeContainer, 0, 0);

    this.affineButton.getStyleClass().add("transformTypeButtons");
    this.juliaButton.getStyleClass().add("transformTypeButtons");
  }

  /**
   * Initializes the value labels of the sidebar.
   */
  private void initSideBarValueLabels() {
    Label stepsLabel = new Label("Steps");
    stepsLabel.setStyle("-fx-font-size: 20");

    VBox stepsLabelContainer = new VBox();
    this.stepsValueLabel = new Label(" ");
    this.stepsValueLabel.setStyle("-fx-font-size: 30");
    stepsLabelContainer.getChildren().addAll(stepsLabel, this.stepsValueLabel);

    Label minCoordsLabel = new Label("Min Coords");
    minCoordsLabel.setStyle("-fx-font-size: 20");

    this.minCoordsValueLabel = new Label(" ");
    this.minCoordsValueLabel.setStyle("-fx-font-size: 30");

    VBox minCoordsLabelContainer = new VBox();
    minCoordsLabelContainer.getChildren().addAll(minCoordsLabel, this.minCoordsValueLabel);

    Label maxCoordsLabel = new Label("Max Coords");
    maxCoordsLabel.setStyle("-fx-font-size: 20");

    this.maxCoordsValueLabel = new Label(" ");
    this.maxCoordsValueLabel.setStyle("-fx-font-size: 30");

    VBox maxCoordsLabelContainer = new VBox();
    maxCoordsLabelContainer.getChildren().addAll(maxCoordsLabel, this.maxCoordsValueLabel);

    VBox transformLabelContainer = new VBox();
    Label transformLabel = new Label("Transforms");
    transformLabel.setStyle("-fx-font-size: 20");


    transformValueLabelContainer = new VBox();
    transformLabelContainer.getChildren().addAll(transformLabel, transformValueLabelContainer);

    VBox valueLabelsContainer = new VBox();
    valueLabelsContainer.setSpacing(25);
    valueLabelsContainer.setPadding(new Insets(10));
    valueLabelsContainer.getChildren().addAll(stepsLabelContainer, minCoordsLabelContainer,
        maxCoordsLabelContainer, transformLabelContainer);

    ScrollPane valueLabelsScrollPane = new ScrollPane();
    valueLabelsScrollPane.setContent(valueLabelsContainer);
    valueLabelsScrollPane.setFitToWidth(true);

    sideBarGrid.add(valueLabelsScrollPane, 0, 2);

    // CSS Styling
    valueLabelsContainer.getStyleClass().add("sideBarValueLabelPane");
    valueLabelsScrollPane.getStyleClass().add("sideBarValueLabelPane");

    stepsLabel.getStyleClass().add("sideBarLabels");
    this.stepsValueLabel.getStyleClass().add("valueLabels");

    minCoordsLabel.getStyleClass().add("sideBarLabels");
    maxCoordsLabel.getStyleClass().add("sideBarLabels");
    transformLabel.getStyleClass().add("sideBarLabels");

    this.minCoordsValueLabel.getStyleClass().add("valueLabels");
    this.maxCoordsValueLabel.getStyleClass().add("valueLabels");
  }

  /**
   * Adds transforms to the sidebar.
   *
   * @param transforms transforms to add to the sidebar
   */
  public void updateTransformValueLabels(ArrayList<Transform2D> transforms) {
    transformValueLabelContainer.getChildren().clear();
    for (Transform2D transform : transforms) {
      Label label = TransformLabelFactory.getTransformLabel(transform);
      label.getStyleClass().add("valueLabels");
      label.setStyle("-fx-font-size: 18");
      transformValueLabelContainer.getChildren().add(label);
    }
  }

  /**
   * Updates the steps value label of the sidebar.
   *
   * @param steps the steps to update the label with
   */
  public void updateStepsValueLabel(int steps) {
    this.stepsValueLabel.setText(String.valueOf(steps));
  }

  /**
   * Updates the minimum coordinates value label of the sidebar.
   */
  public void updateMinCoordsValueLabel(Vector2D vector2D) {
    this.minCoordsValueLabel.setText(CoordinateLabelFactory.buildCoordinateLabel(vector2D));
  }

  /**
   * Updates the maximum coordinates value label of the sidebar.
   */
  public void updateMaxCoordsValueLabel(Vector2D vector2D) {
    this.maxCoordsValueLabel.setText(CoordinateLabelFactory.buildCoordinateLabel(vector2D));
  }

  /**
   * Initializes the sidebar buttons of the main window.
   */
  private void initSideBarButtons() {
    Button editButton = new Button();
    editButton.setPrefSize(64, 64);

    Button loadExistingFractalButton = new Button();
    loadExistingFractalButton.setPrefSize(64, 64);

    Button saveToFileButton = new Button();
    saveToFileButton.setPrefSize(64, 64);

    Button uploadFileButton = new Button();
    uploadFileButton.setPrefSize(64, 64);

    Tooltip editButtonTooltip = new Tooltip("Edit existing fractal");
    editButtonTooltip.setShowDelay(Duration.millis(500));
    editButton.setTooltip(editButtonTooltip);

    Tooltip loadExistingFractalButtonTooltip = new Tooltip("Load existing fractal");
    loadExistingFractalButtonTooltip.setShowDelay(Duration.millis(500));
    loadExistingFractalButton.setTooltip(loadExistingFractalButtonTooltip);

    Tooltip saveToFileButtonTooltip = new Tooltip("Save to file");
    saveToFileButtonTooltip.setShowDelay(Duration.millis(500));
    saveToFileButton.setTooltip(saveToFileButtonTooltip);

    Tooltip uploadFileButtonTooltip = new Tooltip("Upload file");
    uploadFileButtonTooltip.setShowDelay(Duration.millis(500));
    uploadFileButton.setTooltip(uploadFileButtonTooltip);

    HBox buttonContainer = new HBox();
    buttonContainer.getChildren()
        .addAll(editButton, loadExistingFractalButton, uploadFileButton, saveToFileButton);
    buttonContainer.setPadding(new Insets(10));
    buttonContainer.setSpacing(10);

    buttonContainer.setAlignment(Pos.CENTER);
    sideBar.setBottom(buttonContainer);

    uploadFileButton.setOnAction(e -> {
      mainWindowController.doUserUploadFile();
    });

    loadExistingFractalButton.setOnAction(e -> {
      mainWindowController.doUserLoadPreDefinedFractal();
    });

    saveToFileButton.setOnAction(e -> {
      mainWindowController.doUserSaveToFile();
    });

    editButton.setOnAction(e -> {
      mainWindowController.doUserEditExistingFractal();
    });

    saveToFileButton.setGraphic(new ImageView(new Image(Objects.requireNonNull(
        getClass().getResourceAsStream("/buttonicons/file-save-white-32.png")))));
    uploadFileButton.setGraphic(new ImageView(new Image(Objects.requireNonNull(
        getClass().getResourceAsStream("/buttonicons/file-upload-white-32.png")))));
    loadExistingFractalButton.setGraphic(new ImageView(new Image(Objects.requireNonNull(
        getClass().getResourceAsStream("/buttonicons/reset-white-32.png")))));
    editButton.setGraphic(new ImageView(new Image(
        Objects.requireNonNull(getClass().getResourceAsStream("/buttonicons/edit-white-32.png")))));

    editButton.getStyleClass().add("sideBarBottomButtons");
    loadExistingFractalButton.getStyleClass().add("sideBarBottomButtons");
    saveToFileButton.getStyleClass().add("sideBarBottomButtons");
    uploadFileButton.getStyleClass().add("sideBarBottomButtons");

    editButtonTooltip.getStyleClass().add("tooltip");
  }

  /**
   * Updates the sliders of the main window.
   *
   * @param game the game to update the sliders for
   */
  private void updateSliderPositions(ChaosGame game) {
    Transform2D transform = game.getDescription().getTransformations().getFirst();

    if (juliaRealPartSlider != null && juliaImaginaryPartSlider != null
        && !juliaComponentsContainer.getChildren().isEmpty()) {
      juliaRealPartSlider.setValue(((JuliaTransform) transform).getPoint().getX0());
      juliaImaginaryPartSlider.setValue(((JuliaTransform) transform).getPoint().getX1());
    }
  }

  /**
   * Handles the sliders of the main window.
   * Incrementation part of the listener was Supported via standard programming aids.
   *
   * @param game the game to handle the sliders for
   */
  private void handleJuliaComponents(ChaosGame game) {
    Transform2D transform = game.getDescription().getTransformations().getFirst();
    if (transform instanceof AffineTransform2D || transform == null) {
      juliaComponentsContainer.getChildren().clear();
    }

    if (transform instanceof JuliaTransform) {
      if (juliaComponentsContainer.getChildren().isEmpty()) {
        Label juliaRealLabel = new Label("Real part:");
        Label juliaImaginaryLabel = new Label("Imaginary part:");

        juliaImaginaryLabel.getStyleClass().add("sideBarLabels");
        juliaRealLabel.getStyleClass().add("sideBarLabels");

        juliaRealPartSlider =
            new Slider(-1.5, 1.5, ((JuliaTransform) transform).getPoint().getX0());
        juliaImaginaryPartSlider =
            new Slider(-1.5, 1.5, ((JuliaTransform) transform).getPoint().getX1());

        HBox animationButtonContainer = new HBox();
        animationButtonContainer.setSpacing(10);
        Button animationPlayButton = new Button();
        animationPlayButton.setOnAction(e -> {
          mainWindowController.runJuliaAnimation();
        });
        animationPlayButton.setGraphic(new ImageView(new Image(Objects.requireNonNull(
            getClass().getResourceAsStream("/buttonicons/play-white-16.png")))));
        animationPlayButton.getStyleClass().add("sideBarBottomButtons");

        Button animationStopButton = new Button();
        animationStopButton.setOnAction(e -> {
          mainWindowController.stopJuliaAnimation();
        });
        animationStopButton.setGraphic(new ImageView(new Image(Objects.requireNonNull(
            getClass().getResourceAsStream("/buttonicons/pause-white-16.png")))));
        animationStopButton.getStyleClass().add("sideBarBottomButtons");
        animationButtonContainer.getChildren().addAll(animationPlayButton, animationStopButton);

        juliaComponentsContainer.getChildren()
            .addAll(juliaRealLabel, juliaRealPartSlider, juliaImaginaryLabel,
                juliaImaginaryPartSlider, animationButtonContainer);

        juliaRealPartSlider.valueProperty().addListener(new ChangeListener<Number>() {
          double lastValue = juliaRealPartSlider.getValue();

          @Override
          public void changed(ObservableValue<? extends Number> observable, Number oldValue,
                              Number newValue) {
            if (Math.abs(newValue.doubleValue() - lastValue) > 0.01) {
              mainWindowController.updateJuliaTransformations(
                  new Complex(juliaRealPartSlider.getValue(), juliaImaginaryPartSlider.getValue()));
              lastValue = newValue.doubleValue();
            }
          }
        });

        juliaImaginaryPartSlider.valueProperty().addListener(new ChangeListener<Number>() {
          double lastValue = juliaRealPartSlider.getValue();

          @Override
          public void changed(ObservableValue<? extends Number> observable, Number oldValue,
                              Number newValue) {
            if (Math.abs(newValue.doubleValue() - lastValue) > 0.01) {
              mainWindowController.updateJuliaTransformations(
                  new Complex(juliaRealPartSlider.getValue(), juliaImaginaryPartSlider.getValue()));
              lastValue = newValue.doubleValue();
            }
          }
        });
      }
    }
  }

  /**
   * Method called by the observables to update the main window.
   */
  @Override
  public void onUpdate() {
    updateCanvas(mainWindowController.getChaosGame().getCanvas());
    updateStepsValueLabel(mainWindowController.getChaosGame().getSteps());
    updateMinCoordsValueLabel(mainWindowController.getChaosGame().getDescription().getMinCoords());
    updateMaxCoordsValueLabel(mainWindowController.getChaosGame().getDescription().getMaxCoords());
    updateTransformValueLabels(
        mainWindowController.getChaosGame().getDescription().getTransformations());
    handleJuliaComponents(mainWindowController.getChaosGame());
    updateSliderPositions(mainWindowController.getChaosGame());
  }
}
