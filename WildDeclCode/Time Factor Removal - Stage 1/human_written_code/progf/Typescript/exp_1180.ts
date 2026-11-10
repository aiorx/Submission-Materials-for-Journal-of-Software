var _import = require('react');
var useBoolean = require('../../../hooks').useBoolean;
var useCallbackRef = require('../../../hooks').useCallbackRef;
var useControllableProp = require('../../../hooks').useControllableProp;
var useSafeLayoutEffect = require('../../../hooks').useSafeLayoutEffect;
var mergeRefs = require('../../../react-utils').mergeRefs;
var PropGetter = require('../../../react-utils').PropGetter;
var callAllHandlers = require('../../../utils').callAllHandlers;
var dataAttr = require('../../../utils').dataAttr;
var focus = require('../../../utils').focus;
var scheduleMicrotask = require('../../../utils').scheduleMicrotask;
var warn = require('../../../utils').warn;
var visuallyHiddenStyle = require('../../../visually-hidden').visuallyHiddenStyle;

export interface UseCheckboxProps {
  /**
   * If `true`, the checkbox will be checked.
   * You'll need to pass `onChange` to update its value (since it is now controlled)
   */
  isChecked?: boolean
  /**
   * If `true`, the checkbox will be indeterminate.
   * This only affects the icon shown inside checkbox
   * and does not modify the isChecked property.
   */
  isIndeterminate?: boolean
  /**
   * If `true`, the checkbox will be disabled
   */
  isDisabled?: boolean
  /**
   * If `true` and `isDisabled` is passed, the checkbox will
   * remain tabbable but not interactive
   */
  isFocusable?: boolean
  /**
   * If `true`, the checkbox will be readonly
   */
  isReadOnly?: boolean
  /**
   * If `true`, the checkbox is marked as invalid.
   * Changes style of unchecked state.
   */
  isInvalid?: boolean
  /**
   * If `true`, the checkbox input is marked as required,
   * and `required` attribute will be added
   */
  isRequired?: boolean
  /**
   * If `true`, the checkbox will be initially checked.
   * @deprecated Please use the `defaultChecked` prop, which mirrors default
   * React checkbox behavior.
   */
  defaultIsChecked?: boolean
  /**
   * If `true`, the checkbox will be initially checked.
   */
  defaultChecked?: boolean
  /**
   * The callback invoked when the checked state of the `Checkbox` changes..
   */
  onChange?: function (event: React.ChangeEvent<HTMLInputElement>) { return void
  /**
   * The callback invoked when the checkbox is blurred (loses focus)
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /**
   * The callback invoked when the checkbox is focused
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  /**
   * The name of the input field in a checkbox
   * (Useful for form submission).
   */
  name?: string
  /**
   * The value to be used in the checkbox input.
   * This is the value that will be returned on form submission.
   */
  value?: string | number
  /**
   * id assigned to input
   */
  id?: string
  /**
   * Defines the string that labels the checkbox element.
   */
  "aria-label"?: string
  /**
   * Refers to the `id` of the element that labels the checkbox element.
   */
  "aria-labelledby"?: string
  "aria-invalid"?: true | undefined
  "aria-describedby"?: string; }}

/**
 * useCheckbox that provides all the state and focus management logic
 * for a checkbox. It is consumed by the `Checkbox` component
 *
 * @see Docs https://chakra-ui.com/docs/form/checkbox#hooks
 */
