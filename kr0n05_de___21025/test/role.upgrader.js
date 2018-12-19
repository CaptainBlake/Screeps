/*
 * Upgrader stays @the RoomController and keeps pushing it up. Can switch Roles with low priority
 */

let tasks = require('tasks');
let roleName = "upgrader";
let bodyParts = [WORK,CARRY,MOVE];
let roleUpgrader = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if(creep.memory.upgrading && creep.carry.energy == 0) {
			creep.memory.upgrading = false;
            creep.memory.job = ('⚒ harvest');
            creep.memory.begin = Game.time;
		}
		if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
			creep.memory.upgrading = true;
            creep.memory.job = ('⚡ upgrade');
            creep.memory.begin = Game.time;
		}

		if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
		else {
			let stores;
			if(Memory.tier.level < 3 || Game.spawns['Spawn1'].room.controller.ticksToDowngrade < 5000){
				stores = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION)
							&& structure.energy != 0;
					}
				});
			}else if(Memory.tier.level >= 3){
				stores = creep.room.find(FIND_STRUCTURES, {
					filter: (container) => {
						return (container.structureType == STRUCTURE_CONTAINER)
							&& container.store[RESOURCE_ENERGY] > 0;
					}
				});
			}
			if(stores.length > 0) {
				//creep.say('pick up');
				if(creep.withdraw(stores[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(stores[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}else{
				let sources = creep.room.find(FIND_SOURCES);
				//creep.say('⛏');
				if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
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
        let t3bodyParts = [WORK,WORK,CARRY,CARRY,MOVE];
        if(Memory.tier.level >= 3 && tasks.bodyCost(t3bodyParts) <= spawner.room.energyAvailableSum){
            bodyParts = t3bodyParts;
        }
        //Spawn
        if(spawner.spawnCreep(bodyParts, newName,{memory: {role: roleName, source: src, ver: version, job : '⚒ harvest', begin : Game.time}}) >= 0){
            console.log('Spawning new ' + roleName + ' ' + newName + " for the cost of " + tasks.bodyCost(bodyParts));
        }
    }
};

module.exports = roleUpgrader;