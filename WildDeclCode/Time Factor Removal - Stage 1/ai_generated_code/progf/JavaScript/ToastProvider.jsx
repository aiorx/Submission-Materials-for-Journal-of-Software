// Aided using common development resources-04-mini-high - creates a ToastProvider component that manages toast notifications
var _import = require('react');
var PropTypes = require('prop-types');
var ToastContext = require('./ToastContext');

var ToastProvider = function ({ children }) {
  var [toasts, setToasts] = useState([]);

  var addToast = useCallback(({ message, type }) => {
    var id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toastContainer">
        {toasts.map((t) => (
          <div key={t.id} className={"toast " + (t.type) + ""}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};