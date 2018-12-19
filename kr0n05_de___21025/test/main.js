/*
     Kraken AI - v.1.1

     Main handles:
     -lets
     -Console Log
     -Task Controller
     -Spawn Controller
     -Tier Controller
     -AI Controller

 */

//letS

//Extentions
let tasks = require('tasks');
let prefabs = require('prefabs');
//Roles
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleJanitor = require('role.janitor');
//MaxRoles
let maxBuilder = 1;
let maxUpgrader = 1;
let maxHarvester = 2;
let maxJanitor = 0;
//globals
let version = 1.0;
let logging = false;
let display = true;

if(!Memory.defend)
{
    Memory.defend = {count: 0};
}

if(!Memory.tier){
    Memory.tier = {level: 0};
}
if(!Memory.tier.plannedToCont){
    Memory.tier.plannedToCont = false;
}

module.exports.loop = function () {

    //Lists
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    let janitors = _.filter(Game.creeps, (creep) => creep.memory.role === 'janitor');
    let extCount = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
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
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    //Ethnic cleansing
    for(let name in Memory.creeps) {
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
    if(display){
        let CreepList = [];
        for (let creepname in Memory.creeps){
            if (Game.creeps[creepname].room == Game.spawns['Spawn1'].room){
                CreepList.push(Game.creeps[creepname].name);
            }
        }
        CreepList.sort();
        Game.spawns['Spawn1'].room.visual.text(
            "count: " + CreepList.length,
            0,
            0,
            {align: 'left', opacity: 0.8});
        for(let creep in CreepList){
            Game.spawns['Spawn1'].room.visual.text(
                (parseInt(creep)+1).toString().padStart((CreepList.length).toString().length ,"0") + ": " +CreepList[creep] + " doing " + Game.creeps[CreepList[creep]].memory.job + " for " + (Game.time - Game.creeps[CreepList[creep]].memory.begin) + " ticks.",
                0,
                parseInt(creep)+1,
                {align: 'left', opacity: 0.8});
            Game.creeps[CreepList[creep]].say(parseInt(creep)+1);
        }
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
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
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
    let controllerlevel =Game.spawns['Spawn1'].room.controller.level;

    //Tier 1
    if(Memory.tier.level == 0 && builders.length > 0){
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }

    //Tier 2
    if(Memory.tier.level == 1 && controllerlevel >= 2){
        prefabs.firstExtention(Game.spawns['Spawn1']);
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }
    if(Memory.tier.level >=2){
        maxBuilder = 2;
        maxUpgrader = 2;
    }

    //Tier 3
    if(Memory.tier.level == 2 && controllerlevel >= 2 &&  extCount.length >= 5){
        tasks.roadPlan();
        prefabs.secondExtention(Game.spawns['Spawn1']);
        prefabs.firstDefence(Game.spawns['Spawn1']);
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }
    if(Memory.tier.level >=3){
        maxHarvester = 5;
        maxJanitor = 1;
    }
    //Tier 4
    if(Memory.tier.level == 3 && controllerlevel >= 3 && extCount.length >=10){
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }


    //AI CONTROLLER

    //Tower AI (attack only)
    function defendRoom(roomName) {
        let hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        let damaged = Game.rooms[roomName].find(FIND_MY_STRUCTURES);
        if(hostiles.length > 0) {
            let towers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
            Memory.defended.count++;
        }
        if(damaged.length > 0){
            let towers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
             towers.forEach(tower => tower.repair(damaged[0]));
        }
    }
};