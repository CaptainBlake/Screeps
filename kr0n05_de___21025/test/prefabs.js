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
    }

};

module.exports = prefabs;