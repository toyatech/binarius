var assert = require('assert')
  , Decoder = require('../lib/decoder');

var PRIMATIVE_TYPES = require('../lib/types').PRIMATIVE_TYPES;

describe('Decoder', function() {
  var decoder = new Decoder();
  Object.keys(PRIMATIVE_TYPES)
    .forEach(function(type) {
      describe('#prototype.' + type.toLowerCase(), function() {
        it('should be an instance of Function', function() {
          assert.equal(true, 
            decoder[type.toLowerCase()] instanceof Function);
        });
      });
    });
});
        
