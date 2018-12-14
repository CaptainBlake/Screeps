var version = 1.0;
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var maxBuilder = 2;
var maxUpgrader = 2;
var maxHarvester = 2;

module.exports.loop = function () {
    
    
    /*
        
        Coop Screep Main v1.1
        
    */
    
    
    //OUTPUTS AND VALS
    
    //Console logs and lists
        console.log('----' + Game.spawns['Spawn1'].room + '----');
        //Harvester-liste
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        console.log('Harvesters: ' + harvesters.length);
        //Builder-liste
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
        console.log('Builders: ' + builders.length);
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        console.log('Upgraders: ' + upgraders.length);
        
        console.log('/////////////////////////////////');
    //Spawn icon
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
    //SPAWN CONTROLL
    
    //Ethnic cleansing
    for(var name in Memory.creeps) {
        //Darwin
        if(Game.creeps[name] && Game.creeps[name].memory.ver != version){
            Game.creeps[name].suicide();
        }
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //Harvester-Spawn-Control
    if(harvesters.length < maxHarvester) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        var srcs = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        if(harvesters.length > 0){
        var src = (harvesters[harvesters.length-1].memory.source + 1)%srcs.length;
        }else{
            var src = 0;
        }
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester', source: src, ver: version}});    
    }else
    
    //builder-Spawn-Control
    if(builders.length < maxBuilder) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new Builder: ' + newName);
        var srcs = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        if(builders.length > 0){
        var src = (builders[builders.length-1].memory.source + 1)%srcs.length;
        }else{
            var src = 0;
        }
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'builder', source: src, ver: version}});        
    }else
    
    //upgrader-Spawn-Control
    if(upgraders.length < maxUpgrader) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new Upgrader: ' + newName);
        var srcs = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        if(upgraders.length > 0){
        var src = (upgraders[upgraders.length-1].memory.source + 1)%srcs.length;
        }else{
            var src = 0;
        }
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'upgrader', source: src, ver: version}});        
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
    }
    
    //AI CONTROLL
    
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
}