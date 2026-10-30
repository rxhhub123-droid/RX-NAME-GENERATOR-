/**
 * Robust cross-browser clipboard utility with multiple fallbacks
 * Works reliably on mobile Chrome, Safari, WebView, and desktop browsers.
 */
export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;

  let copied = false;

  // 1. Try modern navigator.clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (err) {
      // navigator.clipboard can fail if document is not focused or user gesture has expired
      copied = false;
    }
  }

  if (copied) return true;

  // 2. Rock-solid fallback using textarea and document.execCommand
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Keep it invisible and non-disruptive
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '1px';
    textArea.style.height = '1px';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch (err) {
    console.warn('Fallback copy error:', err);
  }

  return false;
};
