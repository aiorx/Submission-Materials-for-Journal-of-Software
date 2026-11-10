var EventHandlerInterface = require('./event-handler.interface');
var EventInterface = require('./event.interface');

module.exports = interface EventDispatcherInterface {;
  notify(event: EventInterface): void;
  register(eventName: string, eventHandler: EventHandlerInterface): void;
  unregister(eventName: string, eventHandler: EventHandlerInterface): void;
  unregisterAll(): void;
}
