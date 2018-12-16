/*
 * Prefabs
 */

var prefabs = {
    //The first TIER 2 Extention
    firstExtention: function(Spawner) {
        Spawner.room.createConstructionSite(
            Spawner.pos.x + 2,
            Spawner.pos.y - 2,
            STRUCTURE_EXTENSION);
        Spawner.room.createConstructionSite(
            Spawner.pos.x + 2,
            Spawner.pos.y + 2,
            STRUCTURE_EXTENSION);
        Spawner.room.createConstructionSite(
            Spawner.pos.x - 2,
            Spawner.pos.y - 2,
            STRUCTURE_EXTENSION);
        Spawner.room.createConstructionSite(
            Spawner.pos.x - 2,
            Spawner.pos.y + 2,
            STRUCTURE_EXTENSION);
        Spawner.room.createConstructionSite(
            Spawner.pos.x,
            Spawner.pos.y + 2,
            STRUCTURE_EXTENSION);
    },
    //The first TIER 3 Defence Tower
    firstDefence: function(Spawner) {
        Spawner.room.createConstructionSite(
            Spawner.pos.x,
            Spawner.pos.y - 4,
            STRUCTURE_TOWER);
    },
    //The second TIER 3 Extention
    secondExtention: function(Spawner) {
        /*
         *  implement prefab here
         *  + 5 extentions
         *  + 1-2 container near road
         */
         
        Spawner.room.createConstructionSite(
            Spawner.pos.x - 4,
            Spawner.pos.y + 1,
            STRUCTURE_EXTENSION);
        Spawner.room.createConstructionSite(
            Spawner.pos.x + 4,
            Spawner.pos.y + 1,
            STRUCTURE_EXTENSION);
        Spawner.room.createConstructionSite(
            Spawner.pos.x - 4,
            Spawner.pos.y - 1,
            STRUCTURE_EXTENSION);
        Spawner.room.createConstructionSite(
            Spawner.pos.x + 4,
            Spawner.pos.y - 1,
            STRUCTURE_EXTENSION);
        Spawner.room.createConstructionSite(
            Spawner.pos.x + 4,
            Spawner.pos.y,
            STRUCTURE_EXTENSION);
        Spawner.room.createConstructionSite(
            Spawner.pos.x - 4,
            Spawner.pos.y,
            STRUCTURE_EXTENSION);
        
        Spawner.room.createConstructionSite(
            Spawner.pos.x - 1,
            Spawner.pos.y,
            STRUCTURE_CONTAINER);
        Spawner.room.createConstructionSite(
            Spawner.pos.x + 1,
            Spawner.pos.y,
            STRUCTURE_CONTAINER);   
    }

};

module.exports = prefabs;