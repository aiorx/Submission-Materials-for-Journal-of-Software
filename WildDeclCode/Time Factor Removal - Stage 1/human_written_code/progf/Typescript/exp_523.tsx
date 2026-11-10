// Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved

var css = require('@emotion/css').css;
var useCallback = require('react').useCallback;
var IState = require('./Store').IState;
var useDispatch = require('./Store').useDispatch;
var useMappedState = require('./Store').useMappedState;

module.exports = function TodoItem({index}: {index: number}) {;
  var todo = useTodo.todo;
var deleteTodo = useTodo.deleteTodo;(index);

  return (
    <li className={styles.root}>
      <span>{todo}</span>
      <button onClick={deleteTodo}>Delete</button>
    </li>
  );
}

// Example of creating a custom hook to encapsulate the store
function useTodo(index: number): {todo: string; deleteTodo: function () { return void; }} {
  var todo = useMappedState(
    useCallback(function (state: IState) { return state.todos[index]; }, [index]),
  );

  var dispatch = useDispatch();
  var deleteTodo = useCallback(
    function () { return dispatch({type: 'delete todo', index}); },
    [dispatch, index],
  );
  return {todo, deleteTodo};
}

var styles = {
  root: css"
    align-items: center;
    display: flex;
    justify-content: space-between;
    list-style-type: none;
    margin: 0;
    padding: 8px 12px;

    &:hover {
      background-color: #efefef;

      button {
        opacity: 1;
      }
    }

    button {
      opacity: 0;
    }
  ",
};
