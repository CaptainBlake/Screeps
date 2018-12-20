/*
 * Task implements letious (<<- LOL) Jobs which can be done frequently
 */

let tasks = {

    //Roadplan
    roadPlan: function() {
        this.roadToController(Game.spawns['Spawn1']);
        this.roadToSource(Game.spawns['Spawn1']); 
        this.roadToMineral(Game.spawns['Spawn1']);
    },
    
    roadToMineral: function(Spawner){
        //toBeImplementet.exe

        for(let j = 0; j < Spawner.room.find(FIND_MINERALS).length; j++){
            let pathToNodes = Spawner.room.findPath(Spawner.pos, Spawner.room.find(FIND_MINERALS)[j].pos, {ignoreCreeps: true, swampCost: 2});
            for(let i = 0; i < pathToNodes.length - 1; i++)
            {
                Spawner.room.createConstructionSite(
                    pathToNodes[i].x,
                    pathToNodes[i].y,
                    STRUCTURE_ROAD);
            }
        }
    },
    
    roadToSource: function(Spawner) {
        for(let j = 0; j < Spawner.room.find(FIND_SOURCES).length; j++){
            let pathToNodes = Spawner.room.findPath(Spawner.pos, Spawner.room.find(FIND_SOURCES)[j].pos, {ignoreCreeps: true, swampCost: 2});
            for(let i = 0; i<pathToNodes.length-1; i++){
                Spawner.room.createConstructionSite(
                    pathToNodes[i].x,
                    pathToNodes[i].y,
                    STRUCTURE_ROAD);
            }
        }
    },
    
    roadToController: function(Spawner) {
         let pathToController = Spawner.room.findPath(Spawner.pos, Spawner.room.controller.pos, {ignoreCreeps: true, swampCost: 2});
        for(let i = 0; i<pathToController.length-1; i++){
            Spawner.room.createConstructionSite(
                pathToController[i].x,
                pathToController[i].y,
                STRUCTURE_ROAD);
        }
    },

    //Wallplan
    wallPlan: function () {
        //insert smart code here
    },

    //Cost-function
    bodyCost: function(body) {
        return body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part];
        }, 0);
    },
};

module.exports = tasks;