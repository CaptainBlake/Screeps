/*
 * Task implements letious (<<- LOL) Jobs which can be done frequently
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
    //Repair-Script 2.0
    repair: function(creep){
        /*
            *  Repair function 2.0
            *  -> Creep searches for targets via filter-rule
            *  -> Copy of ID to creep memory
            *  -> Seek and repair via "GetObjectByID(Target)"
            *  ->repairs till own condition fails (till max HP in this case)
            *  -> gets new target or switches roles
            *
            *  Known Bugs: Sometimes it seems to loop in the inner-repair function. Maybe wrong Memory conditions? IDK
            */

        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax - object.hitsMax/2
        });

        if(creep.memory.target != null){
            let MemoryTarget = Game.getObjectById(creep.memory.target);
            if(MemoryTarget != undefined){
                if(MemoryTarget.hits < MemoryTarget.hitsMax) {
                    //repair till maxHP
                    if (creep.repair(MemoryTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(MemoryTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                        //make it easier to see where the janitor is going (debug purpose for target prio)
                        Game.spawns['Spawn1'].room.visual.circle(
                            creep.memory._move.dest.x,
                            creep.memory._move.dest.y);
                    }
                }else{
                    creep.memory.target = null;
                }
            }
        }else{
            if(target != null){
                creep.memory.target = target.id;
            }else{
                creep.memory.repairing = false;
            }
        }
    },
};

module.exports = tasks;