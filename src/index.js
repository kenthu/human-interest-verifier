import parseActivity from './verifier.js';

window.onload = function() {
  window.addEventListener('paste', (event) => {
      let paste = (event.clipboardData || window.clipboardData).getData('text');
      parseOutput = parseActivity(paste);
      event.preventDefault();
  });
}
