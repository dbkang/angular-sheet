'use strict';

(function() {
  angular.module('sheetDemo').factory('$sheet', [sheetFactory]);
  function sheetFactory() {
    function wrapFormula(f) {
      if (f instanceof Object)
        return angular.copy(f);
      else
        return { formula: f };
    }
    
    function SheetModel(data, format) {
      if (!format) { // infer format if not supplied
        if (data instanceof Array && (data.length == 0))
          format = false;
        else if (data instanceof Array && data[0] instanceof Array)
          format = 'aa';
        else if (data instanceof Array && data[0] instanceof Object)
          format == 'ao';
      }

      if (format == 'aa')
        this.data = data.map(function (row) { return row.map(wrapFormula); });
      else if (format == 'ao') {
        this.data = [];
        data.forEach(function (cell) {
          var row = cell.row;
          var column = cell.column;
          if (!this.data[row]) this.data[row] = [];
          this.data[row][column] = angular.copy(cell);
        });
      }
    };


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

    function makeSheetModel(data, format) {
      return new SheetModel(data, format);
    }
    
    SheetService.prototype.generateHeaders = generateHeaders;
    SheetService.prototype.makeSheetModel = makeSheetModel;

    return new SheetService();
  }
})();
