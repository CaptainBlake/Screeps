/*
 * [EXPERIMENTAL]
 * Planer runs to a specific position and keeps placing Road-Constructionsites on the way.
 */
var bodyParts = [WORK,CARRY,MOVE];
var rolePlanner = {

    /** @param {Creep} creep **/
    run: function(creep) {

            if(creep.memory.planToCon == true) {
                creep.moveTo(creep.room.controller, {reusePath: 50, visualizePathStyle: {stroke: '#ffffff'}});
                creep.say('✏');
                Game.spawns['Spawn1'].room.createConstructionSite(
                    creep.pos.x,
                    creep.pos.y,
                    STRUCTURE_ROAD);
            }
        }
    };

module.exports = rolePlanner;