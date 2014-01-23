var utils = require('./utils');

var PRIMATIVE_TYPES = require('./types').PRIMATIVE_TYPES;

function Decoder(struct, options) {
  options = options || {};
  this._buffer = null;
  this._offset = 0;
  this._start = options.start;
  this._struct = utils.inherit(Decoder.prototype._struct, struct);
}

Decoder.prototype._struct = {};

Object.keys(PRIMATIVE_TYPES)
  .forEach(function(type) {
    Decoder.prototype._struct[type.toLowerCase()] = function() {
      var result = this._buffer['read' + type](this._offset);
      this._offset = this._offset + PRIMATIVE_TYPES[type];
      return result;
    }
  });

Decoder.prototype.decode = function(buf, struct) {
  if (arguments.length > 1) {
    if (!(buf instanceof Buffer))
      throw new Error('First argument must be an instance of Buffer');
    this._buffer = buf;
    struct = struct || this._start;
  } else {
    struct = buf;
  }
 
  if (typeof struct === 'number') {
    // decode bit
  }

  if (struct instanceof Function) {
    return struct.apply(this, Array.prototype.slice.call(arguments, 1));
  }

  if (typeof struct === 'string') {
    //struct = Array.prototype.slice.call(arguments).slice(1);
    struct = [struct];
  }

  if (struct instanceof Array) {
    var key = struct[0];
    if (!(key in this._struct)) {
      throw new Error('Missing structure for `' + key + '`');
    }
    return this.decode.apply(this, [this._struct[key]].concat(struct.slice(1)));
  }

  if (typeof struct === 'object') {
    var output = {},
      current = this.current;
    this.current = output;
    
    for (var key in struct) {
      var value = this.decode(struct[key]);
      if (value !== undefined) {
        output[key] = value;
      }
    }
    this.current =  current;
    return output;
  }

  throw new Error('Unknown structure type `' + struct + '`');
};

module.exports = exports = Decoder;
