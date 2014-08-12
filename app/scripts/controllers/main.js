'use strict';

/**
 * @ngdoc function
 * @name angularReactorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularReactorApp
 */
angular.module('angularReactorApp')
  .controller('MainCtrl', function ($scope, $route, $location) {
    $scope.isActive = function(tab) {
        var current = $location.path();
        return tab === current; 
    };
  });
