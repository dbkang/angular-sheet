'use strict';

(function() {
  angular.module('sheetDemo').controller('SheetController', ['$scope', SheetController]);
  function SheetController($scope) {
    console.log('SheetController, here I stand!');
    $scope.data = [
      ['hey', 'man'],
      ['no', 'man']
    ];
  }
})();
