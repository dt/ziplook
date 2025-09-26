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

// Export in CommonJS format since protobufjs expects it
module.exports = inquire;