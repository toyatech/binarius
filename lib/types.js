exports.PRIMATIVE_TYPES = {
  'UInt8': 1,
  'UInt16LE': 2,
  'UInt16BE': 2,
  'UInt32LE': 4,
  'UInt32BE': 4,
  'Int8': 1,
  'Int16LE': 2,
  'Int16BE': 2,
  'Int32LE': 4,
  'Int32BE': 4,
  'FloatLE': 4,
  'FloatBE': 4,
  'DoubleLE': 8,
  'DoubleBE': 8
};

var BIT_TYPES = {};

for (var i = 1; i <= 32; i++) {
  BIT_TYPES['Bit' + i] = i;
}

exports.BIT_TYPES = BIT_TYPES;

exports.SPECIAL_TYPES = {
  'String': null,
  'Array': null,
  'Seek': null,
  'Skip': null,
  'Tell': null,
  'Bit': null
};
