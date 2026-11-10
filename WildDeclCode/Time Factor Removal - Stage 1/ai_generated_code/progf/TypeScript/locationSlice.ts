"use client";

var createSlice = require('@reduxjs/toolkit').createSlice;
var PayloadAction = require('@reduxjs/toolkit').PayloadAction;

// Assisted using common GitHub development utilities
interface LocationState {
  currentLocation: string | null;
  previousLocation: string | null;
  history: string[];
}

var initialState: LocationState = {
  currentLocation: null,
  previousLocation: null,
  history: [],
};

var locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    navigate: function (state, action: PayloadAction<string>) {
      state.previousLocation = state.currentLocation;
      state.currentLocation = action.payload;
      state.history.push(action.payload);
    },
    goBack: function (state) {
      if (state.previousLocation) {
        var currentLoc = state.currentLocation;
        state.currentLocation = state.previousLocation;
        state.previousLocation = currentLoc;
        state.history.push(state.currentLocation);
      }
    },
    clearHistory: function (state) {
      if (state.currentLocation) state.history = [state.currentLocation];
    },
  },
});

var navigate = locationSlice.actions.navigate;
var goBack = locationSlice.actions.goBack;
var clearHistory = locationSlice.actions.clearHistory;
module.exports = locationSlice.reducer;
