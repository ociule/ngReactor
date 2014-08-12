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
    'ngTouch'
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
  });
