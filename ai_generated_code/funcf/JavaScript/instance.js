function createReactive(obj, handler) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  return new Proxy(obj, {
    set(target, property, value, receiver) {
      // Get the current value of the property
      const currentValue = Reflect.get(target, property, receiver);

      // Only proceed if the new value is different from the current value
      if (currentValue !== value) {
        if (typeof value === 'object' && value !== null) {
          value = createReactive(value, handler); // Recursively make nested objects reactive
        }

        // Set the new value
        const result = Reflect.set(target, property, value, receiver);

        // Call the handler only if the value has changed
        handler(target, property, value, currentValue);

        return result;
      }

      // If the value hasn't changed, return true (indicating success) without calling the handler
      return true;
    },
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      if (typeof value === 'object' && value !== null) {
        return createReactive(value, handler); // Recursively make nested objects reactive
      }
      return value;
    }
  });
}