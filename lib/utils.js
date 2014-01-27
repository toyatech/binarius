exports.inherit = function(obj) {
  obj = Object.create(obj);
  for (var i = 1; i< arguments.length; ++i) {
    var source = arguments[i];
    for (var prop in source) {
      if (source[prop] !== undefined) {
        obj[prop] = source[prop];
      }
    }
  }
  return obj;
}

exports.find = function(obj, path){
  for (var i=0, len=path.length; i<len; i++){
    obj = obj[path[i]];
  };
  return obj;
};

exports.toInt = function(val) {
  return val instanceof Function ? val.call(this) : val;
}
