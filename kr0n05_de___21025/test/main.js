var version = 1.0;
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var rolePlanner = require('role.planner');
var roleJanitor = require('role.janitor');

if(!Memory.tier){
    Memory.tier = {level: 0};
}
if(!Memory.tier.plannedToCont){
    Memory.tier.plannedToCont = false;
}


var maxBuilder = 2;
var maxUpgrader = 2;
var maxHarvester = 2;
var maxJanitor = 1;

var logging = false;
var bodyParts = [WORK,CARRY,MOVE];

module.exports.loop = function () {


    /*

        Coop Screeps AI

        *Desc here*

    */


    //OUTPUTS AND VALS
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    var janitors = _.filter(Game.creeps, (creep) => creep.memory.role === 'janitor');

    //Console logs
    if(logging){
        console.log('----' + Game.spawns['Spawn1'].room + '----');
        console.log('Harvesters: ' + harvesters.length);
        console.log('Builders: ' + builders.length);
        console.log('Upgraders: ' + upgraders.length);
        console.log('Janitors: ' + janitors.length);
        console.log('/////////////////////////////////');
    }

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
            console.log(name + 'was killed by Darwin');
        }
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(name + ' died!');
        }
    }

    //SPAWN CONTROLLER

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
    }

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
        if(creep.memory.role == 'planner') {
            rolePlanner.run(creep);
        }
        if(creep.memory.role == 'janitor') {
            roleJanitor.run(creep);
        }
    }

    //AI CONTROLL
    var extCount = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION);
                    }
                });

    //Tier display
    Game.spawns['Spawn1'].room.visual.text(
    'Tier️' +Memory.tier.level,
    Game.spawns['Spawn1'].pos.x,
    Game.spawns['Spawn1'].pos.y - 2,
    {align: 'center', opacity: 0.8});

    //Tier modes
    var controllerlevel = creep.room.controller.level;

    //Tier 1
    if(Memory.tier.level == 0 && builders.length > 0){
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }

    //Tier 2
    if(Memory.tier.level == 1 && controllerlevel >= 2){
        Game.spawns['Spawn1'].room.createConstructionSite(
            Game.spawns['Spawn1'].pos.x + 2,
            Game.spawns['Spawn1'].pos.y - 2,
            STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(
            Game.spawns['Spawn1'].pos.x + 2,
            Game.spawns['Spawn1'].pos.y + 2,
            STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(
            Game.spawns['Spawn1'].pos.x - 2,
            Game.spawns['Spawn1'].pos.y - 2,
            STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(
            Game.spawns['Spawn1'].pos.x - 2,
            Game.spawns['Spawn1'].pos.y + 2,
            STRUCTURE_EXTENSION);
        Game.spawns['Spawn1'].room.createConstructionSite(
            Game.spawns['Spawn1'].pos.x,
            Game.spawns['Spawn1'].pos.y + 2,
            STRUCTURE_EXTENSION);
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }

    //Tier 3
    if(Memory.tier.level == 2 && controllerlevel >= 2 &&  extCount.length >= 5){
        maxHarvester = 4;
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }
    if(!Memory.tier.plannedToCont && Memory.tier.level >=2 ){
        if((Game.spawns['Spawn1'].spawnCreep([MOVE], 'toController',{memory: {planToCon: true, role: 'planner', ver: version}}) >= 0)){
            console.log('Spawning new planner: toController');
            Memory.tier.plannedToCont = true;
        }
    }
    //Tier 4
    if(Memory.tier.level == 3 && controllerlevel >= 3){
        bodyParts = [WORK,CARRY,MOVE, MOVE];
        ++Memory.tier.level;
        console.log('Reached Tier ' + Memory.tier.level);
    }
    
    //Tower Control
    var tower = Game.getObjectById('c8e832f3f947cacb7ad0656d');
    if(tower) {
        //heal-mode
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax/2
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        //attack-mode
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            
            tower.attack(closestHostile);
        }
    }
};