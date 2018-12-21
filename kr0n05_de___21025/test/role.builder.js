/*
 * Builder searches for Constructionsites within the room and tries to complete them.
 * Switches to Janitor-mode when hes IDLE
 */
let tasks = require('tasks');
let roleJanitor = require('role.janitor');
let roleName = "builder";
let bodyParts = [WORK,CARRY,MOVE];
let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(target!=undefined){
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
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
	        }else {
                let stores;
                if(Memory.tier.level >= 3){
                     stores = creep.room.find(FIND_STRUCTURES, {
                        filter: (container) => {
                            return (container.structureType == STRUCTURE_CONTAINER)
                                && container.store[RESOURCE_ENERGY] > 0;
                        }
                    });
                }else{
                    stores = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN)
                                && structure.energy != 0;
                        }
                    });
                }
                if(stores.length > 0) {
                    //creep.say('pick up');
                    if(creep.withdraw(stores[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(stores[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }else{
                        creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffaa00'}});
                        console.log('Builder has no resources!');
                    }
	        }
	        
        }else{
            if(Memory.tier.level >= 3){
                roleJanitor.run(creep);
            }else{
                creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	},
    spawn: function(spawner, version) {
        //Constructor
        let newName = roleName + Game.time;
        let srcs = spawner.room.find(FIND_SOURCES);
        let src = Game.time%srcs.length;
        //Tier-Stages
        let t3bodyParts = [WORK,WORK,CARRY,MOVE,MOVE];
        if(Memory.tier.level >= 3 && tasks.bodyCost(t3bodyParts) <= spawner.room.energyAvailableSum){
            bodyParts = t3bodyParts;
        }

        //Spawn
        if(spawner.spawnCreep(bodyParts, newName,{memory: {role: roleName, source: src, ver: version, job : '🛒 get', begin : Game.time}}) >= 0){
            console.log('Spawning new ' + roleName + ' ' + newName + " for the cost of " + tasks.bodyCost(bodyParts));
        }
    }
};

module.exports = roleBuilder;