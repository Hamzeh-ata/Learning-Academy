import { useEffect } from 'react';

export const usePreventWindowClose = (message = 'Are you sure you want to leave?', onConfirm) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = message; // Standard for most browsers
      if (onConfirm && window.confirm(message)) {
        onConfirm();
      }
      return message; // For some older browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};
