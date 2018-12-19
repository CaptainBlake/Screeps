let tasks = require('tasks');
let roleName = "Carrier";
let bodyParts = [CARRY,CARRY,MOVE,MOVE];
let roleCarrier = {

    run: function(creep){
        //creepfunction
    },

    //Spawn function
    spawn: function(spawner, version) {
        //Constructor
        let newName = roleName + Game.time;
        //Tier-Stages
        let t3bodyParts = [CARRY,CARRY,CARRY,CARRY,MOVE];
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