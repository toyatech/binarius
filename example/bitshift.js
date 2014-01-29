var types = require('../lib/types');

String.prototype.lpad = function(padString, length) {
	var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

var BIT_TYPES = types.BIT_TYPES;

Object.keys(BIT_TYPES)
  .forEach(function(type) {
    var len = Math.ceil(BIT_TYPES[type] / 8);
    len = len > 2 ? 32 : len * 8;
    var val = BIT_TYPES[type] >> len - 0 - BIT_TYPES[type] & (1 << BIT_TYPES[type]) - 1;
    console.log('len: ' + len + ' val: ' + val + ', ' + val.toString(2));
  });

Object.keys(BIT_TYPES)
  .forEach(function(type) {
    var len = Math.ceil(BIT_TYPES[type] / 8);
    len = len > 2 ? 32 : len * 8;
    var buf = new Buffer(len/8);
    var end = len > 8 ? 'BE' : '';
    buf['writeUInt'+len+end](BIT_TYPES[type], 0);
    var val = buf['readUInt'+len+end](0);
    console.log('len: ' + len + ' val: ' + val + ' : ' + val.toString(2).lpad("0", len));
  });
for (var i = 0; i <= 4294967295;i+=16384) {
  var len = Math.ceil(i/8)
  len = len > 2 ? 32 : len * 8;
  len = len == 0 ? 8 : len;
  var buf = new Buffer(len/8);
  var end = len > 8 ? 'BE' : '';
  buf['writeUInt'+len+end](i, 0);
  var val = buf['readUInt'+len+end](0);
  console.log('val: ' + val.toString().lpad(" ",10) + ' : ' + val.toString(2).lpad("0", len));
}
