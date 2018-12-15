/*
 * Janitor Role keeps structures healthy
 */
var roleHarvester = require('role.harvester');
var roleName = "janitor";
var bodyParts = [WORK,CARRY,MOVE];
var roleJanitor = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_ROAD && structure.hits <= 4500) || (structure.structureType == STRUCTURE_WALL && structure.hits <= 4500));
            }
        });
        if(targets.length){
            if(creep.memory.repairing && creep.carry.energy == 0) {
                creep.memory.repairing = false;
                creep.say('🔄 harvest');
            }
            if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
                creep.memory.repairing = true;
                creep.say('🚧 repair');
            }
            if(creep.memory.repairing) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
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
    spawn: function(spawner, version) {
        //Constructor
        var newName = roleName + Game.time;
        var srcs = spawner.room.find(FIND_SOURCES);
        var src = Game.time%srcs.length;
        //Tier-Stages
        if(Memory.tier.level >= 3){
            bodyParts = [WORK,CARRY,MOVE, MOVE];
        }

        //Spawn
        if(spawner.spawnCreep(bodyParts, newName,{memory: {role: roleName, source: src, ver: version}}) >= 0){
            console.log('Spawning new ' + roleName + ' ' + newName);
        }
    }
};

module.exports = roleJanitor;