function useCheckbox(props: UseCheckboxProps = {}) {
  var defaultIsChecked = props.defaultIsChecked;
var defaultChecked = props.defaultChecked;
var isFocusable = props.isFocusable;
var isDisabled = props.isDisabled;
var isReadOnly = props.isReadOnly;
var isRequired = props.isRequired;
var onChange = props.onChange;
var isIndeterminate = props.isIndeterminate;
var isInvalid = props.isInvalid;
var name = props.name;
var value = props.value;
var id = props.id;
var onBlur = props.onBlur;
var onFocus = props.onFocus;const onChangeProp = useCallbackRef(onChange)
  const onBlurProp = useCallbackRef(onBlur)
  const onFocusProp = useCallbackRef(onFocus)

  const [isFocused, setFocused] = useBoolean()
  const [isHovered, setHovered] = useBoolean()
  const [isActive, setActive] = useBoolean()

  const inputRef = useRef<HTMLInputElement>(null)
  const [rootIsLabelElement, setRootIsLabelElement] = useState(true)

  const [checkedState, setCheckedState] = useState(!!defaultChecked)

  const [isControlled, isChecked] = useControllableProp(checkedProp, checkedState)

  warn({
    condition: !!defaultIsChecked,
    message:
      'The "defaultIsChecked" prop has been deprecated and will be removed in a future version. ' +
      'Please use the "defaultChecked" prop instead, which mirrors default React checkbox behavior.',
  })

  const handleChange = useCallback(
    function (event: ChangeEvent<HTMLInputElement>) {
      if (isReadOnly || isDisabled) {
        event.preventDefault()
        return
      }

      if (!isControlled) {
        if (isChecked) {
          setCheckedState(event.target.checked)
        } else {
          setCheckedState(isIndeterminate ? true : event.target.checked)
        }
      }

      (onChangeProp == null ? undefined : onChangeProp(event))
    },
    [isReadOnly, isDisabled, isChecked, isControlled, isIndeterminate, onChangeProp],
  )

  useSafeLayoutEffect(function () {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(isIndeterminate)
    }
  }, [isIndeterminate])

  const trulyDisabled = isDisabled && !isFocusable

  const onKeyDown = useCallback(
    function (event: KeyboardEvent) {
      if (event.key === " ") {
        setActive.on()
      }
    },
    [setActive],
  )

  const onKeyUp = useCallback(
    function (event: KeyboardEvent) {
      if (event.key === " ") {
        setActive.off()
      }
    },
    [setActive],
  )

  /**
   * Sync state with uncontrolled form libraries like `react-hook-form`.
   *
   * These libraries set the checked value for input fields
   * using their refs. For the checkbox, it sets `ref.current.checked = true | false` directly.
   *
   * This means the `isChecked` state will get out of sync with `ref.current.checked`,
   * even though the input validation with work, the UI will not be up to date.
   *
   * Let's correct that by checking and syncing the state accordingly.
   */
  useSafeLayoutEffect(function () {
    if (!inputRef.current) return
    const notInSync = inputRef.current.checked !== isChecked
    if (notInSync) {
      setCheckedState(inputRef.current.checked)
    }
  }, [inputRef.current])

  const getCheckboxProps: PropGetter = useCallback(
    function (props = {}, forwardedRef = null) {
      const onPressDown = (event: React.MouseEvent) => {
        // On mousedown, the input blurs and returns focus to the `body`,
        // we need to prevent this. Native checkboxes keeps focus on `input`
        event.preventDefault()
        setActive.on()
      }

      return {
        ...props,
        ref: forwardedRef,
        "data-active": dataAttr(isActive),
        "data-hover": dataAttr(isHovered),
        "data-checked": dataAttr(isChecked),
        "data-focus": dataAttr(isFocused),
        "data-indeterminate": dataAttr(isIndeterminate),
        "data-disabled": dataAttr(isDisabled),
        "data-invalid": dataAttr(isInvalid),
        "data-readonly": dataAttr(isReadOnly),
        "aria-hidden": true,
        onMouseDown: callAllHandlers(props.onMouseDown, onPressDown),
        onMouseUp: callAllHandlers(props.onMouseUp, setActive.off),
        onMouseEnter: callAllHandlers(props.onMouseEnter, setHovered.on),
        onMouseLeave: callAllHandlers(props.onMouseLeave, setHovered.off),
      }
    },
    [
      isActive,
      isChecked,
      isDisabled,
      isFocused,
      isHovered,
      isIndeterminate,
      isInvalid,
      isReadOnly,
      setActive,
      setHovered.off,
      setHovered.on,
    ],
  )

  const getRootProps: PropGetter = useCallback(
    function (props = {}, forwardedRef = null) { return ({
      ...htmlProps,
      ...props,
      ref: mergeRefs(forwardedRef, (node: HTMLElement) => {
        if (!node) return
        setRootIsLabelElement(node.tagName === "LABEL")
      }),
      onClick: callAllHandlers(props.onClick, () => {
        /**
         * Accessibility:
         *
         * Ideally, `getRootProps` should be spread unto a `text` element.
         *
         * If the element was changed using the `as` prop or changing
         * the dom node `getRootProps` is spread unto (to a `div` or `span`), we'll trigger
         * click on the input when the element is clicked.
         * @see Issue https://github.com/chakra-ui/chakra-ui/issues/3480
         */
        if (!rootIsLabelElement) {
          inputRef.current?.click()
          focus(inputRef.current, { nextTick: true })
        }
      }),
      "data-disabled": dataAttr(isDisabled),
    }); },
    [htmlProps, isDisabled, rootIsLabelElement],
  )

  const getInputProps: PropGetter = useCallback(
    function (props = {}, forwardedRef = null) {
      const onFocus = () => {
        scheduleMicrotask(setFocused.on)
      }
      return {
        ...props,
        ref: mergeRefs(inputRef, forwardedRef),
        type: "checkbox",
        name,
        value,
        id,
        onChange: callAllHandlers(props.onChange, handleChange),
        onBlur: callAllHandlers(props.onBlur, onBlurProp, setFocused.off),
        onFocus: callAllHandlers(props.onFocus, onFocusProp, onFocus),
        onKeyDown: callAllHandlers(props.onKeyDown, onKeyDown),
        onKeyUp: callAllHandlers(props.onKeyUp, onKeyUp),
        required: isRequired,
        checked: isChecked,
        disabled: trulyDisabled,
        readOnly: isReadOnly,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-invalid": ariaInvalid ? Boolean(ariaInvalid) : isInvalid,
        "aria-describedby": ariaDescribedBy,
        "aria-disabled": isDisabled,
        style: visuallyHiddenStyle,
      }
    },
    [
      name,
      value,
      id,
      handleChange,
      setFocused.off,
      setFocused.on,
      onBlurProp,
      onFocusProp,
      onKeyDown,
      onKeyUp,
      isRequired,
      isChecked,
      trulyDisabled,
      isReadOnly,
      ariaLabel,
      ariaLabelledBy,
      ariaInvalid,
      isInvalid,
      ariaDescribedBy,
      isDisabled,
    ],
  )

  const getLabelProps: PropGetter = useCallback(
    function (props = {}, forwardedRef = null) { return ({
      ...props,
      ref: forwardedRef,
      onMouseDown: callAllHandlers(props.onMouseDown, stopEvent),
      onTouchStart: callAllHandlers(props.onTouchStart, stopEvent),
      "data-disabled": dataAttr(isDisabled),
      "data-checked": dataAttr(isChecked),
      "data-invalid": dataAttr(isInvalid),
    }); },
    [isChecked, isDisabled, isInvalid],
  )

  return {
    state: {
      isInvalid,
      isFocused,
      isChecked,
      isActive,
      isHovered,
      isIndeterminate,
      isDisabled,
      isReadOnly,
      isRequired,
    },
    getRootProps,
    getCheckboxProps,
    getInputProps,
    getLabelProps,
    htmlProps,
  }
}

/**
 * Prevent `onBlur` being fired when the checkbox text is touched
 */
function stopEvent(event: React.SyntheticEvent) {
  event.preventDefault()
  event.stopPropagation()
}

export type UseCheckboxReturn = ReturnType<typeof useCheckbox>
