var Decoder = require('./decoder')
  , Encoder = require('./encoder');

function Structure(options) {
  options = options || {};
}

Structure.prototype.createDecoder = function() {
  //return new Decoder(this);
}

Structure.prototype.createEncoder = function() {
  //return new Encoder(this);
}
