var assert = require('assert')
  , types = require('../lib/types')
  , Decoder = require('../lib/decoder');

var PRIMATIVE_TYPES = types.PRIMATIVE_TYPES;
var BIT_TYPES = types.BIT_TYPES;

function random(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

describe('Decoder', function() {
  describe('._struct', function() {
    var decoder = new Decoder({data: 'uint8'});
    Object.keys(PRIMATIVE_TYPES)
      .forEach(function(type) {
        describe('.' + type.toLowerCase() + '()', function() {
          it('should be an instance of Function', function() {
            assert.equal(true, 
              decoder._struct[type.toLowerCase()] instanceof Function);
          });
        });
      });
    Object.keys(BIT_TYPES)
      .forEach(function(type) {
        describe('.' + type.toLowerCase() + '()', function() {
          it('should be an instance of Funcction', function() {
            assert.equal(true,
              decoder._struct[type.toLowerCase()] instanceof Function);
          });
        });
      });
  });
  describe('.decode()', function() {
    Object.keys(PRIMATIVE_TYPES)
      .forEach(function(type) {
        var len = PRIMATIVE_TYPES[type];
        var buf = new Buffer(len);
        for (var i = 0;i < len;i++) {
          buf[i] = i;
        }
        var val = buf['read' + type](0);
        describe('a ' + type.toLowerCase() + ' type', function() {
          it('should return a value equal to ' + val, function() {
            decoder = new Decoder({data: type.toLowerCase()});
            var obj = decoder.decode(buf, 'data');
            assert.equal(val, obj);
          });
        });
      });
    Object.keys(BIT_TYPES)
      .forEach(function(type) {
        describe('a ' + type.toLowerCase() + ' type', function() {
          var siz = Math.ceil(BIT_TYPES[type] / 8);
          siz = siz > 2 ? 4 : siz;
          var len = siz * 8;
          var buf = new Buffer(siz);
          var end = len > 8 ? 'BE' : '';
          var val = random(0,(Math.pow(2,len))-1);
          buf['writeUInt' + len + end](val, 0);
          it('should equal to ' + val, function() {
            assert.equal(0,0);
            decoder = new Decoder({data: type.toLowerCase()});
          });
        });
      });
    Object.keys(BIT_TYPES)
      .forEach(function(type) {
        describe('a series of ' + type.toLowerCase() + ' types', function() {
          var bit = BIT_TYPES[type];
          var siz = Math.ceil(bit / 8);
          siz = siz > 2 ? 4 : siz;
          var len = siz * 8;
          var div = Math.floor(len/bit);
          var rem = len % bit;
          var buf = new Buffer(siz);
          var end = len > 8 ? 'BE' : '';
          var val = random(0,(Math.pow(2,len))-1);
          var struct = {data:{}};
          var i = 1;
          for (i;i <= div;i++) {
            struct.data['data'+i] = type.toLowerCase();
          }
          if (rem > 0) {
            struct.data['data'+i++] = 'bit' + rem;
          }
          buf['writeUInt' + len + end](val, 0);
          it('should equal to ' + val, function() {
            decoder = new Decoder(struct);
            var obj = decoder.decode(buf, 'data');
            assert.equal(0,0);     
          });
        });
      });
    describe('complex structure', function() {
      it('should return a complex object', function() {
        decoder = new Decoder({data: { 
          one: 'uint8',
          two: 'uint8',
          three: 'uint8',
          four: {
            one: 'uint8',
            two: 'uint8'
          },
          five: 'uint8',
          six: {
            one: 'uint8',
            two: 'uint8'
          }
        }});
        var buf = new Buffer([0x01,0x02,0x03,0x02,0x02,0x05,0x03,0x03]);
        var obj = decoder.decode(buf, 'data');
        assert.equal(1, obj.one);
        assert.equal(2, obj.two);
        assert.equal(3, obj.three);
        assert.equal(2, obj.four.one);
        assert.equal(2, obj.four.two);
        assert.equal(5, obj.five);
        assert.equal(3, obj.six.one);
        assert.equal(3, obj.six.two);
      });
    });
  });
});
        
