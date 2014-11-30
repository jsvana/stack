var Entry = require('./entry').Entry;

var TokenizerException = function(message, data) {
  this.message = message;
  this.data = {};
  if (data) {
    this.data = data;
  }
};

var TOKENS = {
  begin_lambda: {
    regex: /\[/,
  },
  end_lambda: {
    regex: /\]/,
  },

  number: {
    regex: /-?[0-9]+/,
    transform: function(val) {
      return parseInt(val);
    }
  },

  bool: {
    regex: /(true|false)/,
    transform: function(val) {
      return val === 'true';
    }
  },

  string: {
    regex: /"[^\s]+"/,
    transform: function(val) {
      return val.replace(/"/g, '');
    }
  },

  word: {
    regex: /[^\s]+/
  }
};

var tokenize = function(input) {
  var words = input.split(/\s+/);
  var tokens = [];

  // Stuff for lambdas
  var state = 'normal';
  var lambdaTokens = [];

  words.forEach(function(word) {
    var token = new Entry('none', '');

    if (word.match(TOKENS['begin_lambda'].regex)) {
      if (state === 'normal') {
	state = 'lambda';
	return;
      } else {
	throw new TokenizerException('Bad state (nested lambdas not allowed)');
      }
    }

    if (word.match(TOKENS['end_lambda'].regex)) {
      if (state === 'lambda') {
	token.type = 'lambda';
	token.value = lambdaTokens;
	tokens.push(token);

	state = 'normal';

	lambdaTokens = [];
	return;
      } else {
	throw new TokenizerException('Bad state (nested lambdas not allowed)');
      }
    }

    for (var key in TOKENS) {
      if (word.match(TOKENS[key].regex)) {
	if (TOKENS[key].transform) {
	  token.value = TOKENS[key].transform(word);
	} else {
	  token.value = word;
	}
	token.type = key;
	break;
      }
    }

    if (token.type !== 'none') {
      if (state === 'normal') {
	tokens.push(token);
      } else {
	lambdaTokens.push(token);
      }
    }
  });

  return tokens;
};

module.exports = {
  tokenize: tokenize
};
