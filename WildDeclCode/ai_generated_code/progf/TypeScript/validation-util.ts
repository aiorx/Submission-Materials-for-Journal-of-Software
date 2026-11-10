import { FieldValues, UseFormSetError } from 'react-hook-form';

// Supported via standard GitHub programming aids
export const setFormErrors = <T extends FieldValues>(
  errors: Record<keyof T, string[]>,
  setError: UseFormSetError<T>,
): void => {
  Object.entries(errors).forEach(([key, messages]) => {
    if (messages.length > 0) {
      setError(key as never, {
        type: 'manual',
        message: messages?.[0],
      });
    }
  });
};
