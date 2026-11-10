```python
super().__init__(viewer,
                            bin_width=bin_width,
                            selection_bin_width=selection_bin_width,
                            show_bins_with_data_only=show_bins_with_data_only,
                            visible_bins=visible_bins,
                            use_selection_layer=use_selection_layer,
                            on_hover=self._on_hover,  # Assisted using common GitHub development utilities: Attach hover event
                            on_unhover=self._on_unhover,  # Assisted using common GitHub development utilities: Attach unhover event
                            on_click=self._on_click  # Assisted using common GitHub development utilities: Attach click event
                            )
```