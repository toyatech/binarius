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
  'String'   : null,
  'Buffer'   : null,
  'Array'    : null,
  'Seek'     : null,
  'Skip'     : null,
  'Choice'   : null,
  'Bit'      : null
};

var TYPE_MAP = {};
Object.keys(PRIMITIVE_TYPES)
  .concat(Object.keys(SPECIAL_TYPES))
  .forEach(function(type) {
    TYPE_MAP[type.toLowerCase()] = type;
  });

exports.inherits = function(obj) {
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

exports.toInt(val) {
  return val instanceof Function ? val.call(this) : val;
}

exports.PRIMATIVE_TYPES = PRIMATIVE_TYPES;
exports.SPECIAL_TYPES = SPECIAL_TYPES;
exports.TYPE_MAP = TYPE_MAP;
