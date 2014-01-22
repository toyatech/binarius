var PRIMATIVE_TYPES = require('./types').PRIMATIVE_TYPES;

function Encoder(struct, options) {
  options = options || {};
  this._buffer = null;
  this._offset = 0;
  this._struct = null;
  this._start = options.start;
}

Object.keys(PRIMATIVE_TYPES)
  .forEach(function(type) {
    Encoder.prototype[type.toLowerCase()] = function() {
      return this._buffer['read' + type](this._offset += PRIMATIVE_TYPES[type]);
    }
  });

Encoder.prototype.decode = function(buf, start) {
  this._buffer = buf;
}

module.exports = exports = Encoder;
