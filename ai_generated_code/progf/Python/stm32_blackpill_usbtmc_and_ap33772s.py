# parts of this script were auto-Supported via standard GitHub programming aids, ChatGPT

import machine
from AP33772S import AP33772S
import time
time.sleep(3)

i2c=machine.I2C(1, freq=100_000) # PB6 SCL, PB7 SDA not adjustable, frequency is always 320kHz
ap33772s = AP33772S(i2c=i2c)

import pyb # only available on STM32
USB_VCP = pyb.USB_VCP

class USBTMCDevice:
    def __init__(self):
        # Initialize the USB virtual COM port. In a real device, this would be
        # configured to enumerate as a USB Test & Measurement Class device.
        self.usb = USB_VCP()
    
    def wait_for_command(self):
        # In a real USBTMC device, data would come over a bulk OUT endpoint.
        while not self.usb.any():
            time.sleep(0.1)
        # Read up to 64 bytes (adjust as needed).
        return self.usb.read(64)
    
    def send_response(self, response):
        # In a real USBTMC device, data would be sent via the bulk IN endpoint.
        self.usb.write(response)

def main():
    usb_tmc = USBTMCDevice()
    
    while True:
        data = usb_tmc.wait_for_command()
        if data:
            command = data.decode('utf-8').strip().replace(" ", "").upper()
            
            if command == "*IDN?":
                usb_tmc.send_response("USBPD:VOLTAGE?,USBPD:CURRENT?,USBPD:SRCPDO 1?,USBPD:RDO 1,USBPD:OUTPUT 1\n")
            elif command == "USBPD:VOLTAGE?" or command == "USBPD:VOLT?":
                usb_tmc.send_response(str(ap33772s.get_voltage()) + "\n")
            elif command == "USBPD:CURRENT?" or command == "USBPD:CURR?":
                usb_tmc.send_response(str(ap33772s.get_current()) + "\n")
            elif command == "USBPD:SRCPDO1?":
                usb_tmc.send_response(str(ap33772s.get_pdo(1)) + "\n")
            elif command == "USBPD:SRCPDO2?":
                usb_tmc.send_response(str(ap33772s.get_pdo(2)) + "\n")
            elif command == "USBPD:SRCPDO3?":
                usb_tmc.send_response(str(ap33772s.get_pdo(3)) + "\n")
            elif command == "USBPD:SRCPDO4?":
                usb_tmc.send_response(str(ap33772s.get_pdo(4)) + "\n")
            elif command == "USBPD:SRCPDO5?":
                usb_tmc.send_response(str(ap33772s.get_pdo(5)) + "\n")
            elif command == "USBPD:SRCPDO6?":
                usb_tmc.send_response(str(ap33772s.get_pdo(6)) + "\n")
            elif command == "USBPD:SRCPDO7?":
                usb_tmc.send_response(str(ap33772s.get_pdo(7)) + "\n")
            elif command == "USBPD:SRCPDO8?":
                usb_tmc.send_response(str(ap33772s.get_pdo(8)) + "\n")
            elif command == "USBPD:SRCPDO9?":
                usb_tmc.send_response(str(ap33772s.get_pdo(9)) + "\n")
            elif command == "USBPD:SRCPDO10?":
                usb_tmc.send_response(str(ap33772s.get_pdo(10)) + "\n")
            elif command == "USBPD:SRCPDO11?":
                usb_tmc.send_response(str(ap33772s.get_pdo(11)) + "\n")
            elif command == "USBPD:SRCPDO12?":
                usb_tmc.send_response(str(ap33772s.get_pdo(12)) + "\n")
            elif command == "USBPD:SRCPDO13?":
                usb_tmc.send_response(str(ap33772s.get_pdo(13)) + "\n")
            elif command == "USBPD:OUTPUT1":
                ap33772s.set_output('AUTO')
            elif command == "USBPD:OUTPUT0":
                ap33772s.set_output('OFF')
            elif command == "USBPD:RDO1":
                ap33772s.set_rdo_max(1)
            elif command == "USBPD:RDO2":
                ap33772s.set_rdo_max(2)
            elif command == "USBPD:RDO3":
                ap33772s.set_rdo_max(3)
            elif command == "USBPD:RDO4":
                ap33772s.set_rdo_max(4)
            elif command == "USBPD:RDO5":
                ap33772s.set_rdo_max(5)
            elif command == "USBPD:RDO6":
                ap33772s.set_rdo_max(6)
            elif command == "USBPD:RDO7":
                ap33772s.set_rdo_max(7)
            elif command == "USBPD:RDO8":
                ap33772s.set_rdo_max(8)
            elif command == "USBPD:RDO9":
                ap33772s.set_rdo_max(9)
            elif command == "USBPD:RDO10":
                ap33772s.set_rdo_max(10)
            elif command == "USBPD:RDO10":
                ap33772s.set_rdo_max(11)
            elif command == "USBPD:RDO1":
                ap33772s.set_rdo_max(11)
            elif command == "USBPD:RDO12":
                ap33772s.set_rdo_max(12)
            elif command == "USBPD:RDO13":
                ap33772s.set_rdo_max(13)

if __name__ == "__main__":
    main()