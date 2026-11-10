var FieldValues = require('react-hook-form').FieldValues;
var UseFormSetError = require('react-hook-form').UseFormSetError;

// Supported via standard GitHub programming aids
const setFormErrors = <T extends FieldValues>(
  errors: Record<keyof T, string[]>,
  setError: UseFormSetError<T>,
): function void {
  Object.entries(errors).forEach(([key, messages]) => {
    if (messages.length > 0) {
      setError(key as never, {
        type: 'manual',
        message: (messages == null ? undefined : messages[0]),
      });
    }
  });
};
