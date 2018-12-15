
var rolePlanner = {

    /** @param {Creep} creep **/
    run: function(creep) {

            if(creep.memory.planToCon) {
                creep.moveTo(creep.room.controller, {reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
                Game.spawns['Spawn1'].room.createConstructionSite(
                    creep.pos.x,
                    creep.pos.y,
                    STRUCTURE_ROAD);
            }
        }
    };

module.exports = rolePlanner;