var types = require('./types')
  , utils = require('./utils');

var PRIMATIVE_TYPES = types.PRIMATIVE_TYPES;
var BIT_TYPES = types.BIT_TYPES;

function Decoder(struct, options) {
  options = options || {};
  this._buffer = null;
  this._offset = 0;
  this._bitShift = 0;
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

Object.keys(BIT_TYPES)
  .forEach(function(type) {
    Decoder.prototype._struct[type.toLowerCase()] = function() {
<<<<<<< HEAD
      var len = Math.ceil(BIT_TYPES[type] / 8) > 2 
        ? 4 * 8 : Math.ceil(BIT_TYPES[type] / 8) * 8;
      var typ = len > 8 ? 'BE' : '';
      var result = this._buffer['readUInt' + len + typ](this._offset) 
        >> (len - this._bitShift - BIT_TYPES[type]) 
        & ((1 << BIT_TYPES[type]) - 1);
      if (this._bitShift === 8) {
        this._offset++;
        this._bitShift = 0;
      }
      return result;
=======
      return 0;
>>>>>>> 27a62750bdeff7f0a20a564002cd745ad6aa09cc
    }
  });

Decoder.prototype._struct.bit = function(len) {
  len = utils.toInt.call(this, len);
  var result = 
    this._buffer.readUInt8(this._offset) >> (8 - this._bitShift - len)
    & ((1 << len) - 1);
  this._bitShift += len;
  if (this._bitShift === 8) {
    this._offset++;
    this._bitShift = 0;
  }
  return result;
}

Decoder.prototype._struct.array = function(type, len) {
  len = utils.toInt.call(this, len);
  var results = [];
  for (var i = 0; i < len; ++i) {
    results.push(this.decode(type));
  }
}

Decoder.prototype._struct.string = function(length) {
  length = utils.toInt.call(this, length);
  return this._data.toString(this._offset++, length);
}

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
    return this._struct.bit.call(this, struct);
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
