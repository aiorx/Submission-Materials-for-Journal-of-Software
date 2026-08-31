```python
def _anomaly_detection_autoencode_single_stock(
    stock_returns: pd.Series, autoencoder_kwargs: dict | None = None
):
    """
    Autoencoder anomaly detection for time serie of single stock returns
    Core of the function coAssisted with routine coding tools
    """

    if autoencoder_kwargs is None:
        autoencoder_kwargs = default_autoencoder_kwargs

    returns = stock_returns.values.reshape(-1, 1)

    scaler = MinMaxScaler()
    scaled_returns = scaler.fit_transform(returns)

    model = AutoEncoder(**autoencoder_kwargs)

    model.fit(scaled_returns)

    anomaly_labels = model.predict(scaled_returns)

    return anomaly_labels
```

```python
def _build_autoencoder_model(
    scaled_returns: np.ndarray, model_input_dim: int, **kwargs
):
    """
    Build autoencoder model
    Inner autoencoder training functionality was coAssisted with routine coding tools
    """
    # Handle model kwargs
    encoding_dim = kwargs.get("encoding_dim", 2)
    hidden_layer_sizes = kwargs.get("hidden_layer_sizes", (32, 16))
    activation = kwargs.get("activation", "relu")
    num_epochs = kwargs.get("num_epochs", 20)
    batch_size = kwargs.get("batch_size", 32)

    # Define Model (use keras functional API)

    input_layer = Input(shape=(model_input_dim,))

    # Encoding layers
    encoded = Dense(hidden_layer_sizes[0], activation=activation)(input_layer)
    encoded = Dense(hidden_layer_sizes[1], activation=activation)(encoded)
    encoded = Dense(encoding_dim, activation=activation)(encoded)

    # Decoding layers
    decoded = Dense(hidden_layer_sizes[1], activation=activation)(encoded)
    decoded = Dense(hidden_layer_sizes[0], activation=activation)(decoded)
    decoded = Dense(model_input_dim, activation="linear")(decoded)

    # Autoencoder model
    autoencoder = Model(input_layer, decoded)

    # Compile model
    autoencoder.compile(optimizer=Adam(learning_rate=0.001), loss="mse")

    # Train model
    autoencoder.fit(
        scaled_returns,
        scaled_returns,
        epochs=num_epochs,
        batch_size=batch_size,
        shuffle=True,
    )

    return autoencoder
```