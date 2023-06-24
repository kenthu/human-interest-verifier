import { useEffect } from 'react';

export const useHandlePaste = (handlePastedText: (pastedText: string) => void): void => {
  useEffect(() => {
    const handlePasteEvent = (event: Event): void => {
      const pastedText = (event as ClipboardEvent).clipboardData?.getData('text');
      if (pastedText) {
        handlePastedText(pastedText);
      }
      event.preventDefault();
    };

    window.addEventListener('paste', handlePasteEvent);
    return function cleanup() {
      window.removeEventListener('paste', handlePasteEvent);
    };
  }, [handlePastedText]);
};
