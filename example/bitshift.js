var types = require('../lib/types');

var BIT_TYPES = types.BIT_TYPES;

Object.keys(BIT_TYPES)
  .forEach(function(type) {
    var len = Math.ceil(BIT_TYPES[type] / 8);
    len = len > 2 ? 32 : len * 8;
    var val = BIT_TYPES[type] >> len - 0 - BIT_TYPES[type] & (1 << BIT_TYPES[type]) - 1;
    console.log('len: ' + len + ' val: ' + val + ', ' + val.toString(2));
  });
