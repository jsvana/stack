var EvalStackException = function(message, data) {
  this.message = message;
  this.data = {};
  if (data) {
    this.data = data;
  }
};

var EvalStack = function() {
  var stack = [];

  this.empty = function() {
    return stack.length === 0;
  };

  this.pop = function() {
    if (this.empty()) {
      console.trace('Stack is empty');
      throw new EvalStackException('Stack is empty');
    }

    return stack.pop();
  };

  this.push = function(val) {
    stack.push(val);
  };

  this.peek = function(val) {
    if (this.empty()) {
      console.trace('Stack is empty');
      throw new EvalStackException('Stack is empty');
    }

    return stack[stack.length - 1];
  };

  this.log = function() {
    console.log('[stack-log] <<<<');
    for (var i = stack.length - 1; i >= 0; i--) {
      var entry = stack[i];
      console.log('[stack-log] ' + entry.logString());
    }
    console.log('[stack-log] >>>>');
  };
};

module.exports = {
  EvalStack: EvalStack
};
