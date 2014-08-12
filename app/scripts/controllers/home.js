'use strict';

/**
 * @ngdoc function
 * @name angularReactorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularReactorApp
 */
angular.module('angularReactorApp')
  .controller('HomeCtrl', ['$scope', 'GameManager' , function ($scope, GameManager) {
    this.game = GameManager;
    $scope.game = this.game;
  }]);
