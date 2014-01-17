var Stream = require('stream'),
  binarius = require('../binarius');

var insteonMessage = new Buffer([0x02,0x62,0x01,0x02,0x03,0x1F,0x0F,0x00]);
console.log(insteonMessage);
var insteonParser = new binarius.Parser(
  insteonMessage, { command: { primary: 'uint8', secondary: 'uint8' }, messageFlags: { messageType: 3, extended: 1,
      hopsLeft: 2,
      maxHops: 2
    },
    address: {
      high: 'uint8',
      middle: 'uint8',
      low: 'uint8',
    },
    serialCommand: {
      type: 'uint8',
      address: 'address',
      messageFlags: 'messageFlags',
      command: 'command'
    },
    stx: 'uint8',
    error: {
      error: 'uint8'
    },
    data: function() {
      var stx = this.parse('stx');
      if (stx === 0x02) return this.parse('serialCommand');
      return this.parse('error');
    }
  }
);

console.log(insteonParser.parse('data'));

