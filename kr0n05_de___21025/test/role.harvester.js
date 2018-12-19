/*
 * Harvester runs between Source-nodes and Structures which contains energy to store them
 * Could become Upgrader when IDLE (low-chance / poor implementation)
 */
let tasks = require('tasks');
let roleUpgrader = require('role.upgrader');
let roleName = "harvester";
let bodyParts = [WORK,CARRY,MOVE];
let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.memory.job = ('⚒ harvest');
            creep.memory.begin = Game.time;
        }
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.memory.job = ('🤮 drain');
            creep.memory.begin = Game.time;
        }


	    if(creep.memory.harvesting) {
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}});
                
            }
        }else{
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_SPAWN)
                            && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length <= 0){
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (container) => {
                        return (container.structureType == STRUCTURE_CONTAINER)
                            && container.store[RESOURCE_ENERGY] < 2000;
                    }
                });
            }
            if(targets[0] != undefined) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    if(creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}}) == ERR_NO_PATH){
                        creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }else{

                //idle-mode
                creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
                //roleUpgrader.run(creep);
            }
        }
	},

    spawn: function(spawner, version) {
        //Constructor
        let newName = roleName + Game.time;
        let srcs = spawner.room.find(FIND_SOURCES);
        let src = Game.time%srcs.length;
        //Tier-Stages
        let t3bodyParts = [WORK,WORK,WORK,CARRY,MOVE];
        if(Memory.tier.level >= 3 && tasks.bodyCost(t3bodyParts) <= Game.spawns['Spawn1'].room.energyAvailableSum){
            bodyParts = t3bodyParts;
        }

        //Spawn
        if(spawner.spawnCreep(bodyParts, newName,{memory: {role: roleName, source: src, ver: version, job : '⚒ harvest', begin : Game.time}}) >= 0){
            console.log('Spawning new ' + roleName + ' ' + newName + " for the cost of " + tasks.bodyCost(bodyParts));

        }
    }
};

module.exports = roleHarvester;