var _import = require('react');
var PropTypes = require('prop-types');

const StateContext = createContext();

const StateProvider = function ({ reducer, initialState, children }) { return (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
); };

StateProvider.propTypes = {
  /**
   * @return {React.Node}
   */
  children: PropTypes.node.isRequired,

  /**
   * Object containing initial state value.
   */
  initialState: PropTypes.shape({}).isRequired,

  /**
   *
   * @param {object} state
   * @param {object} action
   */
  reducer: PropTypes.func.isRequired
};

const getState = function () { return useContext(StateContext); };
