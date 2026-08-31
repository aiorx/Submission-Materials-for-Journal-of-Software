package com.myjavafxtemplate.myapp.java.controllers;

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Timer;
import java.util.TimerTask;
import java.util.function.Consumer;
import com.myjavafxtemplate.myapp.java.models.Client;
import com.myjavafxtemplate.myapp.java.utility.AppSecurity;
import com.myjavafxtemplate.myapp.java.utility.AppSettings;
import javafx.application.Platform;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.DatePicker;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableRow;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;


public class ClientController {

    private ObservableList<Client> clientsObsList = FXCollections.observableArrayList();

    /** The body. **/

    @FXML 
    private StackPane ClientBody;

    @FXML
    private TableView<Client> Table_Client;

    @FXML
    private TableColumn<Client, String> Name_Client;

    @FXML
    private TableColumn<Client, String> Surname_Client;

    @FXML
    private TableColumn<Client, String> Date_Nais_Client;

    @FXML
    private TableColumn<Client, String> Tel_Client;

    @FXML
    private TableColumn<Client, String> Email_Client;

    @FXML
    private Button createClientButton;

    @FXML
    private TextField searchField;


    public void initialize() {

        loadingTableIcon();

        new Thread(() -> {
            Platform.runLater(() -> {
                readAllClients();
                updateTableView();
                searchTable();
            });
        }).start();

        // When data's row is clicked, open overlay with data from that row
        openOverlayPopulateData();

        // Create a new Client
        openOverlayNewClient();

    }

    private void loadingTableIcon() {
        // Load the loading GIF
        Image loadingImage = new Image(getClass().getResourceAsStream(AppSettings.INSTANCE.imagesPath+"loading.gif"));
        ImageView loadingImageView = new ImageView(loadingImage);

        // Set the loading GIF as the custom placeholder
        Table_Client.setPlaceholder(loadingImageView);
    }

    private ObservableList<Client> readAllClients() {

        // Get raw data from the Client model
        List<List<Object>> rawClientData = null;
        Label placeholderLabel = new Label(); // Create label outside of the timer

        try {
            rawClientData = Client.getAllClientsData();
        } catch (Exception e) {
            final int[] seconds = {30}; // Initial countdown value

            Timer timer = new Timer();
            timer.scheduleAtFixedRate(new TimerTask() {
                public void run() {
                    Platform.runLater(() -> {
                        placeholderLabel.setText("Connection to the database failed. Retrying in " + seconds[0] + " sec.");
                        Table_Client.setPlaceholder(placeholderLabel);
                        seconds[0]--;

                        if (seconds[0] < 0) {
                            timer.cancel(); // Stop the timer when the countdown reaches zero
                            readAllClients(); // Optionally, trigger another attempt here
                        }
                    });
                }
            }, 0, 1000);
        }


        if (rawClientData != null) {
            for (List<Object> row : rawClientData) {

                String nom = (String) row.get(1);
                String prenom = (String) row.get(2);
                // Convert date to java.time.LocalDate
                java.sql.Timestamp timestamp = (java.sql.Timestamp) row.get(3);
                LocalDate date_nais = timestamp.toLocalDateTime().toLocalDate();
                String tel = (String) row.get(4);
                String email = (String) row.get(5);
                // Create a Client object and add to the list
                clientsObsList.add(new Client(nom, prenom, date_nais, tel, email));
            }
        }
        return clientsObsList;
    }


