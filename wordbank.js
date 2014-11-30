var Entry = require('./entry').Entry;

/* lol, walrus */
var Wordbank = function() {
  var words = {};

  this.addWord = function(word, type, value) {
    words[word] = new Entry(type, value);
  };

  var bootstrap = function(bank) {
    bank.addWord('=', 'func', function(env) {
      var a = env.stack.pop();
      var b = env.stack.pop();

      var res = new Entry('bool', a.value === b.value);

      env.stack.push(res);
    });

    bank.addWord('+', 'func', function(env) {
      var a = env.stack.pop();
      var b = env.stack.pop();

      var res = new Entry('number', a.value + b.value);

      env.stack.push(res);
    });

    bank.addWord('disp', 'func', function(env) {
      var a = env.stack.pop();
      console.log('[display] ' + a.value);
    });

    bank.addWord('dup', 'func', function(env) {
      env.stack.push(env.stack.peek());
    });

    bank.addWord('drop', 'func', function(env) {
      env.stack.pop();
    });

    bank.addWord('def', 'func', function(env) {
      var name = env.stack.pop();
      var body = env.stack.pop();
      env.bank.addWord(name.value, body.type, body.value);
    });

    bank.addWord('run', 'func', function(env) {
      var lambda = env.stack.pop();
      env.evalLambda(lambda, env);
    });
  };

  // Bootstrap the wordbank
  bootstrap(this);

  this.getWord = function(key) {
    return words[key];
  };

  /* Attempts to evaluate a word
   * Returns boolean representing whether or not word exists
   */
  this.evalWord = function(word, env) {
    if (words[word]) {
      if (words[word].type === 'func') {
	words[word].value(env);
      } else {
	env.stack.push(words[word]);
      }

      return true;
    }

    return false;
  };

  this.log = function() {
    console.log('[wordbank-log] <<<<');
    for (var key in words) {
      var word = words[key];
      console.log('[wordbank-log] ' + key + ': ' + word.logString());
    }
    console.log('[wordbank-log] >>>>');
  };
};

module.exports = {
  Wordbank: Wordbank
};
