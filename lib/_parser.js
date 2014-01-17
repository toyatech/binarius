var common = require('_common');

var Parser = function(data, options) {
  var structure = options.structure;
  this._offset = 0;
  this._bitShift = 0;
  this._data = data;
  this._structure = common.inherit(Parser.prototype.structure, structure);
}

Object.keys(common.PRIMATIVE_TYPES).forEach(function(type) {
  Parser.prototype.structure[type.toLowerCase] = function() {
    this._data['read' + type](this._offset++);
  }
});

Parser.prototype.structure.bit = function(length) {
  length = common.toInt.call(this, length); 
  var result = 
    this._data.readUInt8(this._offset) >> (8 - this._bitShift - length) 
    & ((1 << length) - 1);
  this._bitShift += length;
  if (this._bitShift === 8) {
    this._offset++;
    this._bitShift = 0;
  }
  return result;
}

Parser.prototype.structure.string = function(length) {
  length = common.toInt.call(this, length);
  return this._data.toString(this._offset++, length);
}

Parser.prototype.structure.array = function(type, length) {
  length = common.toInt.call(this, length);
  var results = [];
  for (var i = 0; i < length; ++i) {
    results.push(this.parse(type));
  }
  return results;
}

Parser.prototype.structure.seek = function(position, block) {
  position = common.toInt.call(this, position);
  if (block instanceof Function) {
    var old_position = this._offset;
    this._offset = position;
    var result = block.call(this);
    this._offset = old_position;
    return result;
  } else {
    return this._offset = position;
  }
}

Parser.prototype.structure.seek = function() { return this._offset; }

Parser.prototype.structure.skip = function(offset) {
  offset = common.toInt.call(this, offset);
  return this._offset += offset;
}

Parser.prototye.structure.if = function(predicate) {
  if (predicate instanceof Function ? predicate.call(this) : predicate) {
    return this.parse.apply(this, Array.prototype.slice.call(arguments, 1));
  }
}

Parser.prototype.parser = function(start) {
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
}

exports.Parser = Parser;
