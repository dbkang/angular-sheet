'use strict';

(function() {
  angular.module('sheetDemo').directive('sheetSheet', ['$sheet', sheetDirective]);
  function sheetDirective($sheet) {
    var current = {};
    return {
      scope: {
        sheetData: "=",
        sheetOptions: "="
      },
      templateUrl: '/views/sheetDirective.html',
      link: function (scope, element, attrs) {
        var columnCount = 0;
        var rowCount = 0;
        if (scope.sheetOptions && scope.sheetOptions.columnCount)
          columnCount = scope.sheetOptions.columnCount;
        else if (scope.sheetData && scope.sheetData[0] && scope.sheetData[0].length)
          columnCount = scope.sheetData[0].length;

        if (scope.sheetOptions && scope.sheetOption.rowCount)
          rowCount = scope.sheetOptions.rowCount;
        else if (scope.sheetData && scope.sheetData.length)
          rowCount = scope.sheetData.length;

        scope.columns = $sheet.generateHeaders(columnCount);
        scope.selectCell = function (row, col) {
          angular.element(element[0].querySelector(".selected")).removeClass('selected');
          current.row = row;
          current.column = col;
          angular.element(angular.element(element.find("tr")[row + 1]).find("td")[col + 1])
            .addClass('selected');
        };
        console.log('sheetSheet Directive, here I stand!');
      }
    };
  }
})();
