var React = require('react');
var dataAttr = require('~/utils').dataAttr;
var isRightClick = require('~/utils').isRightClick;
var mergeRefs = require('~/react-utils').mergeRefs;
var useEventListeners = require('./use-event-listeners').useEventListeners;

export interface UseClickableProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * If `true`, the element will be disabled.
   * It will set the `disabled` HTML attribute
   */
  isDisabled?: boolean
  /**
   * If `true` and isDisabled, the element will
   * have only `aria-disabled` set to `true`
   */
  isFocusable?: boolean
  /**
   * Whether or not trigger click on pressing `Enter`.
   */
  clickOnEnter?: boolean
  /**
   * Whether or not trigger click on pressing `Space`.
   */
  clickOnSpace?: boolean
  /**
   * The ref for the element
   */
  ref?: React.Ref<HTMLElement>
}

function isValidElement(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement
  var tagName = element.tagName;
var isContentEditable = element.isContentEditable;return tagName !== "INPUT" && tagName !== "TEXTAREA" && isContentEditable !== true
}

/**
 * useClickable implements all the interactions of a native `button`
 * component with support for making it focusable even if it is disabled.
 *
 * It can be used with both native button elements or other elements (like `div`).
 */
function useClickable(props: UseClickableProps = {}) {
  var isDisabled = props.isDisabled;
var isFocusable = props.isFocusable;
var clickOnEnter = props.clickOnEnter;
var clickOnSpace = props.clickOnSpace;
var onMouseDown = props.onMouseDown;
var onMouseUp = props.onMouseUp;
var onClick = props.onClick;
var onKeyDown = props.onKeyDown;
var onKeyUp = props.onKeyUp;
var onMouseOver = props.onMouseOver;
var onMouseLeave = props.onMouseLeave;/**
   * We'll use this to track if the element is a button element
   */
  const [isButton, setIsButton] = React.useState(true)

  /**
   * For custom button implementation, we'll use this to track when
   * we mouse down on the button, to enable use style its ":active" style
   */
  const [isPressed, setIsPressed] = React.useState(false)

  const listeners = useEventListeners()

  /**
   * The ref callback that fires as soon as the dom node is ready
   */
  const refCallback = function (node: any) {
    if (!node) return
    if (node.tagName !== "BUTTON") {
      setIsButton(false)
    }
  }

  const tabIndex = isButton ? tabIndexProp : tabIndexProp || 0
  const trulyDisabled = isDisabled && !isFocusable

  const handleClick = React.useCallback(
    function (event: React.MouseEvent<HTMLElement>) {
      if (isDisabled) {
        event.stopPropagation()
        event.preventDefault()
        return
      }

      const self = event.currentTarget as HTMLElement
      self.focus()
      (onClick == null ? undefined : onClick(event))
    },
    [isDisabled, onClick],
  )

  const onDocumentKeyUp = React.useCallback(
    function (e: KeyboardEvent) {
      if (isPressed && isValidElement(e)) {
        e.preventDefault()
        e.stopPropagation()

        setIsPressed(false)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        listeners.remove(document, "keyup", onDocumentKeyUp, false)
      }
    },
    [isPressed, listeners],
  )

  const handleKeyDown = React.useCallback(
    function (event: React.KeyboardEvent<HTMLElement>) {
      (onKeyDown == null ? undefined : onKeyDown(event))

      if (isDisabled || event.defaultPrevented || event.metaKey) {
        return
      }

      if (!isValidElement(event.nativeEvent) || isButton) return

      const shouldClickOnEnter = clickOnEnter && event.key === "Enter"
      const shouldClickOnSpace = clickOnSpace && event.key === " "

      if (shouldClickOnSpace) {
        event.preventDefault()
        setIsPressed(true)
      }

      if (shouldClickOnEnter) {
        event.preventDefault()
        const self = event.currentTarget as HTMLElement
        self.click()
      }

      listeners.add(document, "keyup", onDocumentKeyUp, false)
    },
    [isDisabled, isButton, onKeyDown, clickOnEnter, clickOnSpace, listeners, onDocumentKeyUp],
  )

  const handleKeyUp = React.useCallback(
    function (event: React.KeyboardEvent<HTMLElement>) {
      (onKeyUp == null ? undefined : onKeyUp(event))

      if (isDisabled || event.defaultPrevented || event.metaKey) return

      if (!isValidElement(event.nativeEvent) || isButton) return

      const shouldClickOnSpace = clickOnSpace && event.key === " "

      if (shouldClickOnSpace) {
        event.preventDefault()
        setIsPressed(false)

        const self = event.currentTarget as HTMLElement
        self.click()
      }
    },
    [clickOnSpace, isButton, isDisabled, onKeyUp],
  )

  const onDocumentMouseUp = React.useCallback(
    function (event: MouseEvent) {
      if (event.button !== 0) return
      setIsPressed(false)
      listeners.remove(document, "mouseup", onDocumentMouseUp, false)
    },
    [listeners],
  )

  const handleMouseDown = React.useCallback(
    function (event: React.MouseEvent<HTMLElement>) {
      if (isRightClick(event)) return

      if (isDisabled) {
        event.stopPropagation()
        event.preventDefault()
        return
      }

      if (!isButton) {
        setIsPressed(true)
      }

      const target = event.currentTarget as HTMLElement
      target.focus({ preventScroll: true })

      listeners.add(document, "mouseup", onDocumentMouseUp, false)

      (onMouseDown == null ? undefined : onMouseDown(event))
    },
    [isDisabled, isButton, onMouseDown, listeners, onDocumentMouseUp],
  )

  const handleMouseUp = React.useCallback(
    function (event: React.MouseEvent<HTMLElement>) {
      if (isRightClick(event)) return

      if (!isButton) {
        setIsPressed(false)
      }

      (onMouseUp == null ? undefined : onMouseUp(event))
    },
    [onMouseUp, isButton],
  )

  const handleMouseOver = React.useCallback(
    function (event: React.MouseEvent<HTMLElement>) {
      if (isDisabled) {
        event.preventDefault()
        return
      }

      (onMouseOver == null ? undefined : onMouseOver(event))
    },
    [isDisabled, onMouseOver],
  )

  const handleMouseLeave = React.useCallback(
    function (event: React.MouseEvent<HTMLElement>) {
      if (isPressed) {
        event.preventDefault()
        setIsPressed(false)
      }
      (onMouseLeave == null ? undefined : onMouseLeave(event))
    },
    [isPressed, onMouseLeave],
  )

  const ref = mergeRefs(htmlRef, refCallback)

  if (isButton) {
    return {
      ...htmlProps,
      ref,
      type: "button" as React.ButtonHTMLAttributes<any>["type"],
      "aria-disabled": trulyDisabled ? undefined : isDisabled,
      disabled: trulyDisabled,
      onClick: handleClick,
      onMouseDown,
      onMouseUp,
      onKeyUp,
      onKeyDown,
      onMouseOver,
      onMouseLeave,
    }
  }

  return {
    ...htmlProps,
    ref,
    role: "button",
    "data-active": dataAttr(isPressed),
    "aria-disabled": isDisabled ? ("true" as const) : undefined,
    tabIndex: trulyDisabled ? undefined : tabIndex,
    onClick: handleClick,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onKeyUp: handleKeyUp,
    onKeyDown: handleKeyDown,
    onMouseOver: handleMouseOver,
    onMouseLeave: handleMouseLeave,
  }
}

export type UseClickableReturn = ReturnType<typeof useClickable>
