/*
     Kraken AI - v.1.1

     Main handles:
     -Vars
     -Console Log
     -Task Controller
     -Spawn Controller
     -Tier Controller
     -AI Controller

 */

//VARS

//Extentions
var tasks = require('tasks');
var prefabs = require('prefabs');
//Roles
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleJanitor = require('role.janitor');
//MaxRoles
var maxBuilder = 1;
var maxUpgrader = 1;
var maxHarvester = 2;
var maxJanitor = 0;
//globals
var version = 1.0;
var logging = false;
if(!Memory.tier){
    Memory.tier = {level: 0};
}
if(!Memory.tier.plannedToCont){
    Memory.tier.plannedToCont = false;
}

module.exports.loop = function () {

    //Lists
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    var janitors = _.filter(Game.creeps, (creep) => creep.memory.role === 'janitor');
    var extCount = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION);
        }
    });

    //Console logs
    if(logging){
        if(Game.time % 20 == 0)
        {
            
        console.log('----' + Game.spawns['Spawn1'].room + '----');
        console.log('Harvesters: ' + harvesters.length + ' / ' + maxHarvester);
        console.log('Builders: ' + builders.length + ' / ' + maxBuilder);
        console.log('Upgraders: ' + upgraders.length + ' / ' + maxUpgrader);
        console.log('Janitors: ' + janitors.length + ' / ' + maxJanitor);
        console.log('/////////////////////////////////');
        }
    }
    //TASK CONTROLLER

    //Tasklist

    defendRoom(Game.spawns['Spawn1'].room.name);
    if(Memory.tier.level >= 3){
        if(Game.time%1000==0){
            tasks.roadPlan();
        }
    }

    //SPAWN CONTROLLER

    //Spawn icon
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    //Ethnic cleansing
    for(var name in Memory.creeps) {
        //Darwin
        if(Game.creeps[name] && Game.creeps[name].memory.ver != version){
            Game.creeps[name].suicide();
            console.log('Der Darwinismus hat: ' + name + ' unter die Erde gebracht!');
        }
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(name + ' died!');
        }
    }

    // display
    var i = 0;
    for(var name in Memory.creeps){
        Game.spawns['Spawn1'].room.visual.text(
            name + " doing " + Game.creeps[name].memory.job,
            0,
            i,
            {align: 'left', opacity: 0.8});
        i++;
    }

    //*Ugly but works*
    //Harvester-Spawn-Control
    if(harvesters.length < maxHarvester) {
        roleHarvester.spawn(Game.spawns['Spawn1'], version);
    }else
    //builder-Spawn-Control
    if(builders.length < maxBuilder) {
        roleBuilder.spawn(Game.spawns['Spawn1'], version);
    }else
    //upgrader-Spawn-Control
    if(upgraders.length < maxUpgrader) {
        roleUpgrader.spawn(Game.spawns['Spawn1'], version);
    }else
    //janitor-Spawn-Control
    if(janitors.length < maxJanitor) {
        roleJanitor.spawn(Game.spawns['Spawn1'], version);
    }




    //Role-Handler
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'janitor') {
            roleJanitor.run(creep);
        }
    }

    //TIER CONTROLL

    //Tier Display
    Game.spawns['Spawn1'].room.visual.text(
    'Tier️' +Memory.tier.level,
    Game.spawns['Spawn1'].pos.x,
    Game.spawns['Spawn1'].pos.y - 2,
    {align: 'center', opacity: 0.8});

    //Tier modes
    var controllerlevel =Game.spawns['Spawn1'].room.controller.level;

    //Tier 1
    if(Memory.tier.level == 0 && builders.length > 0){
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }

    //Tier 2
    if(Memory.tier.level == 1 && controllerlevel >= 2){
        prefabs.firstExtention(Game.spawns['Spawn1']);
        maxBuilder = 2;
        maxUpgrader = 2;
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }

    //Tier 3
    if(Memory.tier.level == 2 && controllerlevel >= 2 &&  extCount.length >= 5){
        tasks.roadPlan();
        prefabs.secondExtention(Game.spawns['Spawn1']);
        prefabs.firstDefence(Game.spawns['Spawn1']);
        maxHarvester = 4;
        maxJanitor = 1;
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }
    //Tier 4
    if(Memory.tier.level == 3 && controllerlevel >= 3 && extCount.length >=10){
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }


    //AI CONTROLLER
    function defendRoom(roomName) {
        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var towers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
        }
    }
    //Tower AI (attack only)


};