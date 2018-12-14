
var roleUpgrader = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if(creep.memory.upgrading && creep.carry.energy == 0) {
			creep.memory.upgrading = false;
			creep.say('🔄 harvest');
		}
		if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
			creep.memory.upgrading = true;
			creep.say('⚡ upgrade');
		}

		if(creep.memory.upgrading) {
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
		else {
			var stores = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION)
							 && structure.energy != 0;
				}
			});
			if(stores.length > 0) {
				creep.say('pick up');
				if(creep.getEnergyFromStorage() == ERR_NOT_IN_RANGE) {
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
	}
};

module.exports = roleUpgrader;