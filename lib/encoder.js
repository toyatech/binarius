var utils = require('./utils');

var PRIMATIVE_TYPES = require('./types').PRIMATIVE_TYPES;

function Encoder(struct, options) {
  options = options || {};
  this._object = {};
  this._offset = 0;
  this._start = options.start;
  this._struct = utils.inherit(Encoder.prototype._struct, struct);
}

Encoder.prototype._struct = {};

Object.keys(PRIMATIVE_TYPES)
  .forEach(function(type) {
    Encoder.prototype._struct[type.toLowerCase()] = function() {
      var value = 0;
      var buf = new Buffer(PRIMATIVE_TYPES[type]);
      buf['write' + type](value, 0);
      return buf;
    }
  });

Encoder.prototype.encode = function(obj, struct) {
  if (arguments.length > 1 && typeof struct === 'string') {
    if (!(typeof obj === 'object'))
      throw new Error('First argument must be an Object');
    this._object = obj;
    struct = struct || this._start;
  } else {
    struct = obj;
  }

  if (typeof struct === 'number') {
    return 0;
  }

  if (struct instanceof Function) {
    return struct.apply(this, Array.prototype.slice.call(arguments, 1));
  }

  if (typeof struct === 'string') {
    struct = [struct];
  }

  if (struct instanceof Array) {
    var key = struct[0];
    if (!(key in this._struct)) {
      throw new Error('Missing structure for `' + key + '`');
    }
    return this.encode.apply(this, [this._struct[key]].concat(struct.slice(1)));
  }

  if (typeof struct === 'object') {
    var output = [],
      current = this.current;

    for (var key in struct) {
      var value = this.encode(struct[key]);
      if (value !== undefined) {
        output.push(value);
      }
    }
    this.current = current;
    return new Buffer(output);
  }

  throw new Error('Unknown structure type `' + struct + '`');
};

module.exports = exports = Encoder;
