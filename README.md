binarius
========

A binary parser and serializer for Node.js.

**Binarius is a work in progress... Please stay tuned for the awesomeness.**

Parser
------

``` js
// INSTEON Switch to full on
var buf = new Buffer([ 0x02, 0x50, 0x01, 0x01, 0x01, 0xAA, 0xAA, 0xAA, 0x0F, 0x12, 0x00 ]);

var parser = require('binarius').Parser;

console.dir(parser.parse(buf));
```

Serializer
----------

``` js
// INSTEON Switch to full on
var obj = { 
  startOfIMCommand: 0x02, 
  type: 0x50, 
  fromAddress: { 
    high: 0x01, 
    middle: 0x01, 
    low: 0x01 
  }, 
  toAddress: { 
    high: 0xAA, 
    middle: 0xAA, 
    low: 0xAA 
  }, 
  messageFlags: { 
    messageType: 0, 
    extended: 0, 
    hopsLeft: 3, 
    maxHops: 3 
  },
  command: {
    primary: 0x12,
    secondary: 0x00
  }
}; 

var serializer = require('binarius').Serializer;

console.dir(serializer.serialize(obj));
```
