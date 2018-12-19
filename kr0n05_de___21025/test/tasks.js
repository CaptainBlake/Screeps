/*
 * Task implements letious Jobs which can be done frequently
 */

let tasks = {

    //Roadplan
    roadPlan: function() {
        this.roadToController();
        this.roadToSource(); 
        this.roadToMineral();
    },
    
    roadToMineral: function(){
        //toBeImplementet.exe
    },
    
    roadToSource: function() {
        for(let j = 0; j < Game.spawns['Spawn1'].room.find(FIND_SOURCES).length; j++){
            let pathToNodes = Game.spawns['Spawn1'].room.findPath(Game.spawns['Spawn1'].pos, Game.spawns['Spawn1'].room.find(FIND_SOURCES)[j].pos, {ignoreCreeps: true, swampCost: 2});
            for(let i = 0; i<pathToNodes.length-1; i++){
                Game.spawns['Spawn1'].room.createConstructionSite(
                    pathToNodes[i].x,
                    pathToNodes[i].y,
                    STRUCTURE_ROAD);
            }
        }
    },
    
    roadToController: function() {
         let pathToController = Game.spawns['Spawn1'].room.findPath(Game.spawns['Spawn1'].pos, Game.spawns['Spawn1'].room.controller.pos, {ignoreCreeps: true, swampCost: 2});
        for(let i = 0; i<pathToController.length-1; i++){
            Game.spawns['Spawn1'].room.createConstructionSite(
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