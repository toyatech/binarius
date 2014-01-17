var Stream = require('stream'),
  binarius = require('../binarius');

var insteonMessages = [
  [0x02,0x62,0x01,0x02,0x03,0x00,0x0F,0x00], // send standard direct
  [0x02,0x62,0xAA,0xAA,0xAA,0x83,0x0F,0x00], // send standard broadcast
  [0x02,0x62,0x01,0x02,0x03,0x24,0x0F,0x00], // send standard ACK of direct
  [0x02,0x62,0xFF,0xFF,0xFF,0xA7,0x0F,0x00], // send standard NAK of direct
  [0x02,0x62,0x01,0x02,0x03,0xC8,0x0F,0x00], // send ALL-Link broadcast
  [0x02,0x62,0x01,0x02,0x03,0x4B,0x0F,0x00], // send ALL-Link cleanup
  [0x02,0x62,0x01,0x02,0x03,0x6C,0x0F,0x00], // send ACK of ALL-LINK cleanup
  [0x02,0x62,0x01,0x02,0x03,0xEF,0x0F,0x00]
];

insteonMessages.forEach(function(message) {
  var insteonMessage = new Buffer(message);
  var insteonParser = new binarius.Parser(
    insteonMessage, { 
      command: { 
        primary: 'uint8', 
        secondary: 'uint8' 
      }, 
      messageFlags: { 
        messageType: 3, 
        extended: 1,
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

});
