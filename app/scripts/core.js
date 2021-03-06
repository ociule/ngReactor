'use strict';

angular.module('angularReactorApp')
.service('Core', function(Water) {
    var core = this;
    this.water = Water;

    // s1: http://ocw.mit.edu/courses/nuclear-engineering/22-06-engineering-of-nuclear-systems-fall-2010/lectures-and-readings/MIT22_06F10_lec06a.pdf
    this.DESIGN_THERMAL_POWER = 1400000000;
    this.COOLANT_VOLUME = 134.2; // m3, see s1
    this.URANIUM_MASS = 40000; // kg, see pax reactor site
    this.STEEL_MASS = 40000; // kg
    this.URANIUM_CP = 0.12; // specific heat, kJ/kg*deg
    this.STEEL_CP = 0.466; // specific heat, kJ/kg*deg

    this.restart = function() {
        core.fuelRodTemp = core.water.ROOM_TEMP; // Fuel rods start at room temp
        // Rod starts fully inserted
        core.rodPosition = 0;
    };
    this.restart();

    this.moveRodDown = function() {
        core.rodPosition -= 1;
        if (core.rodPosition < 0) {
            core.rodPosition = 0;
        }
    };
    this.moveRodUp = function() {
        core.rodPosition += 1;
        if (core.rodPosition > 100) {
            core.rodPosition = 100;
        }
    };
    this.removeRod = function() {
        core.rodPosition = 100;
    };

    this.insertRod = function() {
        core.rodPosition = 0;
    };

    this.getThermalPower = function() {
        var powerFraction = core.rodPosition / 100.0;
        return core.DESIGN_THERMAL_POWER * powerFraction;
    };

    // Specific heat mass of the fuel rod assembly: modelled uranium + steel masses. Very naive, of course.
    this.CORE_CP_M = this.STEEL_MASS * this.STEEL_CP * 1000 + this.URANIUM_MASS * this.URANIUM_CP * 1000; // J/deg

    this.getThermalPowerWarning = function() {
        var t = core.getThermalPower() / 1000000;
        if (t < 1) {
            return ['Stopped', 'default'];
        }
        if (t < 100) {
            return ['Very low', 'info'];
        }
        if (t < 1350) {
            return ['Low', 'info'];
        }
        if (t < 1450) {
            return ['Nominal', 'success'];
        }
        if (t < 1550) {
            return ['Overpowered', 'warning'];
        }
        if (t > 1550) {
            return ['Severely overpowered', 'danger'];
        }
    };

    this.fuelRodTempWarning = function() {
        var t = core.fuelRodTemp;
        if (t < 600) {
            return ['Cold', 'info'];
        }
        if (t < 630) {
            return ['Warm', 'info'];
        }
        if (t < 690) {
            return ['Nominal', 'success'];
        }
        if (t < 800) {
            return ['Overheated', 'warning'];
        }
        if (t > 900) {
            return ['Severely overheated', 'danger'];
        }
    };
});
