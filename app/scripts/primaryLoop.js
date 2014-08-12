'use strict';

angular.module('angularReactorApp')
.service('PrimaryLoop', function(Core, Water, Conf) {
    var primaryLoop = this;
    this.water = Water;
    this.core = Core;
    this.conf = Conf;

    // Primary loop 
    // Primary loop pump moves 12 m3 of water per second through the core

    // Pump starts off
    this.pump = false;
    this.inletTemp = this.water.ROOM_TEMP;
    this.outletTemp = this.water.ROOM_TEMP;

    this.OPERATING_DEBIT = 12; // m3 / s
    this.OPERATING_PRESSURE = 15.51; // MPa
    this.DESIGN_PRESSURE = 17.24; // Over pressure by a factor of x will lead to rupture, loss of ability to maintain coolant inventory
    this.MAX_PRESSURE = 17.24 * 3;

    this.pumpFraction = primaryLoop.OPERATING_DEBIT / primaryLoop.core.COOLANT_VOLUME;
    this.nWaterVolumes = parseInt(1 / (primaryLoop.conf.tickFraction * primaryLoop.pumpFraction));
    this.dVolume = 134 / this.nWaterVolumes;
    this.waterVolumes = [];
    for (var i = 0; i < this.nWaterVolumes; i++) {
        primaryLoop.waterVolumes.push(this.water.ROOM_TEMP);
    }

    // Just the aerage of outlet and inlet
    this.getAverageWaterTemperature = function() {
        return 1/2 * (primaryLoop.inletTemp + primaryLoop.outletTemp);
    };
    
    // Nominal fuel rod temperature is 650 degC. At this tempereature, 1400 MW thermal power transits every second to the primary coolant.
    // To absorb that much power, the average water temperature will be 280 degC
    // So, to simplify: heat flow proportional to temp difference between rods and coolant
    // At 650 - 280, we get 1400 MW thermal flow.
    // At 0 temp diff, 0
    this.getRodsToCoolantHeatFlow = function() { // J
        var dfdt = primaryLoop.core.DESIGN_THERMAL_POWER / (650 - 280);
        var dt = primaryLoop.core.fuelRodTemp - primaryLoop.getAverageWaterTemperature();
        return dfdt * dt * primaryLoop.conf.tickFraction;
    };

    // Nominal outlet temperature is around 300 degC. At this tempereature, 1400 MW thermal power transits every second to the steam generator 
    // To absorb that much power, the average steam outlet temperature will be 268 degC
    // So, to simplify: heat flux proportional to temp difference between average core-side (outlet - inlet) temp and steam outlet temp 
    // At 300 - 268, we get 1400 MW thermal flux.
    // At 0 temp diff, 0
    this.getCoolantTempAfterSteamG = function(vol, temp) { // degC 
        if (!primaryLoop.pump) { return 0; }
        var dfdt = primaryLoop.core.DESIGN_THERMAL_POWER / (300 - 268);

        // Cold temp follows steam generator hot temp up to 268
        var coldTemp = Math.min(temp, 268);

        var dt = Math.max(temp - coldTemp, 0);
        var out = dfdt * dt * primaryLoop.conf.tickFraction; // J
        
        var newT = temp - out / primaryLoop.getCoreCoolantCpM(vol, temp);
        return newT;
    };

    this.getCoreCoolantCpM = function(dVolume, temp) { // J/deg
        var coolantMass = dVolume * primaryLoop.water.getProp('ro', temp); // kg
        return coolantMass * primaryLoop.water.getProp('cp', temp) * 1000; 
    };

    this.outletTempWarning = function() {
        var ot = primaryLoop.outletTemp;
        if (ot < 285) { 
            return ['Cold', 'info'];
        }
        if (ot < 305) {
            return ['Nominal', 'success'];
        }
        if (ot < 335) {
            return ['Overheated', 'warning'];
        }
        if (ot > 335) {
            return ['Severely overheated', 'danger'];
        }
    };

    this.inletTempWarning = function() {
        var ot = primaryLoop.inletTemp;
        if (ot < 268) { 
            return ['Cold', 'info'];
        }
        if (ot < 280) {
            return ['Nominal', 'success'];
        }
        if (ot < 300) {
            return ['Overheated', 'warning'];
        }
        if (ot > 300) {
            return ['Severely overheated', 'danger'];
        }
    };
});
