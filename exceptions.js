
var TokenizerException = function(message, data) {
  this.message = message;
  this.data = {};
  if (data) {
    this.data = data;
  }
};

var EvalException = function(message, data) {
  this.message = message;
  this.data = {};
  if (data) {
    this.data = data;
  }
};

module.exports = {
  TokenizerException: TokenizerException,
  EvalException: EvalException
};
