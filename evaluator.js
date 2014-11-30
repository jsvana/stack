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
var eval = function(root) {
  var env = {
    bank: new Wordbank(),
    stack: new EvalStack()
  };

  if (root.type !== 'root') {
    throw new EvalException('Root-level element not present');
  }

  evalLambda(root, env);

  console.log('\nend program\n');

  env.stack.log();
  env.bank.log();
};

var evalLambda = function(lambda, env) {
  var entries = lambda.value;

  entries.forEach(function(entry) {
    switch (entry.type) {
    case 'word':
      var word = env.bank.getWord(entry.value);

      if (!word) {
	throw new EvalException('Unknown word "' + entry.value + '"');
      }

      switch (word.type) {
      case 'func':
	word.value(env);
	break;
      case 'lambda':
	evalLambda(word, env);
	break;
      default:
	env.stack.push(word);
      }
      break;
    default:
      env.stack.push(entry);
      break;
    }
  });
};

module.exports = {
  eval: eval
};
