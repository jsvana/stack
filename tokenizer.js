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
    regex: /^\[$/,
  },
  end_lambda: {
    regex: /^\]$/,
  },

  number: {
    regex: /^-?\d+$/,
    transform: function(val) {
      return parseInt(val);
    }
  },

  bool: {
    regex: /^(true|false)$/,
    transform: function(val) {
      return val === 'true';
    }
  },

  string: {
    regex: /^"[^\s]+"$/,
    transform: function(val) {
      return val.replace(/"/g, '');
    }
  },

  word: {
    regex: /^[^\s]+$/
  }
};

var tokenize = function(input) {
  var words = input.split(/\s+/);

  // Stack of entries
  var entries = [];
  entries.push(new Entry('root', []));

  words.forEach(function(word) {
    var token = new Entry('none', '');

    if (word.match(TOKENS['begin_lambda'].regex)) {
      entries.push(new Entry('lambda', []));
      return;
    }

    if (word.match(TOKENS['end_lambda'].regex)) {
      var entry = entries.pop();
      entries[entries.length - 1].value.push(entry);

      return;
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
      entries[entries.length - 1].value.push(token);
    }
  });

  return entries.pop();
};

module.exports = {
  tokenize: tokenize
};
