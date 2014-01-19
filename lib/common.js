var PRIMATIVE_TYPES = {
  'UInt8'    : 1,
  'UInt16LE' : 2,
  'UInt16BE' : 2,
  'UInt32LE' : 4,
  'UInt32BE' : 4,
  'Int8'     : 1,
  'Int16LE'  : 2,
  'Int16BE'  : 2,
  'Int32LE'  : 4,
  'Int32BE'  : 4,
  'FloatLE'  : 4,
  'FloatBe'  : 4,
  'DoubleLE' : 8,
  'DoubleBE' : 8
};

var SPECIAL_TYPES = {
  'Choice'   : null,
  'String'   : null,
  'Buffer'   : null,
  'Array'    : null,
  'Seek'     : null,
  'Skip'     : null,
  'Tell'     : null,
  'Bit'      : null
};

var TYPE_MAP = {};
Object.keys(PRIMATIVE_TYPES)
  .concat(Object.keys(SPECIAL_TYPES))
  .forEach(function(type) {
    TYPE_MAP[type.toLowerCase()] = type;
  });

exports.inherit = function(obj) {
  obj = Object.create(obj);
  for (var i = 1; i< arguments.length; ++i) {
    var source = arguments[i];
    for (var prop in source) {
      if (source[prop] !== undefined) {
        obj[prop] = source[prop];
      }
    }
  }
  return obj;
}

exports.toInt = function(val) {
  return val instanceof Function ? val.call(this) : val;
}

exports.PTYPES = ['uint8','uint16le','uint16be','uint32le','uint32be','int8','int16le','int16be','int32le','int32be','floatle','floatbe','doublele','doublebe'];

exports.PRIMATIVE_TYPES = PRIMATIVE_TYPES;
exports.SPECIAL_TYPES = SPECIAL_TYPES;
exports.TYPE_MAP = TYPE_MAP;
