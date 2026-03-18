/*! https://mths.be/base64 v1.0.0 by @mathias | MIT license */

// Define the base64 functionality
class InvalidCharacterError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InvalidCharacterError';
    }
  }
  
  const TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;
  
  function error(message) {
    throw new InvalidCharacterError(message);
  }
  
  /**
   * Decodes a base64 string to a UTF-8 string
   * @param {string} input - The base64 string to decode
   * @returns {string} The decoded string
   */
  function decode(input) {
    input = String(input).replace(REGEX_SPACE_CHARACTERS, '');
    let length = input.length;
    
    if (length % 4 === 0) {
      input = input.replace(/==?$/, '');
      length = input.length;
    }
    
    if (length % 4 === 1 || /[^+a-zA-Z0-9/]/.test(input)) {
      error('Invalid character: the string to be decoded is not correctly encoded.');
    }
    
    let bitCounter = 0;
    let bitStorage;
    let buffer;
    let output = '';
    let position = -1;
    
    while (++position < length) {
      buffer = TABLE.indexOf(input.charAt(position));
      bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
      
      if (bitCounter++ % 4) {
        output += String.fromCharCode(0xFF & bitStorage >> (-2 * bitCounter & 6));
      }
    }
    
    return output;
  }
  
  /**
   * Encodes a string to base64
   * @param {string} input - The string to encode
   * @returns {string} The base64 encoded string
   */
  function encode(input) {
    input = String(input);
    
    if (/[^\0-\xFF]/.test(input)) {
      error('The string to be encoded contains characters outside of the Latin1 range.');
    }
    
    const padding = input.length % 3;
    let output = '';
    let position = -1;
    let a, b, c, buffer;
    const length = input.length - padding;
  
    while (++position < length) {
      a = input.charCodeAt(position) << 16;
      b = input.charCodeAt(++position) << 8;
      c = input.charCodeAt(++position);
      buffer = a + b + c;
      
      output += (
        TABLE.charAt(buffer >> 18 & 0x3F) +
        TABLE.charAt(buffer >> 12 & 0x3F) +
        TABLE.charAt(buffer >> 6 & 0x3F) +
        TABLE.charAt(buffer & 0x3F)
      );
    }
  
    if (padding === 2) {
      a = input.charCodeAt(position) << 8;
      b = input.charCodeAt(++position);
      buffer = a + b;
      
      output += (
        TABLE.charAt(buffer >> 10) +
        TABLE.charAt((buffer >> 4) & 0x3F) +
        TABLE.charAt((buffer << 2) & 0x3F) +
        '='
      );
    } else if (padding === 1) {
      buffer = input.charCodeAt(position);
      
      output += (
        TABLE.charAt(buffer >> 2) +
        TABLE.charAt((buffer << 4) & 0x3F) +
        '=='
      );
    }
  
    return output;
  }
  
  // Create the base64 object with all methods
  const base64 = {
    encode,
    decode,
    version: '1.0.0'
  };
  
  // Export the base64 object as both default and named export
  export { base64 as default };
  export { encode, decode };