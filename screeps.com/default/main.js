var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    
    /*
        
        Coop Screep Main
        
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
    
    //Memory-Cleaner
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    //Harvester-Spawn-Control
    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});        
    }else
    
    //builder-Spawn-Control
    if(builders.length < 1) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new Builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'builder'}});        
    }else
    
    //upgrader-Spawn-Control
    if(upgraders.length < 1) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new Upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'upgrader'}});        
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