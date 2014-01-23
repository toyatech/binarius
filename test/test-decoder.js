var assert = require('assert')
  , Decoder = require('../lib/decoder');

var PRIMATIVE_TYPES = require('../lib/types').PRIMATIVE_TYPES;

describe('Decoder', function() {
  var decoder = new Decoder({data: 'uint8'});
  Object.keys(PRIMATIVE_TYPES)
    .forEach(function(type) {
      describe('#_struct.' + type.toLowerCase() + '()', function() {
        it('should be an instance of Function', function() {
          assert.equal(true, 
            decoder._struct[type.toLowerCase()] instanceof Function);
        });
      });
    });
  Object.keys(PRIMATIVE_TYPES)
    .forEach(function(type) {
      var len = PRIMATIVE_TYPES[type];
      var buf = new Buffer(len);
      for (var i = 0;i < len;i++) {
        buf[i] = i;
      }
      var val = buf['read' + type](0);
      describe('#decode() a ' + type + ' type', function() {
        it('should return an object with data key equal to ' + val, function() {
          decoder = new Decoder({data: type.toLowerCase()});
          var obj = decoder.decode(buf, 'data');
          assert.equal(val, obj);
        });
      });
    }); 
});
        
