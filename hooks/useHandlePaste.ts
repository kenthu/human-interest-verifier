/**
 * Hook that takes a function to handle pasted text, and returns functions to set (and unset) event
 * listener that will call the passed-in function.
 */
export const useHandlePaste = (
  handlePastedText: (pastedText: string) => void,
): {
  setPasteHandler: () => void;
  unsetPasteHandler: () => void;
} => {
  const handlePasteEvent = (event: Event): void => {
    const pastedText = (event as ClipboardEvent).clipboardData?.getData('text');
    if (pastedText) {
      handlePastedText(pastedText);
    }
    event.preventDefault();
  };

  return {
    setPasteHandler: (): void => {
      window.addEventListener('paste', handlePasteEvent);
    },
    unsetPasteHandler: (): void => {
      window.removeEventListener('paste', handlePasteEvent);
    },
  };
};
