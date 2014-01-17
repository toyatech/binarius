var util = require('util')

function toInt(val) {
  return val instanceof Function ? val.call(this) : val;
}

function inherit(obj) {
  obj = Object.create(obj);
  for (var i = 1; i < arguments.length; ++i) {
    var source = arguments[i];
    for (var prop in source) {
      if (source[prop] !== undefined) {
        obj[prop] = source[prop];
      }
    }
  }
  return obj;
}

function Parser(data, structure) {
  this._offset = 0;
  this._bitShift = 0;
  this._data = data;
  this.structure = 
    inherit(Parser.prototype.structure, structure);
}

Parser.prototype.structure = {
  uint8: function () { return this._data.readUInt8(this._offset++); },
  uint16: function () { return this._data.readUInt16LE(this._offset++); },
  uint32: function () { return this._data.readUInt32LE(this._offset++); },
  int8: function () { return this._data.readInt8(this._offset++); },
  int16: function () { return this._data.readInt16LE(this._offset++); },
  int32: function () { return this._data.readInt32LE(this._offset++); },
  double: function () { return this._data.readDoubleLE(this._offset++); },
  float: function () { return this._data.readFloatLE(this._offset++); },
  uint16be: function () { return this._data.readUInt16BE(this._offset++); },
  uint32be: function () { return this._data.readUInt32BE(this._offset++); },
  int16be: function () { return this._data.readInt16BE(this._offset++); },
  int32be: function () { return this._data.readInt32BE(this._offset++); },
  doublebe: function () { return this._data.readDoubleBE(this._offset++); },
  floatbe: function () { return this._data.readFloatBE(this._offset++); },
  bit: function (length) {
    length = toInt.call(this, length);
    var result = 
      this._data.readUInt8(this._offset) >> (8 - this._bitShift - length)
      & ((1 << length) - 1);
    this._bitShift += length;
    if (this._bitShift === 8) {
      this._offset++;
      this._bitShift = 0;
    }
    return result;
  }, 
  char: function () { return this._data.toString(this._offset++, 1); },
  string: function (length) { 
    return this._data.toString(this._offset++, length);
  },
  array: function (type, length) {
    length = toInt.call(this, length);
    var results = [];
    for (var i = 0; i < length; ++i) {
      results.push(this.parse(type));
    }
    return results;
  },
  seek: function (position, block) {
    position = toInt.call(this, position);
    if (block instanceof Function) {
      var old_position = this._offset;
      this._offset = position;
      var result = block.call(this);
      this._offset = old_position;
      return result;
    } else {
      return this._offset = position;
    }
  },
  tell: function () { return this._offset; },
  skip: function (offset) {
    offset = toInt.call(this, offset);
    return this._offset += offset;
  },
  if: function (predicate) {
    if (predicate instanceof Function ? predicate.call(this) : predicate) {
      return this.parse.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
};

Parser.prototype.seek = Parser.prototype.structure.seek;
Parser.prototype.tell = Parser.prototype.structure.tell;
Parser.prototype.skip = Parser.prototype.structure.skip;

Parser.prototype.parse = function(structure) {
  if (typeof structure === 'number') {
    return this.structure.bit.call(this, structure);
  }

  if (structure instanceof Function) {
    return structure.apply(this, Array.prototype.slice.call(arguments, 1));
  }

  if (typeof structure === 'string') {
    structure = Array.prototype.slice.call(arguments);
  }

  if (structure instanceof Array) {
    var key = structure[0];
    if (!(key in this.structure)) {
      throw new Error('Missing structure for `' + key + '`');
    }
    return this.parse.apply(
      this, [this.structure[key]].concat(structure.slice(1)));
  }

  if (typeof structure === 'object') {
    var output = {},
      current = this.current;
    this.current = output;

    for (var key in structure) {
      var value = this.parse(structure[key]);
      if (value !== undefined) {
        output[key] = value;
      }
    }
    this.current = current;
    return output;
  }

  throw new Error('Unknown structure type`' + structure + '`');
};

exports.Parser = Parser;

function Serializer(data, structure) {
  this._offset = 0;
  this._bitShift = 0;
  this._data = data;
  this.structure =
    inherit(Serializer.prototype.structure, structure);
}

Serializer.prototype.structure = {
  uint8: function () { return this._data.writeUInt8(this._offset++); },
  uint16: function () { return this._data.writeUInt16LE(this._offset++); },
  uint32: function () { return this._data.writeUInt32LE(this._offset++); },
  int8: function () { return this._data.writeInt8(this._offset++); },
  int16: function () { return this._data.writeInt16LE(this._offset++); },
  int32: function () { return this._data.writeInt32LE(this._offset++); },
  double: function () { return this._data.writeDoubleLE(this._offset++); },
  float: function () { return this._data.writeFloatLE(this._offset++); },
  uint16be: function () { return this._data.writeUInt16BE(this._offset++); },
  uint32be: function () { return this._data.writeUInt32BE(this._offset++); },
  int16be: function () { return this._data.writeInt16BE(this._offset++); },
  int32be: function () { return this._data.writeInt32BE(this._offset++); },
  doublebe: function () { return this._data.writeDoubleBE(this._offset++); },
  floatbe: function () { return this._data.writeFloatBE(this._offset++); },
  bit: function (length) {
    length = toInt.call(this, length);
    var result =
      this._data.readUInt8(this._offset) >> (8 - this._bitShift - length)
      & ((1 << length) - 1);
    this._bitShift += length;
    if (this._bitShift === 8) {
      this._offset++;
      this._bitShift = 0;
    }
    return result;
  },
  char: function () { return this._data.toString(this._offset++, 1); },
  string: function (length) {
    return this._data.toString(this._offset++, length);
  },
  array: function (type, length) {
    length = toInt.call(this, length);
    var results = [];
    for (var i = 0; i < length; ++i) {
      results.push(this.parse(type));
    }
    return results;
  },
  seek: function (position, block) {
    position = toInt.call(this, position);
    if (block instanceof Function) {
      var old_position = this._offset;
      this._offset = position;
      var result = block.call(this);
      this._offset = old_position;
      return result;
    } else {
      return this._offset = position;
    }
  },
  tell: function () { return this._offset; },
  skip: function (offset) {
    offset = toInt.call(this, offset);
    return this._offset += offset;
  },
  if: function (predicate) {
    if (predicate instanceof Function ? predicate.call(this) : predicate) {
      return this.parse.apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
};

Serializer.prototype.seek = Serializer.prototype.structure.seek;
Serializer.prototype.tell = Serializer.prototype.structure.tell;
Serializer.prototype.skip = Serializer.prototype.structure.skip;

Serializer.prototype.serialize = function(structure) {
  if (typeof structure === 'number') {
    return this.structure.bit.call(this, structure);
  }

  if (structure instanceof Function) {
    return structure.apply(this, Array.prototype.slice.call(arguments, 1));
  }

  if (typeof structure === 'string') {
    structure = Array.prototype.slice.call(arguments);
  }

  if (structure instanceof Array) {
    var key = structure[0];
    if (!(key in this.structure)) {
      throw new Error('Missing structure for `' + key + '`');
    }
    return this.parse.apply(
      this, [this.structure[key]].concat(structure.slice(1)));
  }

  if (typeof structure === 'object') {
    var output = {},
      current = this.current;
    this.current = output;

    for (var key in structure) {
      var value = this.parse(structure[key]);
      if (value !== undefined) {
        output[key] = value;
      }
    }
    this.current = current;
    return output;
  }

  throw new Error('Unknown structure type`' + structure + '`');
};

