var roleName = "upgrader";
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
	},
    spawn: function(spawner, version) {
        //Constructor
        var newName = roleName + Game.time;
        var srcs = spawner.room.find(FIND_SOURCES);
        if(Game.creeps.length > 0){
            var src = (Game.creeps[Game.creeps.length-1].memory.source + 1)%srcs.length;
        }else{
            var src = 0;
        }
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

module.exports = roleUpgrader;