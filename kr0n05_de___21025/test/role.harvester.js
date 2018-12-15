/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var roleUpgrader = require('role.upgrader');
var roleName = "harvester";
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                creep.say('⛏');
                creep.moveTo(sources[creep.memory.source], {visualizePathStyle: {stroke: '#ffaa00'}});
                
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else{
                    //Harvesters are now upgraders if they have nothing to do
                    roleUpgrader.run(creep);
                    //creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
                }
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

module.exports = roleHarvester;