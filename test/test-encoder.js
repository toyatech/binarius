var assert = require('assert')
  , types = require('../lib/types')
  , Encoder = require('../lib/encoder');

var PRIMATIVE_TYPES = types.PRIMATIVE_TYPES;
var BIT_TYPES = types.BIT_TYPES;

describe('Encoder', function() {
  var encoder = new Encoder();
  Object.keys(PRIMATIVE_TYPES)
    .forEach(function(type) {
      describe('#_struct.' + type.toLowerCase() + '()', function() {
        it('should be an instance of Function', function() {
          assert.equal(true, 
            encoder._struct[type.toLowerCase()] instanceof Function);
        });
      });
    });
  Object.keys(BIT_TYPES)
    .forEach(function(type) {
      describe('#_struct.' + type.toLowerCase() + '()', function() {
        it('should be an instance of Function', function() {
          assert.equal(true,
            encoder._struct[type.toLowerCase()] instanceof Function);
        });
      });
    });
  Object.keys(PRIMATIVE_TYPES)
    .forEach(function(type) {
      var len = PRIMATIVE_TYPES[type];
      var val = new Buffer(len);
      for (var i = 0;i < len;i++) {
        val[i] = i;
      }
      var obj = {data: val['read' + type](0)};
      describe('#encode an object with ' + type + ' type', function() {
        it('should return an object with data key equal to ' 
          + val['read' + type](0), 
          function() {
            encoder = new Encoder({data: type.toLowerCase()});
            var buf = encoder.encode(obj, 'data');
            assert.equal(val['read' + type](0), buf['read' + type](0));
          }
        );
      });
    });
  Object.keys(BIT_TYPES)
    .forEach(function(type) {
      describe('#encode() a ' + type + ' type', function() {
        var buf = new Buffer([BIT_TYPES[type]]);
        var val = buf.readUInt8(0) >> (8 - 0 - BIT_TYPES[type]) & ((1 << BIT_TYPES[type]) - 1);
        var obj = {data:val};
        var struct = {data: 'bit'+BIT_TYPES[type]};
        it('should return a value equal to ' + val, function() {
          encoder = new Encoder(struct);
          var ret = encoder.encode(obj, 'data');
          assert.equal(val, ret.readUInt8(0) >> (8 - 0 - BIT_TYPES[type]) & ((1 << BIT_TYPES[type]) - 1));
        });
      });
    });
});
        
