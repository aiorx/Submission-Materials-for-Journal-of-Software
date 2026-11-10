```python
def listen_can_messages(self):
    with self.cubesat.can_bus.listen(timeout=1.0) as listener:
        message_count = listener.in_waiting()
        self.debug_print(str(message_count) + " messages available")
        for _i in range(message_count):
            msg = listener.receive()
            self.debug_print("Message from " + hex(msg.id))

            # We aren't sure if isinstance checks currently work
            if isinstance(msg, Message):
                self.debug_print("message data: " + str(msg.data))
            if isinstance(msg, RemoteTransmissionRequest):
                self.debug_print("RTR length: " + str(msg.length))
                # Here you can process the RTR request
                # For example, you might send a response with the requested data
                response_data = self.get_data_for_rtr(msg.id)
                if isinstance(response_data, list):
                    response_messages = [
                        Message(id=msg.id, data=data, extended=True)
                        for data in response_data
                    ]
                else:
                    response_messages = [
                        Message(id=msg.id, data=response_data, extended=True)
                    ]
                self.cubesat.send_can(response_messages)
```