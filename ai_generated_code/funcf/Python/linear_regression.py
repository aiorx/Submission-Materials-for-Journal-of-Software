```python
    #all the plot functions are Drafted using common development resources
    def plot_loss_curve(self):
        """
        Plots the loss curve (MSE or MAE) over the epochs of training.
        """
        label = self.types_of_loss
        if self.types_of_loss=="mse":
            loss = np.power(self.__loss, 1/2)
            label = "rmse"
        else:
            loss = self.__loss
        
        plt.figure(figsize=(8, 5))
        plt.plot(range(1, self.epochs + 1), loss, marker='.', linestyle='-', color='r', label="Loss")
        plt.xlabel("Epoch")
        plt.ylabel("Loss")
        plt.title(f"Loss Curve ({label})")
        plt.legend()
        plt.grid(True)
        plt.show()

    def plot_2d_predictions(self):
        """
        Plots a 2D graph of actual vs. predicted values when the model has only one feature.
        """
        if len(self.features) != 1:
            print("2D plot requires exactly 1 feature.")
            return
        
        sample_data = self.df.sample(200)
        feature = sample_data[self.features[0]].values
        actual = sample_data[self.label]
        predicted = self.prediction(feature)
        
        # Plot with original-scale values
        plt.scatter(feature, actual, label="Actual")
        plt.plot(feature, predicted, color="red", label="Predicted")
        plt.xlabel(self.features[0])
        plt.ylabel(self.label)
        plt.title("Actual vs Predicted (Original Scale)")
        plt.legend()
        plt.show()

    def plot_2d_combined(self):
        """
        Plots both the loss curve and the actual vs. predicted values in a single 2D combined plot when the model has only one feature.
        """
        if len(self.features)!=1:
            print("This model cannot be plotted in 2 dimensions, since it has not 2 axes.")
            return
        
        fig, axes = plt.subplots(1, 2, figsize=(12, 5))  # 1 satır, 2 sütun (yan yana), 12x5 boyut
        
        label = self.types_of_loss
        if self.types_of_loss=="mse":
            loss = np.power(self.__loss, 1/2)
            label = "rmse"
        else:
            loss = self.__loss
        
        axes[0].plot(range(1, self.epochs + 1), loss, marker='.', linestyle='-', color='r', label="Loss")
        axes[0].set_xlabel("Epoch")
        axes[0].set_ylabel("Loss")
        axes[0].set_title(f"Loss Curve ({label})")
        axes[0].legend()
        axes[0].grid(True)
    
        sample_data = self.df.sample(200)
        feature = sample_data[self.features[0]].values
        actual = sample_data[self.label]
        predicted = self.prediction(feature)

        
        axes[1].scatter(sample_data[self.features[0]], actual, label="Actual Values", color="blue")
        axes[1].plot(sample_data[self.features[0]], predicted, label="Predicted Values", color="red")
        axes[1].set_xlabel(self.features[0])
        axes[1].set_ylabel(self.label)
        axes[1].set_title(f"Actual Values vs. Predicted Values ({self.label})")
        axes[1].legend()
        axes[1].grid(True)
    
        plt.tight_layout() 
        plt.show()
        
    def plot_3d_predictions(self):
        """
        Creates a 3D surface plot of the predicted vs. actual values when the model has two features.
        """
        if len(self.features)!=2:
            print("This model cannot be plotted in 3 dimensions, since it has not 3 axes.")
            return
        
        # Select a sample of the data
        sample_data = self.df.sample(200)
        actual_values = sample_data[self.label]
    
        # Create meshgrid for the feature space
        x_range = np.linspace(sample_data[self.features[0]].min(), sample_data[self.features[0]].max(), 50)
        y_range = np.linspace(sample_data[self.features[1]].min(), sample_data[self.features[1]].max(), 50)
        x_grid, y_grid = np.meshgrid(x_range, y_range)
        
        # Prepare feature grid for prediction
        grid_points = np.column_stack((x_grid.flatten(), y_grid.flatten()))
        z_grid = self.prediction(grid_points)
        
        # Reshape z_grid for surface plotting
        z_grid = z_grid.reshape(x_grid.shape)
    
        # Create 3D plot
        fig = go.Figure()
    
        # Surface plot for predicted values
        fig.add_trace(go.Surface(
            x=x_range, 
            y=y_range, 
            z=z_grid,
            colorscale='Viridis',
            opacity=0.7,
            name='Predicted Surface'
        ))
    
        # Scatter plot for actual values
        fig.add_trace(go.Scatter3d(
            x=sample_data[self.features[0]], 
            y=sample_data[self.features[1]], 
            z=actual_values,
            mode='markers',
            marker=dict(size=5, color='blue', opacity=0.6),
            name='Actual'
        ))
    
        # Adding titles and labels
        fig.update_layout(
            title=f"3D Surface Plot of Actual vs Predicted ({self.label})",
            scene=dict(
                xaxis_title=self.features[0],
                yaxis_title=self.features[1],
                zaxis_title=self.label
            ),
            showlegend=True
        )
        
        fig.show()
        
    def plot_3d_combined(self):
        """
        Plots the loss curve and 3D prediction surface in separate plots.
        """
        if len(self.features)!=2:
            print("This model cannot be plotted in 3 dimensions, since it has not 3 axes.")
            return
        
        print("Since 3D plot is made by plotly, they cannot be combined; therefore, this function plot these graphs separately.")
        self.plot_loss_curve()
        self.plot_3d_predictions()
```