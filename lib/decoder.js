var PRIMATIVE_TYPES = require('./types').PRIMATIVE_TYPES;

function Decoder(struct, options) {
  options = options || {};
  this._buffer = null;
  this._offset = 0;
  this._struct = null;
  this._start = options.start;
}

Object.keys(PRIMATIVE_TYPES)
  .forEach(function(type) {
    Decoder.prototype[type.toLowerCase()] = function() {
      return this._buffer['read' + type](this._offset += PRIMATIVE_TYPES[type]);
    }
  });

Decoder.prototype.decode = function(buf, struct) {
  
  if (typeof struct === 'number') {
    return this.bit.call(this, struct);
  }

}

module.exports = exports = Decoder;
