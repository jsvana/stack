#!/usr/bin/env node

var fs = require('fs');
var tokenize = require('./tokenizer').tokenize;
var eval = require('./evaluator').eval;

if (process.argv.length !== 3) {
  console.log('Usage: ./main.js <file.stk>');
  process.exit(1);
}

/* Open the file */
var stringData = fs.readFileSync(process.argv[2], 'utf-8');

/* Tokenize input */
var tokens = tokenize(stringData);

/* Run the code */
eval(tokens);
