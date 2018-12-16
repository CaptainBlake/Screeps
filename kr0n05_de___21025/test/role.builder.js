/*
 * Builder searches for Constructionsites within the room and tries to complete them.
 * Switches to Janitor-mode when hes IDLE
 */
var tasks = require('tasks');
var roleJanitor = require('role.janitor');
var roleName = "builder";
var bodyParts = [WORK,CARRY,MOVE];
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(targets.length){
            if(creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.memory.job = ('🛒 get');
                creep.memory.begin = Game.time;
            }
    	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.building = true;
                creep.memory.job = ('🚧 build');
                creep.memory.begin = Game.time;
            }
    	    if(creep.memory.building) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
	        }else {
                var stores = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION)
                            && structure.energy != 0;
                    }
                });
                if(stores.length > 0) {
                    //creep.say('pick up');
                    if(creep.withdraw(stores[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(stores[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }else{
                        creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
	        }
	        
        }else{
            roleJanitor.run(creep);
        }
	},
    spawn: function(spawner, version) {
        //Constructor
        var newName = roleName + Game.time;
        var srcs = spawner.room.find(FIND_SOURCES);
        var src = Game.time%srcs.length;
        //Tier-Stages
        var t3bodyParts = [WORK,WORK,CARRY,MOVE,MOVE];
        if(Memory.tier.level >= 3 && tasks.bodyCost(t3bodyParts) <= Game.spawns['Spawn1'].room.energyAvailableSum){
            bodyParts = t3bodyParts;
        }

        //Spawn
        if(spawner.spawnCreep(bodyParts, newName,{memory: {role: roleName, source: src, ver: version, job : '🛒 get', begin : Game.time}}) >= 0){
            console.log('Spawning new ' + roleName + ' ' + newName + " for the cost of " + tasks.bodyCost(bodyParts));
        }
    }
};

module.exports = roleBuilder;