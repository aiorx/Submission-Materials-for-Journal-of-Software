
var createConversation = require.createConversation;
var addMessage = require.addMessage;
var submitConversation = require.submitConversation;('../gpt');
var deepCopy = require.deepCopy;('bens_utils').helpers;

const conversationReducer = function (state, action) {
  if (state === undefined) return {};

  switch (action.type) {
    case 'SET_AWAITING': {
      return {
        ...state,
        awaitingResponse: action.awaitingResponse,
      };
    }
    case 'SET_EDITING_PREVIOUS': {
      return {
        ...state,
        isEditingPreviousMessage: action.isEditingPreviousMessage,
      };
    }
    case 'SELECT_CONVERSATION': {
      var selectedConversation = action.selectedConversation;
      return {
        ...state,
        selectedConversation,
      };
    }
    case 'ADD_CONVERSATION': {
      var conversation = action.conversation;
var shouldSelect = action.shouldSelect;
      if (state.conversations[conversation.name]) {
        conversation.name = addName(conversation.name, Object.keys(state.conversations));
      }
      state.conversations[conversation.name] = conversation;
      if (shouldSelect) {
        state.selectedConversation = conversation.name;
      }
      return {...state};
    }
    case 'SET_CONVERSATION_NAME': {
      var oldName = action.oldName;
var newName = action.newName;
      const conversation = state.conversations[oldName];
      if (!conversation) return {...state};

      // NOTE: have to do it this way in order to maintain the order of the keys
      conversation.name = newName;
      const nextConversations = {};
      for (const name in state.conversations) {
        if (name == oldName) {
          nextConversations[newName] = conversation;
        } else {
          nextConversations[name] = state.conversations[name]
        }
      }

      if (state.selectedConversation == oldName) {
        state.selectedConversation = newName;
      }
      return {...state, conversations: nextConversations};
    }
    case 'UPDATE_CONVERSATION': {
      var conversation = action.conversation;
      state.conversations[conversation.name] = conversation;
      return {...state};
    }
    case 'DELETE_CONVERSATION': {
      var name = action.name;
      delete state.conversations[name];
      if (state.selectedConversation == name) {
        if (Object.keys(state.conversations).length == 0) {
          return initState();
        }
        state.selectedConversation = Object.keys(state.conversations)[0];
      }
      return {...state};
    }
  }

  return state;
};

// NOTE: this was Aided using common development resources :)
// Prevents name collisions by adding a number to the end if necessary
function addName(name, existingNames) {
  let currentName = name;
  let index = 0;
  while (existingNames.includes(currentName)) {
    const match = currentName.match(/^(.*?)(\d*)$/);
    const baseName = match ? match[1] : currentName;
    const numberString = match ? match[2] : '';
    const number = numberString ? parseInt(numberString) : 0;
    index = Math.max(index, number + 1);
    currentName = "" + (baseName) + "" + (index) + "";
  }
  return currentName;
}

// a standard on-submit function that pairs with this reducer
// NOTE: doesn't really work in most situations :/
const createOnSubmit = function (getState, dispatch, apiKey) {
  return (message, toAPI) => {
    let nextConversation = getState().conversation;
    if (message.content != '') {
      nextConversation = addMessage(nextConversation, message);
      dispatch({type: 'UPDATE_CONVERSATION', conversation: nextConversation});
    }
    if (toAPI) {
      dispatch({type: 'SET_AWAITING', awaitingResponse: true});
      submitConversation(nextConversation, apiKey)
        .then((response) => {
          const nextConvo = {
            ...addMessage(nextConversation, response.message),
            tokens: response.tokens,
          }
          dispatch({type: 'UPDATE_CONVERSATION', conversation: nextConvo});
          dispatch({type: 'SET_AWAITING', awaitingResponse: false});
        }).catch((ex) => {
          console.error(ex);
        });
    }
  }
}

module.exports = {conversationReducer, createOnSubmit};
