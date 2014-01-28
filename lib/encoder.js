var types = require('./types')
  , utils = require('./utils');

var PRIMATIVE_TYPES = types.PRIMATIVE_TYPES;
var BIT_TYPES = types.BIT_TYPES;

function Encoder(struct, options) {
  options = options || {};
  this._object = {};
  this._path = [];
  this._bitShift = 0;
  this._output = [];
  this._start = options.start;
  this._struct = utils.inherit(Encoder.prototype._struct, struct);
}

Encoder.prototype._struct = {};

Object.keys(PRIMATIVE_TYPES)
  .forEach(function(type) {
    Encoder.prototype._struct[type.toLowerCase()] = function() {
      var val = utils.find(this._object, this._path.slice(0,-1));
      var buf = new Buffer(PRIMATIVE_TYPES[type]);
      buf['write' + type](val, 0);
      return buf;
    }
  });

Object.keys(BIT_TYPES)
  .forEach(function(type) {
    Encoder.prototype._struct[type.toLowerCase()] = function() {
      var val = utils.find(this._object, this._path.slice(0, -1));
      var len = Math.ceil(BIT_TYPES[type] / 8) > 2 ? 4 * 8 
        : Math.ceil(BIT_TYPES[type] / 8) * 8;
      var buf = new Buffer(len/8);
      var typ = len > 8 ? 'BE' : '';
      buf['writeUInt' + len + typ](
        val << this._bitShift | this._output[this._output.length],0);
      return buf;
    }
  });

Encoder.prototype._struct.bit = function(len) {
  len = utils.toInt.call(this, len);
  console.log('_object: ' + JSON.stringify(this._object));
  var val = utils.find(this._object, this._path);
  console.log('val: ' +val);
  var result = val << this._bitShift | this._output[this._output.length];
  console.log('result: ' +result);
  this._bitShift += len;
  if (this._bitShift === 8) {
    this._bitShift = 0;
  }
  return new Buffer([result]);
}

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
    this._path.push(key);
    return this.encode.apply(this, [this._struct[key]].concat(struct.slice(1)));
    this._path.shift();
  }

  if (typeof struct === 'object') {
    var  current = this.current;

    for (var key in struct) {
      var value = this.encode(struct[key]);
      console.log('value: ' +value);
      if (value !== undefined) {
        this._output.push(value);
      }
    }
    this.current = current;
    return new Buffer(this._output);
  }

  throw new Error('Unknown structure type `' + struct + '`');
};

module.exports = exports = Encoder;
