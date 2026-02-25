/**
 * Shim for elkjs/lib/elk.bundled.js in the browser.
 * The real elk.bundled.js is loaded via a <script> tag and sets globalThis.ELK.
 * This module avoids bundling the UMD (which uses require()) and just re-exports the global.
 */
const ELK =
  typeof globalThis !== "undefined" && globalThis.ELK
    ? globalThis.ELK
    : function ELKStub() {
        throw new Error(
          "ELK not loaded. Ensure /elk.bundled.js is loaded before the app."
        );
      };
export default ELK;
