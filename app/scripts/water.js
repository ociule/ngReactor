'use strict';

angular.module('angularReactorApp')
.service('Water', function() {
    var water = this;

    // Water thermal properties by temperature
    // Source http://www.engineeringtoolbox.com/water-thermal-properties-d_162.html

    this.CRITICAL_TEMP = 373.946;
    this.ROOM_TEMP = 20; // degC
    this.WATER = {
        5: {
            ro: 1000,
            p: 0.0009,
            cp: 4.204
        },
        25: {
            ro: 997.1,  // density, kg/m3
            p:  0.0032, // absolute pressure, MPa
            cp: 4.181  // specific heat, kJ/(kg * K)
        },
        100: {
            ro: 958,
            p: 0.10133,
            cp: 4.219
        },
        275: {
            ro: 756,
            p:  5.95,
            cp: 5.2
        },
        300: {
            ro: 714,
            p: 8.6,
            cp: 5.65
        },
        325: {
            ro: 654,
            p: 12.13,
            cp: 6.86
        },
        350: {
            ro: 575,
            p: 16.54,
            cp: 10.1
        },
        373.946: { // Critical point
            ro: 373.95,
            p: 22.06,
            cp: 15 // @TODO to put in real value
        },
        PRESENT_TEMPS: [5, 25, 100, 275, 300, 325, 350, 373.946],
    };

    // This will interpolate a prop if needed 
    this.getProp = function(prop, temp) {
        if (water.WATER[temp] !== undefined) {
            return water.WATER[temp][prop];
        } else { //interpolate linearly between what we have
            if (temp > 374.946 || temp < 5) {
                return 'NOPE, OUT OF RANGE ERROR';
            } else {
                var lowerTemp = -1, higherTemp = -1;
                water.WATER.PRESENT_TEMPS.some(function(iterTemp, ix) {
                    if (iterTemp > temp) {
                        higherTemp = iterTemp;
                        lowerTemp = water.WATER.PRESENT_TEMPS[ix - 1];
                        return true;
                    }
                });
                var lowerProp = water.WATER[lowerTemp][prop];
                var higherProp = water.WATER[higherTemp][prop];
                var dt = higherTemp - lowerTemp;
                var dp = higherProp - lowerProp; 
                var propValue = lowerProp + dp / dt * (temp - lowerTemp);
                return propValue;
            }
        }
    };
});
