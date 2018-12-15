/*
 * Task implements various Jobs which can be done frequently,
 */

var tasks = {
    roadPlan: function() {
        var pathToController = Game.spawns['Spawn1'].room.findPath(Game.spawns['Spawn1'].pos, Game.spawns['Spawn1'].room.controller.pos, {ignoreCreeps: true, swampCost: 2});
        for(var j = 0; j < Game.spawns['Spawn1'].room.find(FIND_SOURCES).length; j++){
            var pathToNode1 = Game.spawns['Spawn1'].room.findPath(Game.spawns['Spawn1'].pos, Game.spawns['Spawn1'].room.find(FIND_SOURCES)[j].pos, {ignoreCreeps: true, swampCost: 2});
            for(var i = 0; i<pathToNode1.length-1; i++){
                Game.spawns['Spawn1'].room.createConstructionSite(
                    pathToNode1[i].x,
                    pathToNode1[i].y,
                    STRUCTURE_ROAD);
            }
        }
    },
    
    wallPlan: function () {
        //insert smart code here
    }
};

module.exports = tasks;