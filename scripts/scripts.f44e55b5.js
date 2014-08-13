"use strict";angular.module("angularReactorApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","frapontillo.bootstrap-switch","ngOnboarding"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/home.html",controller:"HomeCtrl"}).when("/core",{templateUrl:"views/core.html",controller:"CoreCtrl"}).when("/primary",{templateUrl:"views/primary.html",controller:"PrimaryCtrl"}).when("/secondary",{templateUrl:"views/secondary.html",controller:"SecondaryCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).otherwise({redirectTo:"/"})}]).directive("valueWithLabel",function(){return{restrict:"AE",scope:{value:"=",unit:"@",func:"&label"},template:'{{ value | number:2 }} {{ unit }} <span class="label label-{{labelClass}}">{{ label }}</span>',link:function(a){a.$watch("value",function(){var b=a.func();a.labelClass=b[1],a.label=b[0]});var b=a.func();a.labelClass=b[1],a.label=b[0]}}}),angular.module("angularReactorApp").controller("MainCtrl",["GameManager","$scope","$route","$location",function(a,b,c,d){b.game=a,b.isActive=function(a){var b=d.path();return a===b},b.showOnboarding=!1,b.stepIndex=0,b.startOnboarding=function(){this.game.restart(),b.showOnboarding=!0},b.onboardingSteps=[{title:"Welcome!",position:"centered",description:'<h3>Welcome to ngReactor</h3><p>ngReactor simulates a <a href="http://en.wikipedia.org/wiki/Pressurized_water_reactor">PWR (Pressurized Water Reactor)</a> nuclear power plant. The power of the simulated plant is 1400 MW thermal and 450 electrical.</p><p>We\'ll start by warming up the reactor core.</p>',width:500},{title:"The reactor core",description:"</p>The rod position is the main control for the reactor core power. Try it, click Up.</p><p>You'll notice that some things changed, including a warning that just popped up next to the pump controls.</p><p>We just moved the control rods up by 1%, starting a chain nuclear reaction in the bottom 1% of the core. The core, including its coolant, has started warming up.</p>",overlay:!1,position:"bottom"},{title:"The primary cooling loop.",description:'<p>It\'s time to start the big pumps. These are the primary cooling loop pumps that move 12 m3 of water every second through the core.</p><p>Until now, we warmed up the core without running them. This is all right for a warmup, but not for running at full power (as an exercise, try running at full power without the pumps later).</p><p>Now, start the pumps by clicking the ON button next to "Primary pump".</p>',overlay:!1,position:"bottom"},{title:"Nominal power!",description:"<p>Starting the pumps also removed the red warning. Now you can increase the core power. Either do it like before or click on Full Power.</p><p>Things happen even faster at full power. Feel free to look around in the Reactor Core and Primary loop tabs. The fuel rods temperature will increase rapidly, then settle around 660 &deg;C.</p><p>The coolant temperature will rise to 300 &degC at the outlet. This is enough to flash vaporize water (a lot of water) in the secondary cooling circuit. This overheated, supercritical steam will then drive the turbines attached to the electrical generators.</p>The tutorial is over, feel free to experiment.",overlay:!1,position:"bottom"}]}]),angular.module("angularReactorApp").controller("HomeCtrl",["$scope","GameManager",function(a,b){this.game=b,a.game=this.game}]),angular.module("angularReactorApp").controller("CoreCtrl",["$scope","GameManager",function(a,b){this.game=b,a.game=this.game}]),angular.module("angularReactorApp").controller("PrimaryCtrl",["$scope","GameManager",function(a,b){this.game=b,a.game=this.game}]),angular.module("angularReactorApp").controller("SecondaryCtrl",["$scope","GameManager",function(a,b){this.game=b,a.game=this.game}]),angular.module("angularReactorApp").controller("AboutCtrl",["$route",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("angularReactorApp").service("GameManager",["PrimaryLoop","Core","Water","Conf","$timeout",function(a,b,c,d,e){var f=this;this.water=c,this.core=b,this.primaryLoop=a,this.tickFraction=d.tickFraction;var g=!1;this.tickLength=0,this.restart=function(){g=!0,console.log("Restart"),this.core.restart(),this.primaryLoop.restart(),e(this.start,400)},this.tick=function(){var a=new Date;try{var b=f.core.getThermalPower()*f.tickFraction,c=f.primaryLoop.getRodsToCoolantHeatFlow(),d=b-c,h=c,i=f.core.fuelRodTemp;f.core.fuelRodTemp=i+d/f.core.CORE_CP_M;var j=f.primaryLoop.waterVolumes.shift();j+=h/f.primaryLoop.getCoreCoolantCpM(f.primaryLoop.dVolume,j),f.primaryLoop.outletTemp=j,j>f.water.CRITICAL_TEMP&&(console.log("Core temparature above critical, rupture of pressure vessel"),g=!0,$("#failureModal").modal()),f.primaryLoop.pump&&(j=f.primaryLoop.getCoolantTempAfterSteamG(f.primaryLoop.dVolume,j)),f.primaryLoop.inletTemp=j,f.primaryLoop.waterVolumes.push(j)}catch(k){throw g=!0,k}f.tickLength=new Date-a,g||e(f.tick,2,!1)},this.displayTick=function(){g||e(f.displayTick,200)},this.start=function(){g=!1,f.tick(),f.displayTick()},this.start()}]),angular.module("angularReactorApp").service("Water",function(){var a=this;this.CRITICAL_TEMP=373.946,this.ROOM_TEMP=20,this.WATER={5:{ro:1e3,p:9e-4,cp:4.204},25:{ro:997.1,p:.0032,cp:4.181},100:{ro:958,p:.10133,cp:4.219},275:{ro:756,p:5.95,cp:5.2},300:{ro:714,p:8.6,cp:5.65},325:{ro:654,p:12.13,cp:6.86},350:{ro:575,p:16.54,cp:10.1},373.946:{ro:373.95,p:22.06,cp:15},PRESENT_TEMPS:[5,25,100,275,300,325,350,373.946]},this.getProp=function(b,c){if(void 0!==a.WATER[c])return a.WATER[c][b];if(c>374.946||5>c)return"NOPE, OUT OF RANGE ERROR";var d=-1,e=-1;a.WATER.PRESENT_TEMPS.some(function(b,f){return b>c?(e=b,d=a.WATER.PRESENT_TEMPS[f-1],!0):void 0});var f=a.WATER[d][b],g=a.WATER[e][b],h=e-d,i=g-f,j=f+i/h*(c-d);return j}}),angular.module("angularReactorApp").service("PrimaryLoop",["Core","Water","Conf",function(a,b,c){var d=this;this.water=b,this.core=a,this.conf=c,this.OPERATING_DEBIT=12,this.OPERATING_PRESSURE=15.51,this.DESIGN_PRESSURE=17.24,this.MAX_PRESSURE=51.72,this.restart=function(){this.pump=!1,this.inletTemp=this.water.ROOM_TEMP,this.outletTemp=this.water.ROOM_TEMP,this.pumpFraction=d.OPERATING_DEBIT/d.core.COOLANT_VOLUME,this.nWaterVolumes=parseInt(1/(d.conf.tickFraction*d.pumpFraction)),this.dVolume=134/this.nWaterVolumes,this.waterVolumes=[];for(var a=0;a<this.nWaterVolumes;a++)d.waterVolumes.push(this.water.ROOM_TEMP)},this.restart(),this.getAverageWaterTemperature=function(){return.5*(d.inletTemp+d.outletTemp)},this.getRodsToCoolantHeatFlow=function(){var a=d.core.DESIGN_THERMAL_POWER/370,b=d.core.fuelRodTemp-d.getAverageWaterTemperature();return a*b*d.conf.tickFraction},this.getCoolantTempAfterSteamG=function(a,b){if(!d.pump)return 0;var c=d.core.DESIGN_THERMAL_POWER/32,e=Math.min(b,268),f=Math.max(b-e,0),g=c*f*d.conf.tickFraction,h=b-g/d.getCoreCoolantCpM(a,b);return h},this.getCoreCoolantCpM=function(a,b){var c=a*d.water.getProp("ro",b);return c*d.water.getProp("cp",b)*1e3},this.outletTempWarning=function(){var a=d.outletTemp;return 285>a?["Cold","info"]:305>a?["Nominal","success"]:335>a?["Overheated","warning"]:a>335?["Severely overheated","danger"]:void 0},this.inletTempWarning=function(){var a=d.inletTemp;return 268>a?["Cold","info"]:280>a?["Nominal","success"]:300>a?["Overheated","warning"]:a>300?["Severely overheated","danger"]:void 0}}]),angular.module("angularReactorApp").service("Core",["Water",function(a){var b=this;this.water=a,this.DESIGN_THERMAL_POWER=14e8,this.COOLANT_VOLUME=134.2,this.URANIUM_MASS=4e4,this.STEEL_MASS=4e4,this.URANIUM_CP=.12,this.STEEL_CP=.466,this.restart=function(){b.fuelRodTemp=b.water.ROOM_TEMP,b.rodPosition=0},this.restart(),this.moveRodDown=function(){b.rodPosition-=1,b.rodPosition<0&&(b.rodPosition=0)},this.moveRodUp=function(){b.rodPosition+=1,b.rodPosition>100&&(b.rodPosition=100)},this.removeRod=function(){b.rodPosition=100},this.insertRod=function(){b.rodPosition=0},this.getThermalPower=function(){var a=b.rodPosition/100;return b.DESIGN_THERMAL_POWER*a},this.CORE_CP_M=this.STEEL_MASS*this.STEEL_CP*1e3+this.URANIUM_MASS*this.URANIUM_CP*1e3,this.getThermalPowerWarning=function(){var a=b.getThermalPower()/1e6;return 1>a?["Stopped","default"]:100>a?["Very low","info"]:1350>a?["Low","info"]:1450>a?["Nominal","success"]:1550>a?["Overpowered","warning"]:a>1550?["Severely overpowered","danger"]:void 0},this.fuelRodTempWarning=function(){var a=b.fuelRodTemp;return 600>a?["Cold","info"]:630>a?["Warm","info"]:690>a?["Nominal","success"]:800>a?["Overheated","warning"]:a>900?["Severely overheated","danger"]:void 0}}]),angular.module("angularReactorApp").service("Conf",function(){this.tickSimulationLength=100,this.tickFraction=this.tickSimulationLength/1e3});