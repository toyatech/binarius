var assert = require('assert')
  , types = require('../lib/types')
  , Decoder = require('../lib/decoder');

describe('Decoder', function() {
  var decoder = new Decoder({data: 'uint8'});
  Object.keys(types.PRIMATIVE_TYPES)
    .forEach(function(type) {
      describe('#_struct.' + type.toLowerCase() + '()', function() {
        it('should be an instance of Function', function() {
          assert.equal(true, 
            decoder._struct[type.toLowerCase()] instanceof Function);
        });
      });
    });
  Object.keys(types.PRIMATIVE_TYPES)
    .forEach(function(type) {
      var len = types.PRIMATIVE_TYPES[type];
      var buf = new Buffer(len);
      for (var i = 0;i < len;i++) {
        buf[i] = i;
      }
      var val = buf['read' + type](0);
      describe('#decode() a ' + type + ' type', function() {
        it('should return a value equal to ' + val, function() {
          decoder = new Decoder({data: type.toLowerCase()});
          var obj = decoder.decode(buf, 'data');
          assert.equal(val, obj);
        });
      });
    });
  Object.keys(types.BIT_TYPES)
    .forEach(function(type) {
      describe('#decode() a ' + type + ' type', function() {
        var buf = new Buffer([types.BIT_TYPES[type]]);
        var val = buf.readUInt8(0) >> (8 - 0 - types.BIT_TYPES[type]) & ((1 << types.BIT_TYPES[type]) - 1);
        var struct = {data: type.toLowerCase()};
        console.log('val: ' + val);
        console.log('struct: ' + struct);
        it('should return a value equal to ' + val, function() {
          decoder = new Decoder(struct);
          var obj = decoder.decode(buf, 'data');
          assert.equal(val, obj);
        });
      });
    });
  describe('#decode() complex structures', function() {
    it('should return a complex object', function() {
      decoder = new Decoder({data: { 
        one: 'uint8',
        two: 'uint8',
        three: 'uint8',
        four: {
          five: 'uint8',
          six: 'uint8'
        },
        seven: 'uint8',
        eight: {
          nine: 'uint8',
          zero: 'uint8'
        }
      }});
      var buf = new Buffer([0x01,0x02,0x03,0x05,0x06,0x07,0x09,0x00]);
      var obj = decoder.decode(buf, 'data');
      assert.equal(1, obj.one);
      assert.equal(2, obj.two);
      assert.equal(3, obj.three);
      assert.equal(5, obj.four.five);
      assert.equal(6, obj.four.six);
      assert.equal(7, obj.seven);
      assert.equal(9, obj.eight.nine);
      assert.equal(0, obj.eight.zero);
    });
  });
});
        
