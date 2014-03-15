'use strict';

(function() {
  var appModule = angular.module('sheetDemo', ['ui.router', 'ui.bootstrap']);
  appModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', routeConfig]);
  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider.state('home', {
      url: '/home',
      template: '<h1>{{title}}</h1>',
      controller: ['$scope', function ($scope) {
        $scope.title = "Home!";
      }]
    });
    
    $stateProvider.state('away', {
      url: '/away',
      template: '<h1>{{title}}</h1>',
      controller: ['$scope', function ($scope) {
        $scope.title = "Away!";
      }]
    });

    $stateProvider.state('sheet', {
      url: '/sheet',
      templateUrl: '/views/sheet.html',
      controller: 'SheetController'
    });
  }
})();
