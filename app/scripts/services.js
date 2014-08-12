'use strict';

angular.module('angularReactorApp')
.service('GameManager', function(PrimaryLoop, Core, Water, Conf, $timeout) {
    var game = this;
    this.water = Water;
    this.core = Core;
    this.primaryLoop = PrimaryLoop;

    this.tickFraction = Conf.tickFraction; 

    var stop = false;
    this.tickLength = 0;
    this.tick = function() {
        var tickStart = new Date();
        try {
        // Calculate quantities produced this tick
        var dQ = game.core.getThermalPower() * game.tickFraction; // J

        var rodsToCoolantHeatFlux = game.primaryLoop.getRodsToCoolantHeatFlow(); // J
        // This is the heat that stays in the rods, raising their temp
        var dQRods = dQ - rodsToCoolantHeatFlux; // J

        // A volume dVolume of water moves through the rods, cooling them and receiving dQWater heat flow
        var dQWater = rodsToCoolantHeatFlux; // J

        // Update rod temperature and outlet temperature
        var prevFuelRodTemp = game.core.fuelRodTemp;
        game.core.fuelRodTemp = prevFuelRodTemp + dQRods / game.core.CORE_CP_M; 

        // This dVolume of water just received dQWater
        var dVolTemp = game.primaryLoop.waterVolumes.shift();
        dVolTemp = dVolTemp + dQWater / game.primaryLoop.getCoreCoolantCpM(game.primaryLoop.dVolume, dVolTemp);
        // This is now the outlet temp
        game.primaryLoop.outletTemp = dVolTemp;

        if (dVolTemp > game.water.CRITICAL_TEMP) {
            console.log('Core temparature above critical, rupture of pressure vessel');
            stop = true;
            $('#failureModal').modal();
        }

        // That same volume of water goes through the steam generator, losing heat
        // Calculate extracted heat
        if (game.primaryLoop.pump) {
            //dVolTemp = Math.min(268, dVolTemp - coolantToSteamGeneratorHeatFlow / game.primaryLoop.getCoreCoolantCpM(game.primaryLoop.dVolume, dVolTemp));
            dVolTemp = game.primaryLoop.getCoolantTempAfterSteamG(game.primaryLoop.dVolume, dVolTemp);
        }
        game.primaryLoop.inletTemp = dVolTemp; 
        game.primaryLoop.waterVolumes.push(dVolTemp);

        } catch (e) {
            stop = true;
            throw e;
        }
        game.tickLength = new Date() - tickStart;
        if (!stop) { $timeout(game.tick, 2, false); }
    };

    this.displayTick = function() {
        console.log('tick', game.tickLength, game.core.fuelRodTemp, game.primaryLoop.getAverageWaterTemperature());
        if (!stop) { $timeout(game.displayTick, 100); }
    };

    // Start ticking
    this.tick();
    this.displayTick();

});
