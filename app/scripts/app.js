'use strict';

/**
 * @ngdoc overview
 * @name angularReactorApp
 * @description
 * # angularReactorApp
 *
 * Main module of the application.
 */
angular
  .module('angularReactorApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngOnboarding'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/core', {
        templateUrl: 'views/core.html',
        controller: 'CoreCtrl'
      })
      .when('/primary', {
        templateUrl: 'views/primary.html',
        controller: 'PrimaryCtrl'
      })
      .when('/secondary', {
        templateUrl: 'views/secondary.html',
        controller: 'SecondaryCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).directive('valueWithLabel', function() {
    return {
      restrict: 'AE',
      scope: {
        value: '=',
        unit: '@',
        func: '&label'
      },
      template: '{{ value | number:2 }} {{ unit }} <span class="label label-{{labelClass}}">{{ label }}</span>',
      link: function(scope) {
        scope.$watch('value', function() {
            var values = scope.func();
            scope.labelClass = values[1];
            scope.label = values[0];
        });
        var values = scope.func();
        scope.labelClass = values[1];
        scope.label = values[0];
      }
    };
  });