    private void updateTableView() {

        // Set the items with the correct data type
        Table_Client.setItems(clientsObsList);

        // Populate columns of TableView with the data
        Name_Client.setCellValueFactory(param -> new SimpleStringProperty(param.getValue().getNomClient()));
        Surname_Client.setCellValueFactory(param -> new SimpleStringProperty(param.getValue().getPrenomClient()));
        Date_Nais_Client.setCellValueFactory(param -> new SimpleStringProperty(param.getValue().getDateNaisClient().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
        Tel_Client.setCellValueFactory(param -> new SimpleStringProperty(param.getValue().getTelClient()));
        Email_Client.setCellValueFactory(param -> new SimpleStringProperty(param.getValue().getEmailClient()));

    }

    private void openOverlayPopulateData() {
        Table_Client.setRowFactory(tv -> {
            TableRow<Client> row = new TableRow<>();
            row.setOnMouseClicked(event -> {
                if (event.getClickCount() == 1 && !row.isEmpty()) {
                    Client rowData = row.getItem();
                    openOverlayWithClientData(rowData);
                }
            });
            return row;
        });
    }

    private void openOverlayNewClient() {
        createClientButton.setOnMouseClicked(event -> {
            openOverlayForNewClient();
        });
    }

    private void createOverlay(StackPane stackPane, Consumer<BorderPane> contentPopulationCallback) {
        // Create a darkened overlay pane
        Pane overlayPane = new Pane();
        overlayPane.setStyle("-fx-background-color: rgba(0, 0, 0, 0.4);"); // Semi-transparent black background
        overlayPane.setPrefSize(stackPane.getWidth(), stackPane.getHeight());

        // Create your content pane
        BorderPane contentPane = new BorderPane();
        contentPane.setId("overlayContentPane");
        contentPane.setPrefSize(500, 500);

        // Use the callback to populate the content
        contentPopulationCallback.accept(contentPane);

        // Ensure overlayPane is visible and on top
        overlayPane.setVisible(true);
        overlayPane.toFront();
        // Add the content pane to the overlay pane
        overlayPane.getChildren().add(contentPane);

        // Add the overlay pane to the root StackPane
        stackPane.getChildren().add(overlayPane);

        // Set the dimensions after the stage is shown
        contentPane.setLayoutX((stackPane.getWidth() - contentPane.getPrefWidth()) / 2);
        contentPane.setLayoutY(80);

    }

    // overlay with client data
    private void openOverlayWithClientData(Client client) {
        createOverlay(ClientBody, contentPane -> populateOverlayContent(contentPane, client));
    }

    // overlay for a new client
    private void openOverlayForNewClient() {
        createOverlay(ClientBody, contentPane -> populateOverlayForNewClient(contentPane));
    }

    //  when clicking on a row in Tableview, populate the data of that row in the overlay
    private void populateOverlayContent(BorderPane contentPane, Client client) {

        Label nameLabel = new Label("Name");
        nameLabel.setId("NOM_CLIENT");
        TextField nameField = new TextField();
        nameField.setText(client.getNomClient());

        Label surnameLabel = new Label("Surname");
        surnameLabel.setId("PRENOM_CLIENT");
        TextField surnameField = new TextField();
        surnameField.setText(client.getPrenomClient());

        Label date_naisLabel = new Label("Birthday");
        date_naisLabel.setId("DATE_NAIS_CLIENT");
        DatePicker date_naisField = new DatePicker();
        date_naisField.setValue(client.getDateNaisClient());

        Label telLabel = new Label("Telephone");
        telLabel.setId("TEL_CLIENT");
        TextField telField = new TextField();
        telField.setText(client.getTelClient());

        Label emailLabel = new Label("Email");
        emailLabel.setId("EMAIL_CLIENT");
        TextField emailField = new TextField();
        emailField.setText(client.getEmailClient());

        VBox overLayContent = new VBox();
        overLayContent.setId("overLayContent");
        overLayContent.getChildren().addAll(nameLabel, nameField, surnameLabel, surnameField, date_naisLabel, date_naisField, telLabel, telField, emailLabel, emailField);

        Button buttonDelete = new Button("Delete");
        buttonDelete.setId("DeleteButton");
        Button buttonOk = new Button("ok");
        Button buttonCancel = new Button("Cancel");

        HBox overlayBottomButtons = new HBox();
        overlayBottomButtons.setId("overlayBottomButtons");
        overlayBottomButtons.getChildren().addAll(buttonOk, buttonCancel);

        HBox overlayTopDelete = new HBox();
        overlayTopDelete.setId("overlayTopDelete");
        overlayTopDelete.getChildren().addAll(buttonDelete);

        contentPane.setTop(overlayTopDelete);
        contentPane.setCenter(overLayContent);
        contentPane.setBottom(overlayBottomButtons);

        // buttons event logic
        buttonCancel.setOnAction(e -> {
            closeOverlay();
        });

        buttonDelete.setOnAction(e -> {
            deleteClient(client);
            getClientsObsList().remove(client);
            closeOverlay();
        });

        buttonOk.setOnAction(e -> {
            updateClient(client, nameLabel.getId(),         client.getNomClient(),      nameField.getText(),        emailLabel.getId(),     client.getEmailClient() );
            updateClient(client, surnameLabel.getId(),      client.getPrenomClient(),   surnameField.getText(),     emailLabel.getId(),     client.getEmailClient() );
            updateClient(client, date_naisLabel.getId(),    client.getDateNaisClient(), date_naisField.getValue(),  emailLabel.getId(),     client.getEmailClient() );
            updateClient(client, telLabel.getId(),          client.getTelClient(),      telField.getText(),         emailLabel.getId(),     client.getEmailClient() );
            updateClient(client, emailLabel.getId(),        client.getEmailClient(),    emailField.getText(),       emailLabel.getId(),     client.getEmailClient() );
            closeOverlay();
        });
    }

    private void deleteClient(Client client) {
        client.deleteClientDB(client.getTelClient());
    }

    public void updateClient(Client client, String fieldName, Object oldValue, Object newValue, String checkColumn, String checkValue) {

        if(!(newValue instanceof LocalDate)) {
            newValue = AppSecurity.sanitize(newValue.toString());
        }

        switch (fieldName) {
        case "NOM_CLIENT" -> {
            if (compare(oldValue, newValue)) {

                try {
                    client.updateClientDB(fieldName, newValue, checkColumn, checkValue);
                    client.setNomClient(newValue.toString());
                    System.out.println("name has been changed");
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        case "PRENOM_CLIENT" -> {
            if (compare(oldValue, newValue)) {
                try {
                    client.updateClientDB(fieldName, newValue, checkColumn, checkValue);
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                client.setPrenomClient(newValue.toString());
                System.out.println("surname has been changed");
            }
        }
        case "DATE_NAIS_CLIENT" -> {
            if (compare(oldValue, newValue)) {
                try {
                    client.updateClientDB(fieldName, newValue, checkColumn, checkValue);
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                LocalDate newDate = LocalDate.parse(newValue.toString(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                client.setDateNaisClient(newDate);
                System.out.println("date_nais has been changed");
            }
        }
        case "TEL_CLIENT" -> {
            if (compare(oldValue, newValue)) {
                try {
                    client.updateClientDB(fieldName, newValue, checkColumn, checkValue);
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                client.setTelClient(newValue.toString());
                System.out.println("tel has been changed");
            }
        }
        case "EMAIL_CLIENT" -> {
            if (compare(oldValue, newValue)) {
                try {
                    client.updateClientDB(fieldName, newValue, checkColumn, checkValue);
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                client.setEmailClient(newValue.toString());
                System.out.println("email has been changed");
            }
        }
        default -> {}
        }
        Table_Client.refresh();
    }

    private boolean compare(Object oldValue, Object newValue) {
        return !Objects.equals(oldValue, newValue);
    }


    // populating inputs in the overlay when clicking create new client
    private void populateOverlayForNewClient(BorderPane contentPane) {

        Label nameLabel = new Label("Name");
        TextField nameField = new TextField();

        Label surnameLabel = new Label("Surname");
        TextField surnameField = new TextField();

        Label date_naisLabel = new Label("Date_Nais");
        DatePicker date_naisField = new DatePicker();

        Label telLabel = new Label("Tel");
        TextField telField = new TextField();

        Label emailLabel = new Label("Email");
        TextField emailField = new TextField();

        Label errorLabel = new Label("");
        errorLabel.setId("errorLabelnewClient");

        VBox overLayContent = new VBox();
        overLayContent.setId("overLayContent");
        overLayContent.getChildren().addAll(nameLabel, nameField, surnameLabel, surnameField, date_naisLabel, date_naisField, telLabel, telField, emailLabel, emailField, errorLabel);

        Button buttonOk = new Button("ok");
        Button buttonCancel = new Button("Cancel");

        HBox overlayBottomButtons = new HBox();
        overlayBottomButtons.setId("overlayBottomButtons");
        overlayBottomButtons.getChildren().addAll(buttonOk, buttonCancel);

        contentPane.setCenter(overLayContent);
        contentPane.setBottom(overlayBottomButtons);

        // buttons event logic
        buttonCancel.setOnAction(e -> {
            closeOverlay();
        });

        buttonOk.setOnAction(e -> {
            String newClientOK = createNewClient(nameField.getText(), surnameField.getText(), date_naisField.getValue(), telField.getText(), emailField.getText());

            if(newClientOK.equals("")) {
                closeOverlay();
            }else {
                errorLabel.setText(newClientOK);
            }
        });
    }

    private String createNewClient(String nameField, String SurnameField, LocalDate date_naisField, String telField, String emailField) {

        Client newClient = new Client(nameField, SurnameField, date_naisField, telField, emailField);

        try {
            newClient.insertClientDB(newClient);
            System.out.println(newClient.toString() + " added to database without problem");
            getClientsObsList().add(newClient);
        } catch (SQLException e) {
            String errorMessage = e.getMessage();
            int startIndex = errorMessage.indexOf("ORA-20001: ");
            if (startIndex != -1) {
                // Extract the substring from the index to the end of the line
                int endIndex = errorMessage.indexOf('\n', startIndex);
                String cleanErrorMessage;
                if (endIndex != -1) {
                    cleanErrorMessage = errorMessage.substring(startIndex + "ORA-20001: ".length(), endIndex).trim();
                    System.out.println(cleanErrorMessage);
                    return cleanErrorMessage;
                } else {
                    cleanErrorMessage = errorMessage.substring(startIndex + "ORA-20001: ".length()).trim();
                    System.out.println(cleanErrorMessage);
                    return cleanErrorMessage;
                }
            } else {
                System.out.println(errorMessage);
                return errorMessage;
            }

        }
        return "";
    }

    public ObservableList<Client> getClientsObsList() {
        return clientsObsList;
    }


    private void closeOverlay() {
        // Remove the last added overlay pane
        int lastIndex = ClientBody.getChildren().size() - 1;
        if (lastIndex >= 0) {
            ClientBody.getChildren().remove(lastIndex);
        }
    }


    /* 
     * Works out of the box, thanks chatGPT
     */

    private void searchTable() {
        FilteredList<Client> filteredData = new FilteredList<>(clientsObsList, p -> true);

        // Add listener to the searchField text property
        searchField.textProperty().addListener((observable, oldValue, newValue) -> {
            // Create a filtered list to apply the search

            // Set the predicate for the filter
            filteredData.setPredicate(client -> {
                // If filter text is empty, display all clients
                if (newValue == null || newValue.isEmpty()) {
                    return true;
                }

                // Convert client information to lowercase for case-insensitive search
                String lowerCaseFilter = newValue.toLowerCase();

                // Check if any of the client attributes contain the filter text
                return client.getNomClient().toLowerCase().contains(lowerCaseFilter)
                        || client.getPrenomClient().toLowerCase().contains(lowerCaseFilter)
                        || String.valueOf(client.getDateNaisClient()).toLowerCase().contains(lowerCaseFilter)
                        || client.getTelClient().toLowerCase().contains(lowerCaseFilter)
                        || client.getEmailClient().toLowerCase().contains(lowerCaseFilter);
            });

            // Wrap the FilteredList in a SortedList 
            SortedList<Client> sortedData = new SortedList<>(filteredData);

            // Bind the SortedList comparator to the TableView comparator
            sortedData.comparatorProperty().bind(Table_Client.comparatorProperty());

            // Set the items in the TableView with the filtered and sorted data
            Table_Client.setItems(sortedData);

            // Display a message when there are no items in the table
            if (sortedData.isEmpty()) {
                // Set a message in the TableView or somewhere appropriate
                // For example, assuming you have a label to display messages:
                Table_Client.setPlaceholder(new Label("Try something else, nothing left to see here !!!"));
            }
        });

        // Add event handler to clear the searchField when clicked
        searchField.setOnMouseClicked(event -> {
            // Clear the searchField text
            searchField.clear();
        });
    }
}
