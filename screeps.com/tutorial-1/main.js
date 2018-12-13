module.exports.loop = function () {
   var roleHarvester = require('role.harvester');
    if(Game.spawns['Spawn1'].energy > 10){
        Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester' );
    }
module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleHarvester.run(creep);
    }
}
}

