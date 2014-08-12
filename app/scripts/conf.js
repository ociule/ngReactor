'use strict';

angular.module('angularReactorApp')
.service('Conf', function() {
    this.tickSimulationLength = 100; // What period of time do we simulate every tick ?
    this.tickFraction = this.tickSimulationLength / 1000;
});
