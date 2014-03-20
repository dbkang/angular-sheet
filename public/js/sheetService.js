'use strict';

(function() {
  angular.module('sheetDemo').factory('$sheet', [sheetFactory]);
  function sheetFactory() {
    function SheetService() {

    };

    function indexToColumn(col) {
      var result = "";
      col = col + 1;
      while (col > 0) {
        var q = Math.floor((col - 1) / 26);
        var r = col - (26 * q);
        var newChar = r + 'A'.charCodeAt(0) - 1;
        result = String.fromCharCode(newChar) + result;
        col = q;
      }
      return result;
    }

    function generateHeaders(count) {
      var result = [];
      for (var i = 0; i < count; i++) {
        result.push(indexToColumn(i));
      }
      return result;
    }

    SheetService.prototype.generateHeaders = generateHeaders;

    return new SheetService();
  }
})();
