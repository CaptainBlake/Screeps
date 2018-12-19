/*
 * Janitor Role keeps structures healthy
 */
let tasks = require('tasks');
let roleHarvester = require('role.harvester');
let roleName = "janitor";
let bodyParts = [WORK,CARRY,MOVE];
let roleJanitor = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.memory.job = ('⚒ harvest');
            creep.memory.begin = Game.time;
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.memory.job = ('🚧 repair');
            creep.memory.begin = Game.time;
        }
        if(creep.memory.repairing) {

            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
                if(target!=undefined) {
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        //make it easier to see where the janitor is going (debug purpose for target prio)
                        Game.spawns['Spawn1'].room.visual.circle(
                            creep.memory._move.dest.x,
                            creep.memory._move.dest.y);
                    }
                }
        }else {
            let stores;
            if(Memory.tier.level >= 3){
                stores = creep.room.find(FIND_STRUCTURES, {
                    filter: (container) => {
                        return (container.structureType == STRUCTURE_CONTAINER)
                            && container.store[RESOURCE_ENERGY] < 0;
                    }
                });
            }else{
                stores = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION)
                            && structure.energy != 0;
                    }
                });
            }
            if(stores.length > 0) {
                //creep.say('pick up');
                if(creep.withdraw(stores[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(stores[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            if (stores.length > 0) {
                //creep.say('pick up');
                if (creep.withdraw(stores[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(stores[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                let sources = creep.room.find(FIND_SOURCES);
                //creep.say('⛏');
                if (creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    },
    spawn: function(spawner, version) {
        //Constructor
        let newName = roleName + Game.time;
        let srcs = spawner.room.find(FIND_SOURCES);
        let src = Game.time%srcs.length;
        //Tier-Stages
        let t3bodyParts = [WORK,CARRY,CARRY,MOVE];
        if(Memory.tier.level >= 3 && tasks.bodyCost(t3bodyParts) <= Game.spawns['Spawn1'].room.energyAvailableSum){
            bodyParts = t3bodyParts;
        }
        //Spawn
        if(spawner.spawnCreep(bodyParts, newName,{memory: {role: roleName, source: src, ver: version, job : '⚒ harvest', begin : Game.time}}) >= 0){
            console.log('Spawning new ' + roleName + ' ' + newName + " for the cost of " + tasks.bodyCost(bodyParts));
        }
    }
};

module.exports = roleJanitor;