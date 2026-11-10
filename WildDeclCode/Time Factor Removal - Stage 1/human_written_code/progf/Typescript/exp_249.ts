Rangefinder.init()
basic.forever(function () {
    serial.writeNumber(Rangefinder.distance())
    serial.writeString("\r\n")
})
