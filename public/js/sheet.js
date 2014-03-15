'use strict';

(function() {
  angular.module('sheetDemo').directive('sheetSheet', [sheetDirective]);
  function sheetDirective() {
    var current = {};
    return {
      scope: {
        sheetData: "="
      },
      templateUrl: '/views/sheetDirective.html',
      link: function (scope, element, attrs) {
        scope.selectCell = function (row, col) {
          angular.element(element[0].querySelector(".selected")).removeClass('selected');
          current.row = row;
          current.column = col;
          angular.element(angular.element(element.find("tr")[row]).find("td")[col])
            .addClass('selected');
        };
        console.log('sheetSheet Directive, here I stand!');
        return;
      }
    };
  }
})();
