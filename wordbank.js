var Entry = require('./entry').Entry;

/* lol, walrus */
var Wordbank = function() {
  var words = {};

  this.addWord = function(word, type, value) {
    words[word] = new Entry(type, value);
  };

  this.addWord('=', 'func', function(env) {
    var a = env.stack.pop();
    var b = env.stack.pop();

    var res = new Entry('bool', a.value === b.value);

    env.stack.push(res);
  });

  this.addWord('+', 'func', function(env) {
    var a = env.stack.pop();
    var b = env.stack.pop();

    var res = new Entry('number', a.value + b.value);

    env.stack.push(res);
  });

  this.addWord('disp', 'func', function(env) {
    var a = env.stack.pop();
    console.log('[display] ' + a.value);
  });

  this.addWord('dup', 'func', function(env) {
    env.stack.push(env.stack.peek());
  });

  this.addWord('drop', 'func', function(env) {
    env.stack.pop();
  });

  this.addWord('def', 'func', function(env) {
    var name = env.stack.pop();
    var body = env.stack.pop();
    env.bank.addWord(name.value, body.type, body.value);
  });

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
      console.log('[wordbank-log] ' + word.logString());
    }
    console.log('[wordbank-log] >>>>');
  };
};

module.exports = {
  Wordbank: Wordbank
};
