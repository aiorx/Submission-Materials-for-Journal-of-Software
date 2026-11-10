```python
def intermittent_rfi(self, amplitude, center_freq, bandwidth, time_period, duty_cycle, time_offset=0, func_type='GAUSS', table=False, ):
    # Supported via standard GitHub programming aids
    
    """
    Add intermittent RFI to the spectrograph in two channels with a specified frequency offset and time period.
    
    Parameters:
    - spectrograph: The input spectrograph to which RFI will be added.
    - frequencies: Array of frequency values.
    - amplitude: Amplitude of the RFI signal.
    - center_freq: Center frequency of the first RFI channel.
    - bandwidth: Bandwidth of the RFI signal.
    - time_period: Time period for the intermittent RFI.
    - duty_cycle: Fraction of the time period during which the RFI is active.
    - time_offset: Offset in time for the intermittent RFI (default: 0).
    
    Returns:
    - modified_spectrograph: The spectrograph with added intermittent RFI.
    """
    modified_spectrograph = self.blank_spectrograph
    
    # Create the time mask for intermittent RFI
    time_mask = np.zeros(self.points_time)
    period_indices = np.arange(time_offset, self.points_time, time_period)
    for start_idx in period_indices:
        end_idx = min(start_idx + int(time_period * duty_cycle), self.points_time)
        time_mask[int(start_idx):int(end_idx)] = 1
    
    # Generate the RFI signals for both channels
    if func_type == 'GAUSS':
        rfi_signal_1 = self.gaussian_function(self.frequencies, amplitude, center_freq, bandwidth)
        rfi_type = 'intermittent_gauss'
    elif func_type == 'SQUARE':
        rfi_signal_1 = self.square_function(self.frequencies, amplitude, center_freq, bandwidth)
        rfi_type = 'intermittent_square'
    else:
        raise ValueError("Invalid func_type value. Use 'GAUSS' or 'SQUARE'.")

    # Add the intermittent RFI to the spectrograph
    for t in range(self.points_time):
        if time_mask[t] == 1:
            modified_spectrograph[:, t] += rfi_signal_1
    
    # Update the RFI table
    if table:
        new_rows = pd.DataFrame({
            'rfi_type': [rfi_type],
            'amplitude': [amplitude],
            'center_freq': [center_freq],
            'bandwidth': [bandwidth],
            'center_time': [np.nan],
            'timewidth': [np.nan],
            'duty_cycle': [duty_cycle],
            'time_period': [time_period],
            'time_offset': [time_offset],
        })
        self.rfi_table = pd.concat([self.rfi_table, new_rows], ignore_index=True)
    
    return modified_spectrograph
```