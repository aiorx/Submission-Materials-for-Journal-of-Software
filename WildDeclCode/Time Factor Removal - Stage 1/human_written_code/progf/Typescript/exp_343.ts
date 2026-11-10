// tests go here; this will not be compiled when this package is used as a library
var slider: Andee.Widget = null
var button: Andee.Widget = null
var text = ""
var keyboard: Andee.Widget = null
var dataDisplay: Andee.Widget = null
var value = 0



Andee.begin()
dataDisplay = Andee.createWidget(
    WidgetId.Widget_1,
    WidgetType.Databox,
    WidgetPosition.Row0_Column0,
    WidgetLength.Full,
    WidgetColour.Red,
    "Widget",
    "Databox",
    "Test"
)
button = Andee.createWidget(
    WidgetId.Widget_2,
    WidgetType.Button,
    WidgetPosition.Row1_Column0,
    WidgetLength.Half,
    WidgetColour.Green,
    "Press me!",
    "Data",
    "Units"
)
keyboard = Andee.createWidget(
    WidgetId.Widget_3,
    WidgetType.Keyboard_In,
    WidgetPosition.Row1_Column2,
    WidgetLength.Half,
    WidgetColour.Blue,
    "Press me!",
    "Data",
    "Units"
)
slider = Andee.createJoystickWidget(
    WidgetId.Widget_4,
    WidgetPosition.Row3_Column0,
    WidgetLength.Full,
    WidgetColour.Orange,
    "Joystick",
    "100",
    "50"
)

Andee.WidgetEvent(WidgetId.Widget_2, function () {
    dataDisplay.setData("Button Pressed")
})
Andee.WidgetEvent(WidgetId.Widget_3, function () {
    keyboard.ack()
    text = Andee.getKeyboard()
    dataDisplay.setData(text)
})

serial.redirect(
    SerialPin.P1,
    SerialPin.P2,
    BaudRate.BaudRate115200
)

basic.forever(function () {
    button.updateLoop(80)
    dataDisplay.updateLoop(52)
    keyboard.updateLoop(85)
    slider.updateLoop(50)
})
