var assert = require('assert')
  , Encoder = require('../lib/encoder');

var PRIMATIVE_TYPES = require('../lib/types').PRIMATIVE_TYPES;

describe('Encoder', function() {
  var encoder = new Encoder();
  Object.keys(PRIMATIVE_TYPES)
    .forEach(function(type) {
      describe('#prototype.' + type.toLowerCase(), function() {
        it('should be an instance of Function', function() {
          assert.equal(true, 
            encoder[type.toLowerCase()] instanceof Function);
        });
      });
    });
});
        
