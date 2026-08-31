```python
if apply_button_placeholder.button(f"Apply Fix: {fix['title']}", key=button_key, help="Review code before applying!"):
    with st.spinner(f"Applying fix: {fix['title']}..."):
        original_df_head = st.session_state.df_modified.head().copy()
        original_df_shape = st.session_state.df_modified.shape
        original_missing_sum = st.session_state.df_modified.isna().sum().sum()

        # Store current df_modified for potential undo
        if 'undo_history' not in st.session_state:
            st.session_state.undo_history = []
        st.session_state.undo_history.append(st.session_state.df_modified.copy())
        if len(st.session_state.undo_history) > 5: # Keep last 5 undo states
            st.session_state.undo_history.pop(0)


        # Apply fix using safe evaluation
        temp_df = st.session_state.df_modified.copy() # Work on a temporary copy for this specific fix
        
        # Safe evaluation environment
        namespace = {
            'pd': pd,
            'np': np,
            'df': temp_df  # Operate on the temporary DataFrame
        }
        
        # Capture stdout/stderr during execution
        from io import StringIO
        import sys
        old_stdout = sys.stdout
        old_stderr = sys.stderr
        redirected_output = sys.stdout = StringIO()
        redirected_error = sys.stderr = StringIO()

        try:
            # Clean up potential indentation issues from AI
            cleaned_code = "\n".join([line.lstrip() for line in fix['code'].split('\n')])
            print(f"\n--- Executing Code ---\n{cleaned_code}\n---", file=old_stdout) # Print code being executed to original stdout
            
            exec(cleaned_code, namespace)

            # Restore stdout/stderr
            sys.stdout = old_stdout
            sys.stderr = old_stderr

            captured_output = redirected_output.getvalue()
            captured_error = redirected_error.getvalue()

            modified_df_intermediate = namespace['df'] # Retrieve the modified df from the namespace

            if not modified_df_intermediate.equals(st.session_state.df_modified):
                st.session_state.df_modified = modified_df_intermediate # Update the main modified df
                st.session_state.applied_fixes_log.append({
                    "title": fix['title'],
                    "code": fix['code']
                })
                st.success(f"Fix '{fix['title']}' applied successfully!")

                if captured_output:
                    st.markdown("##### Output from fix code:")
                    st.code(captured_output)
                if captured_error:
                    st.error("##### Error during fix code execution:")
                    st.code(captured_error)

                # Show before/after comparison more effectively
                st.markdown("##### Data Preview (First 5 Rows):")
                col1, col2 = st.columns(2)
                with col1:
                    st.write("**Before Fix:**")
                    st.data_editor(original_df_head, height=200, key=f"{button_key}_before_data_editor", disabled=True, use_container_width=True)
                with col2:
                    st.write("**After Fix:**")
                    st.data_editor(st.session_state.df_modified.head(), height=200, key=f"{button_key}_after_data_editor", disabled=True, use_container_width=True)

                # Show impact statistics
                st.markdown("##### Impact Statistics:")
                impact_data = {
                    "Metric": ["Rows", "Columns", "Missing Values"],
                    "Before": [original_df_shape[0], original_df_shape[1], original_missing_sum],
                    "After": [st.session_state.df_modified.shape[0], st.session_state.df_modified.shape[1], st.session_state.df_modified.isna().sum().sum()]
                }
                st.table(pd.DataFrame(impact_data))
                st.session_state.fix_applied_once = True # Flag to allow rerun for UI update
            else:
                st.warning("Applying this fix resulted in no changes to the dataset.")
                if captured_output:
                    st.markdown("##### Output from fix code:")
                    st.code(captured_output)
                if captured_error:
                    st.error("##### Error during fix code execution:")
                    st.code(captured_error)
                # Remove the last item from undo history as no change occurred
                if st.session_state.undo_history:
                    st.session_state.undo_history.pop()

        except Exception as e:
            # Ensure stdout/stderr are restored even if an error occurs
            sys.stdout = old_stdout
            sys.stderr = old_stderr

            captured_output = redirected_output.getvalue()
            captured_error = redirected_error.getvalue()

            st.error(f"Error applying fix '{fix['title']}': {str(e)}")
            st.error("The Basic development code blocks snippet might be incorrect or not applicable to your current dataset.")
            if captured_output:
                    st.markdown("##### Output from fix code:")
                    st.code(captured_output)
            if captured_error:
                    st.error("##### Error during fix code execution:")
                    st.code(captured_error)

            # Remove the last item from undo history as the fix failed
            if st.session_state.undo_history:
                st.session_state.undo_history.pop()
    
    # Rerun to update UI elements, especially if tabs are involved
    # or to correctly reflect the modified data in other parts of the app.
    st.rerun()
```