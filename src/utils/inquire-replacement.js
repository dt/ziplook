/**
 * Browser-safe replacement for @protobufjs/inquire
 *
 * Original @protobufjs/inquire uses eval() to dynamically require() Node.js modules.
 * In browser environments, these modules are never available anyway, so we can
 * safely return null for all inquire calls.
 */

function inquire(moduleName) {
  // In browser environment, Node.js modules are never available
  return null;
}

// Export in both CommonJS and ES module formats for maximum compatibility
if (typeof module !== "undefined" && module.exports) {
  // CommonJS export
  module.exports = inquire;
} else if (typeof exports !== "undefined") {
  // CommonJS exports fallback
  exports.default = inquire;
}

// Also export as default for ES modules
export default inquire;
