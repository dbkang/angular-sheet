'use strict';

(function() {
  angular.module('sheetDemo').directive('sheetSheet', ['$sheet', '$window', '$timeout', sheetDirective]);
  function sheetDirective($sheet, $window, $timeout) {
    return {
      scope: {
        sheetData: "=",
        sheetOptions: "="
      },
      templateUrl: '/views/sheetDirective.html',
      link: function (scope, element, attrs) {
        var columnCount = 0;
        var rowCount = 0;
        scope.current = {};
        if (scope.sheetOptions && scope.sheetOptions.columnCount)
          columnCount = scope.sheetOptions.columnCount;
        else if (scope.sheetData && scope.sheetData[0] && scope.sheetData[0].length)
          columnCount = scope.sheetData[0].length;

        scope.sheetModel = scope.sheetData.map(function (row) {
          return row.map(function (cell) {
            return { formula: cell };
          });
        });

        if (scope.sheetOptions && scope.sheetOption.rowCount)
          rowCount = scope.sheetOptions.rowCount;
        else if (scope.sheetData && scope.sheetData.length)
          rowCount = scope.sheetData.length;

        scope.columns = $sheet.generateHeaders(columnCount);
        scope.columnWidths = scope.columns.map(function () { return 50; });
        scope.rowHeights = scope.sheetModel.map(function () { return 25; });

        scope.selectCell = function(row, col) {
          console.log("select!");
          scope.editMode = false;
          angular.element(element[0].querySelector(".selected")).removeClass('selected');
          scope.current.row = row;
          scope.current.column = col;
          var tbody = element.find("tbody");
          var trs = tbody.find("tr");
          var tr = angular.element(trs[row]);
          var tds = tr.find("td");
          var border = $window.parseFloat($window.getComputedStyle(tds[0])["border-left-width"]) / 2;
          var td = angular.element(tds[col + 1]);
          var cursor = angular.element(element[0].querySelector(".sheet-cursor"));
          var style = $window.getComputedStyle(td[0]);
          var top = $window.parseFloat($window.getComputedStyle(trs[0]).height) + border;
          var left = $window.parseFloat($window.getComputedStyle(tds[0]).width) + border;
          for (var i = 0; i < row; i++) {
            top += $window.parseFloat($window.getComputedStyle(trs[i]).height);
          }
          for (var i = 0; i < col; i++) {
            left += $window.parseFloat($window.getComputedStyle(tds[i+1]).width);
          }

          cursor[0].style.top = top + "px";
          cursor[0].style.left = left + "px";
          cursor[0].style.height = style.height;
          cursor[0].style.width = style.width;
          td.addClass('selected');
        };

        scope.editCell = function(row, col) {
          console.log("edit!");
          scope.selectCell(row, col);
          scope.editMode = true;
          $timeout(function () {
            element[0].querySelector(".sheet-cursor").querySelector("input").focus();
          });
        };
        console.log('sheetSheet Directive, here I stand!');
      }
    };
  }
})();
