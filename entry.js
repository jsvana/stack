var Entry = function(type, value) {
  this.type = type;
  this.value = value;

  this.logString = function() {
    switch (this.type) {
    case 'root':
    case 'lambda':
      var values = this.value.map(function(e) {
	return e.logString();
      }).join(', ');

      return '(lambda) [ ' + values + ' ]';
    default:
      return '(' + this.type + ') ' + this.value;
      break;
    }
  };
};

module.exports = {
  Entry: Entry
};
