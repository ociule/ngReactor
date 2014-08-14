'use strict';

/**
 * @ngdoc function
 * @name angularReactorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularReactorApp
 */
angular.module('angularReactorApp')
  .controller('MainCtrl', function (GameManager, $scope, $route, $location) {
    $scope.game = GameManager;
    $scope.isActive = function(tab) {
        var current = $location.path();
        return tab === current; 
    };

    $scope.showOnboarding = false;
    $scope.stepIndex = 0;
    $scope.startOnboarding = function() {
        $scope.showOnboarding = true;
        this.game.restart();
    };

    $scope.onboardingSteps = [
    {
      title: 'Welcome!',
      position: 'centered',
      description: '<h3>Welcome to ngReactor</h3>' +
        '<p>ngReactor simulates a <a href="http://en.wikipedia.org/wiki/Pressurized_water_reactor">PWR (Pressurized Water Reactor)</a> nuclear power plant. The power of the simulated plant is 1400 MW thermal and 450 electrical.</p>' +
        '<p>We\'ll start by warming up the reactor core.</p>',
      width: 500
    },
    {
      title: 'The reactor core',
      description: '</p>The rod position is the main control for the reactor core power. Try it, click Up.</p>' +
        '<p>You\'ll notice that some things changed, including a warning that just popped up next to the pump controls.</p>' +
        '<p>We just moved the control rods up by 1%, starting a chain nuclear reaction in the bottom 1% of the core. The core, including its coolant, has started warming up.</p>',
      //attachTo: '#fullPower',
      overlay: false,
      position: 'bottom'
    },
    {
      title: 'The primary cooling loop.',
      description: '<p>It\'s time to start the big pumps. These are the primary cooling loop pumps that move 12 m3 of water every second through the core.</p>' +
        '<p>Until now, we warmed up the core without running them. This is all right for a warmup, but not for running at full power (as an exercise, try running at full power without the pumps later).</p><p>Now, start the pumps by clicking the ON button next to "Primary pump".</p>',
      //attachTo: '#fullPower',
      overlay: false,
      position: 'bottom'
    },
    {
      title: 'Nominal power!',
      description: '<p>Starting the pumps also removed the red warning. Now you can increase the core power. Either do it like before or click on Full Power.</p>' +
        '<p>Things happen even faster at full power. Feel free to look around in the Reactor Core and Primary loop tabs. The fuel rods temperature will increase rapidly, then settle around 660 &deg;C.</p>' +
        '<p>The coolant temperature will rise to 300 &degC at the outlet. This is enough to flash vaporize water (a lot of water) in the secondary cooling circuit. This overheated, supercritical steam will then drive the turbines attached to the electrical generators.</p>' +
        'The tutorial is over, feel free to experiment.',
      //attachTo: '#fullPower',
      overlay: false,
      position: 'bottom'
    }
    ];
  });
