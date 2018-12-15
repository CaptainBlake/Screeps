/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = require('role.harvester');
var bodyParts = [WORK,CARRY,MOVE];
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length){
            if(creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.say('🔄 harvest');
            }
    	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.building = true;
    	        creep.say('🚧 build');
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
                    creep.say('pick up');
                    if(creep.withdraw(stores[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(stores[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }else{
                    var sources = creep.room.find(FIND_SOURCES);
                    creep.say('⛏');
                    if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
	        }
	        
        }else{
            roleHarvester.run(creep);
        }
	},
    spawn: function(spawner, creeplist, version) {
        //Constructor
        var newName = 'Builder' + Game.time;
        var srcs = spawner.room.find(FIND_SOURCES);
        if(creeplist.length > 0){
            var src = (creeplist[creeplist.length-1].memory.source + 1)%srcs.length;
        }else{
            var src = 0;
        }
        //Tier-Stages
        if(Memory.tier.level >= 3){
            bodyParts = [WORK,CARRY,MOVE, MOVE];
        }

        //Spawn
        if(spawner.spawnCreep(bodyParts, newName,{memory: {role: 'builder', source: src, ver: version}}) >= 0){
            console.log('Spawning new Builder: ' + newName);
        }
    }
};

module.exports = roleBuilder;