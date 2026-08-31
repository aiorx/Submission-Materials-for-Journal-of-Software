```python
         # Cross correlation code was Composed with basic coding tools4.0 mini but manually changed and checked over time to fit the streamlit app
         accuracy_test_df = WW_df[WW_df['Code'] == 'GR']
         # user inputs number of lag steps for plot
         user_input_GR_lag = slider_value = st.slider("Select a value", min_value=-20, max_value=20, step=1, value=8)
         user_input_GR_lag = int(user_input_GR_lag)
         accuracy_test_df = accuracy_test_df.loc[(accuracy_test_df['Date'] >= '2023-09-01') & (accuracy_test_df['Date'] <= '2024-04-01')]
         # remove columns with missing data
         accuracy_test_df = accuracy_test_df.dropna(subset=['PMMoV (gc/ 100mL)', 'FlowRate (MGD)', 'N1','BiWeekly Deaths', 'Date'])
         accuracy_test_df['BiWeekly Deaths scaled'] = scaler.fit_transform(accuracy_test_df[['BiWeekly Deaths']])
         accuracy_test_df['N1 Lagged scaled'] = scaler.fit_transform(accuracy_test_df[['N1']])
         accuracy_test_df['FlowRate scaled (MGD)'] = scaler.fit_transform(accuracy_test_df[['FlowRate (MGD)']])
         accuracy_test_df['PMMoV scaled (gc/ 100mL)'] = scaler.fit_transform(np.log10(accuracy_test_df[['PMMoV (gc/ 100mL)']]))
         # Inverse lag the Biweekly lag data to reduce the amount of data that need to be shifted for the liner reggretion to work.
         accuracy_test_df['BiWeekly Deaths scaled input'] = accuracy_test_df['BiWeekly Deaths scaled'].shift(-1*(user_input_GR_lag))
         accuracy_test_df['N1 scaled Residuals Lag input'] = accuracy_test_df['N1 Lagged scaled'] - accuracy_test_df['BiWeekly Deaths scaled input']
         # add flowrate to 'N1 scaled Residuals Lag input' because flowrate is inverly corralated to N1
         accuracy_test_df['N1 flowrate scaled Residuals Lag input'] = accuracy_test_df['N1 scaled Residuals Lag input'] + accuracy_test_df['FlowRate scaled (MGD)']
         accuracy_test_df['N1 PMMoV scaled Residuals Lag input'] = accuracy_test_df['N1 scaled Residuals Lag input'] - accuracy_test_df['PMMoV scaled (gc/ 100mL)']
         
         SSE_N1_input_lag =(accuracy_test_df['N1 scaled Residuals Lag input']**2).sum()
         SSE_N1_flow_input_lag = np.sum(accuracy_test_df['N1 flowrate scaled Residuals Lag input']**2)
         SSE_N1_PMMoV_input_lag = np.sum(accuracy_test_df['N1 PMMoV scaled Residuals Lag input']**2)
         
         fig12 = px.line(accuracy_test_df, x='Date', y='N1 scaled Residuals Lag input', title = 'GR N1 data scaled Residuals to Lag input fitted to national COVID-19 death data')
         st.plotly_chart(fig12)
         
         st.write(f'SSE for N1 input lag: {SSE_N1_input_lag}')
         
         # Get the flow rate and discharge values as numpy arrays
         Y_N1 = np.array(accuracy_test_df['N1 scaled Residuals Lag input'])
         Y_N1 = Y_N1.astype(float)
         # remove missing values from the Y array
         mask = ~np.isnan(Y_N1)
         Y_N1 = Y_N1[mask]
         # ajust the shape of the X arrays to match the Y
         X_Flow = np.array(accuracy_test_df['FlowRate scaled (MGD)'])[mask]
         X_Flow = X_Flow.astype(float)
         X_PMMoV = np.array(accuracy_test_df['PMMoV scaled (gc/ 100mL)'])[mask]
         X_PMMoV = X_PMMoV.astype(float)
         
         # generate liner reggretion stats
         w1_PMMoV, w0_PMMoV, r_PMMoV, p_PMMoV, err_PMMoV = stats.linregress(X_PMMoV, Y_N1)
         w1_Flow, w0_Flow, r_Flow, p_Flow, err_Flow = stats.linregress(X_Flow, Y_N1)
         Y_predicted_PMMoV = w1_PMMoV * X_PMMoV + w0_PMMoV
         Y_predicted_Flow = w1_Flow * X_Flow + w0_Flow
         residuals_PMMoV = np.sum((Y_N1 - Y_predicted_PMMoV) ** 2)
         residuals_Flow = np.sum((Y_N1 - Y_predicted_Flow) ** 2)
         
         st.write("Explained variance in GR input lag N1 residuals using PMMoV")
         st.write(f"Predicted Slope w1  = {w1_PMMoV}")
         st.write(f"Predicted Intercept w0 = {w0_PMMoV}")
         st.write(f"Person correlation r = {r_PMMoV}")
         st.write(f"p_value = {p_PMMoV}")
         st.write(f"Standerd error = {err_PMMoV}")
         st.write(f"square sum of residuals with PMMoV= {residuals_PMMoV}")
         
         fig13 = px.scatter(accuracy_test_df, x='Date', y='N1 scaled Residuals Lag input', title = 'liner regression of residual N1 lag to PMMoV')
         fig13.add_trace(go.Scatter(x=accuracy_test_df['Date'], y=Y_predicted_PMMoV, mode='lines', name='Regression Line', line=dict(color='red', width=2)))
         st.plotly_chart(fig13)
         
         st.write("Explained variance in GR input lag N1 residuals using Flow rate")
         st.write(f"Predicted Slope w1  = {w1_Flow}")
         st.write(f"Predicted Intercept w0 = {w0_Flow}")
         st.write(f"Person correlation r = {r_Flow}")
         st.write(f"p_value = {p_Flow}")
         st.write(f"Standerd error = {err_Flow}")
         st.write(f"square sum of residuals with PMMoV= {residuals_Flow}")
         
         fig14 = px.scatter(accuracy_test_df, x='Date', y='N1 scaled Residuals Lag input', title = 'liner regression of residual N1 lag to Flow rate')
         fig14.add_trace(go.Scatter(x=accuracy_test_df['Date'], y=Y_predicted_Flow, mode='lines', name='Regression Line', line=dict(color='red', width=2)))
         st.plotly_chart(fig14)
```