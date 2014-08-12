'use strict';

/**
 * @ngdoc function
 * @name angularReactorApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularReactorApp
 */
angular.module('angularReactorApp')
  .controller('AboutCtrl', ['$route', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
