'use strict';

(function() {
  angular.module('sheetDemo').factory('$formulaParser', ['$formulaLexer', parser]);
  function parser(lexer) {
    'use strict';

    // parser combinator for many
    function many(parser) {
      return function(tokens, index) {
        if (index >= tokens.length) return false;
        var item;
        var result = [];
        while (item = parser(tokens, index)) {
          index = item.index;
          result.push(item.tree);
        }
        return { tree: result, index: index };
      };
    }

    // tuple2
    function tuple2(parser1, parser2, combinator) {
      return function (tokens, index) {
        var result1 = parser1(tokens, index);
        if (!result1) return false;
        if (result1.index >= tokens.length) return false;
        var result2 = parser2(tokens, result1.index);
        if (!result2) return false;
        return {
          tree: combinator(result1.tree, result2.tree),
          index: result2.index
        }
      }
    }

    // parser that takes no tokens and always succeeds with a given result
    function empty(value) {
      return function (tokens, index) {
        if (index >= tokens.length) return false;
        return {
          tree: value,
          index: index
        };
      };
    }

    function tupleMany(parsers) {
      var tuple2Curried = function (parser1, parser2) {
        return tuple2(parser1, parser2, function (a, b) {
          return a.concat([b]);
        });
      };
      return parsers.reduce(tuple2Curried, empty([]));
    }

    function or(parsers) {
      return function (tokens, index) {
        var result = false;
        for(var i = 0; i < parsers.length && !result; i++) {
          result = parsers[i](tokens, index);
        }
        return result;
      }
    }

    function elem(token) {
      return function (tokens, index) {
        if (token === tokens[index])
          return {
            tree: token,
            index: index + 1
          };
        else
          return false;
      }
    }

    function tokenType(type) {
      return function (tokens, index) {
        if (tokens[index] && tokens[index].type === type)
          return {
            tree: tokens[index],
            index: index + 1
          };
        else
          return false;
      }
    }

    function number(tokens, index) {
      if (typeof tokens[index] === 'number') return { tree: tokens[index], index: index + 1 };
      else return false;
    }

    function string(tokens, index) {
      if (typeof tokens[index] === 'string') return { tree: tokens[index], index: index + 1 };
      else return false;
    }

    function compose(parser, f) {
      return function(tokens, index) {
        var result = parser(tokens, index);
        if (result) return { tree: f(result.tree), index: result.index };
        else return false;
      };
    }

    // repeatedly apply parser while tossing out separators in between
    function repsep(parser, sep) {
      var concat2 = function (arr, item) { return arr.concat([item]); }
      return or([tuple2(many(tuple2(parser, sep, angular.identity)), parser, concat2), empty([])]);
    }

    function stripFirstLast(k) {
      k.pop();
      k.shift();
      return k;
    }

    function insideParens(parser) {
      var parsers = [lparen, parser, rparen];
      return compose(tupleMany(parsers), function (k) { return k[1]; });  
    }

    function tupleManyParens(parsers) {
      parsers = parsers.concat(rparen);
      parsers.unshift(lparen);
      return compose(tupleMany(parsers), stripFirstLast);
    }

    var lparen = elem(lexer.tokens.LPAREN);
    var rparen = elem(lexer.tokens.RPAREN);
    var comma = elem(lexer.tokens.COMMA);
    var name = tokenType("name");

    // essentially forward declarations since Javascript is eager
    var expressionRec = function(tokens, index) { return expression(tokens, index); };
      
    var functionCall = tupleMany([name, insideParens(repsep(expressionRec, comma))]);

    var expression = or([number, string, functionCall]);

    function parseFormula(str) {
      var tokens = lexer.tokenize(str, lexer.matchers.all);
      var expressionParsed = expression(tokens, 0);
      return expressionParsed.tree;
    }

    var exports = {};
    exports.parseFormula = parseFormula;
    exports.string = string;
    exports.repsep = repsep;
    exports.comma = comma;
    exports.lexer = lexer;
    return exports;
  }
})();
