var assert = require('assert')
  , Parser = require('../lib/parser.js').Parser
  , InsteonStructure = require('./insteon-tests').InsteonStructure
  , InsteonMessages = require('./insteon-tests').InsteonMessages;

describe('Parser', function() {
  var data = new Buffer(InsteonMessages[0]);
  var parser = new Parser(data, {structure: InsteonStructure});
  describe('#parse', function() {
    var insteonMessage = parser.parse('data');
    console.log(insteonMessage);
    it('should convert a buffer to an object', function() {
      assert.equal(0x62, insteonMessage.type);
      assert.equal(0x01, insteonMessage.address.high);
      assert.equal(0x02, insteonMessage.address.middle);
      assert.equal(0x03, insteonMessage.address.low);
      assert.equal(0, insteonMessage.messageFlags.messageType);
      assert.equal(0, insteonMessage.messageFlags.extended);
      assert.equal(0, insteonMessage.messageFlags.hopsLeft);
      assert.equal(0, insteonMessage.messageFlags.maxHops);
      assert.equal(0x0F, insteonMessage.command.primary);
      assert.equal(0x00, insteonMessage.command.secondary);
    });
  });
});
