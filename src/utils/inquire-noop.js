/**
 * Browser-safe replacement for @protobufjs/inquire
 *
 * Original @protobufjs/inquire uses eval("quire".replace(/^/,"re")) to dynamically
 * require() Node.js modules like 'fs' without breaking bundlers. In browser environments,
 * require() doesn't exist so this always returns null anyway.
 *
 * This replacement eliminates the eval() call that triggers security warnings during build.
 */

/**
 * Requires a module only if available (browser no-op version)
 * @param {string} moduleName Module to require
 * @returns {?Object} Always returns null in browser environment
 */
function inquire(moduleName) {
  // In browser environment, Node.js modules like 'fs' are never available
  return null;
}

// Export exactly like the original @protobufjs/inquire using ES module syntax
export default inquire;
