var assert = require('assert')
  , Encoder = require('../lib/encoder');

var PRIMATIVE_TYPES = require('../lib/types').PRIMATIVE_TYPES;

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
  Object.keys(PRIMATIVE_TYPES)
    .forEach(function(type) {
      var len = PRIMATIVE_TYPES[type];
      var val = new Buffer(len);
      for (var i = 0;i < len;i++) {
        val[i] = i;
      }
      var obj = {data: val['read' + type](0)};
      console.log(obj);
      describe('#encode an object with ' + type + ' type', function() {
        it('should return an object with data key equal to ' + val, function() {
          encoder = new Encoder({data: type.toLowerCase()});
          var buf = encoder.encode(obj, 'data');
          assert.equal(val, buf);
        });
      });
    });
});
        
