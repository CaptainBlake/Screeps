var tasks = require('tasks');
var roleName = "Carrier";
var bodyParts = [CARRY,CARRY,MOVE,MOVE];
var roleCarrier = {

    run: function(creep){
        //creepfunction
    },

    //Spawn function
    spawn: function(spawner, version) {
        //Constructor
        var newName = roleName + Game.time;
        //Tier-Stages
        var t3bodyParts = [CARRY,CARRY,CARRY,CARRY,MOVE];
        if(Memory.tier.level >= 3 && tasks.bodyCost(t3bodyParts) <= Game.spawns['Spawn1'].room.energyAvailableSum){
            bodyParts = t3bodyParts;
        }

        //Spawn
        if(spawner.spawnCreep(bodyParts, newName,{memory: {role: roleName, ver: version, job : '⚒ carry', begin : Game.time}}) >= 0){
            console.log('Spawning new ' + roleName + ' ' + newName + " for the cost of " + tasks.bodyCost(bodyParts));

        }
    }
};

module.exports = roleCarrier;