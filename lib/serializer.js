var common = require('_common');

function Serializer(object, options) {
  this._offset = 0;
  this._bitShift = 0;
  this._data = data;
}

Serializer.prototype.structure = {
  
  uint8: function(value) { this._data.writeUInt8(value, this._offset++); }
  bit: function(value, length) {
    length = common.toInt.call(this, length);
    
  } 

};

Serializer.prototype.serialize = function(structure) {

  if (typeof structure === 'number') {
    return this.structure.bit.call(this, structure);
  }

  if (structure instanceof Function) {
    return structure.apply(this, Array.prototype.slice.call(arguments, 1));
  }

  if (typeof structure === 'object') {
    for (var key in structure) break;
    if (common.PTYPES.indexOf(key) > -1) {
      var value = this.structure[key].call(this);
      if (value !== undefined) {
        return this.parse.apply(this, [structure[key][value.toString()]]);
      }
    }
  }

  if (typeof structure === 'string') {
    structure = Array.prototype.slice.call(arguments);
  } 

}

exports.Serializer = Serializer;
