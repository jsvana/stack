var Wordbank = require('./wordbank').Wordbank;
var EvalStack = require('./eval_stack').EvalStack;

// I'm not super sold on exceptions, but we'll see
var EvalException = function(message, data) {
  this.message = message;
  this.data = {};
  if (data) {
    this.data = data;
  }
};

/*
 * Takes tokens from the tokenizer and evaluates the program
 */
var eval = function(tokens) {
  var env = {
    bank: new Wordbank(),
    stack: new EvalStack()
  };

  tokens.forEach(function(token) {
    switch (token.type) {
    case 'word':
      if (!env.bank.evalWord(token.value, env)) {
	throw new EvalException('Unknown word "' + token.value + '"');
      }
      break;
    default:
      env.stack.push(token);
      break;
    }
  });

  console.log('\nend program\n');

  env.stack.log();
  env.bank.log();
};

module.exports = {
  eval: eval
};
