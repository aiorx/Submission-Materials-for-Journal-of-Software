var _import = require('react');
var createShadowDOM = require('./Util/createShadowDOM');
var defaults = require('./consts');
var ShadowChild = require('./ShadowChild');
var addStyleString = require('./Util/addStyleString');
var getUUID = require('./Util/getUUID');

interface Props {
  children: any;
  containerClassName?: string;
  showAfter?: number;
  hideAfter?: number;
  highlightClassName?: string;
  mode?: "newOnly" | "change";
  disabled?: boolean;
  ssr?: boolean;
}

const listOfClearHighlightFunctions = [];

const updateClearHandler = function (childId, Fn) {
  listOfClearHighlightFunctions[childId] = Fn;
};

const ChangeHighlight: React.FC<Props> = function ({
  children,
  containerClassName,
  showAfter = defaults.TIME_TO_HIGHLIGHT,
  hideAfter = defaults.TIME_TO_STOP_HIGHLIGHT,
  highlightClassName = defaults.HIGHLIGHT_CLASS,
  mode = "change",
  disabled = false,
  ssr = false
}) {
  const [shadowDOM, setShadowDOM] = useState([]);
  const isInitialMount = useRef(true);
  const [uniqueId, setUniqueId] = useState("");

  useEffect(() => {
    if (!disabled) {
      if (isInitialMount.current) {
        setUniqueId(getUUID());
        if (!!highlightClassName) {
          addStyleString(
            "
          ." + (defaults.HIGHLIGHT_CLASS) + " {
            background: #f8ffb4 !important;
            transition: 0.25s ease-in-out;
          }
        ",
            ssr
          );
        }
        isInitialMount.current = false;
      }

      setShadowDOM([]);
      createShadowDOM({ props: { children } }, setShadowDOM);
    }
  }, [children, disabled, ssr, highlightClassName]);

  return (
    <div className={containerClassName}>
      {shadowDOM.map((child, index) => (
        <ShadowChild
          key={index}
          id={index}
          child={child}
          newlyAddedOnly={mode === "newOnly"}
          showAfter={showAfter}
          hideAfter={hideAfter}
          highlightClassName={highlightClassName}
          clearHandler={listOfClearHighlightFunctions[index]}
          updateClearHandler={updateClearHandler}
          uniqueId={uniqueId}
        />
      ))}
      {children}
    </div>
  );
};

module.exports = ChangeHighlight;
