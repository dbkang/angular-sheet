'use strict';

(function() {
  angular.module('sheetDemo').factory('$formulaLexer', [lexer]);
  function lexer() {
    var opArray = [
      '/', '+', '=', '-', '&', '*'
    ];

    var ops = {};

    opArray.forEach(function (k, i) {
      ops[k] = { type: 'operator', value: k };
    });

    var keywords = {};

    var LPAREN = { type: 'token', value: '(' };
    var RPAREN = { type: 'token', value: ')' };


    function regexMatcher(regex, str, index) {
      var rest = str.slice(index);
      var matches = rest.match(regex);
      if (!matches) return false;
      else {
        var match = matches[0];
        if (!match) return false;
        else return { tokens: [match], index: index + match.length };
      }
    }

    function numberMatcher(str, index) {
      var result = regexMatcher(/^((\d+(\.\d*)?)|(\.\d+))/, str, index);
      return result && { tokens: [parseFloat(result.tokens[0])], index: result.index };
    }

    // matchers consume a stream and return matched tokens and new index.  returns false if not applicable
    function spaceMatcher(str, index) {
      for (var newIndex = index;
           newIndex < str.length && str.charAt(newIndex).search(/^\s/) != -1;
           newIndex++);
      if (newIndex == index) return false; else return { tokens: [], index: newIndex };  
    }

    function leftParenMatcher(str, index) {
      if (str.charAt(index) != '(') return false; else return { tokens: [LPAREN], index: index + 1 };  
    }

    function rightParenMatcher(str, index) {
      if (str.charAt(index) != ')') return false; else return { tokens: [RPAREN], index: index + 1 };  
    }

    function numMatcher(str, index) {
      var digits = "";
      for (var newIndex = index;
           newIndex < str.length && str.charAt(newIndex).search(/^\d/) != -1;
           newIndex++)
        digits += str.charAt(newIndex);
      if (newIndex == index) return false; else return { tokens: [parseFloat(digits)], index: newIndex };  
    }

    function keywordMatcher(str, index) {
      var keyword = "";
      for (var newIndex = index;
           newIndex < str.length && str.charAt(newIndex).search(/^[A-Za-z_]/) != -1;
           newIndex++)
        keyword += str.charAt(newIndex);
      if (newIndex == index || !keywords[keyword]) return false;
      else return { tokens: [keywords[keyword]], index: newIndex };
    }

    function operatorMatcher(str, index) {
      var found = opArray.filter(function (x) { return x == str.charAt(index); });
      if (found.length == 0) return false;
      else return { tokens: [ops[found[0]]], index: index + 1 };
    }

    function stringMatcher(str, index) {
      var string = "";
      if (str.charAt(index) != '"') return false;
      else {
        for (var newIndex = index + 1; newIndex < str.length && str.charAt(newIndex) != '"'; newIndex++)
          string += str.charAt(newIndex);
      }
      if (newIndex == str.length) return false;
      else return { tokens: [string], index: newIndex + 1 };
    }


    // stream: stream to tokenize - string for now
    // matchers: an array of matchers to try
    // returns false if failed, an array of tokens if succeeded
    function tokenize(stream, matchers) {
      var index = 0;
      var matchedTokens = [];
      var currentMatch;
      while (index < stream.length) {
        currentMatch = false;
        for (var i = 0; i < matchers.length; i++) {
          currentMatch = matchers[i](stream, index);
          if (currentMatch) break;
        }
        if (currentMatch) {
          Array.prototype.push.apply(matchedTokens, currentMatch.tokens);
          index = currentMatch.index;
        }
        else {
          return false;
        }
      }
      return matchedTokens;
    }

    var exports = {};
    exports.matchers = {
      spaceMatcher: spaceMatcher,
      leftParenMatcher: leftParenMatcher,
      rightParenMatcher: rightParenMatcher,
      numberMatcher: numberMatcher,
      operatorMatcher: operatorMatcher,
      stringMatcher: stringMatcher,
      all: [
        spaceMatcher,
        leftParenMatcher,
        rightParenMatcher,
        numberMatcher,
        operatorMatcher,
        stringMatcher
      ]
    };
    exports.operators = ops;
    exports.tokens = {
      LPAREN: LPAREN,
      RPAREN: RPAREN
    };
    exports.tokenize = tokenize;
    return exports;
  }
}
)();
