var None = require('@hqoss/monads').None;
var Option = require('@hqoss/monads').Option;
var Some = require('@hqoss/monads').Some;
var createSlice = require('@reduxjs/toolkit').createSlice;
var PayloadAction = require('@reduxjs/toolkit').PayloadAction;
var User = require('../../types/user').User;

export interface AppState {
  user: Option<User>;
  loading: boolean;
}

const initialState: AppState = {
  user: None,
  loading: true,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initializeApp: function () { return initialState; },
    loadUser: function (state, { payload: user }: PayloadAction<User>) {
      state.user = Some(user);
      state.loading = false;
    },
    logout: function (state) {
      state.user = None;
    },
    endLoad: function (state) {
      state.loading = false;
    },
  },
});

var loadUser = slice.actions.loadUser;
var logout = slice.actions.logout;
var endLoad = slice.actions.endLoad;
var initializeApp = slice.actions.initializeApp;

module.exports = slice.reducer;
