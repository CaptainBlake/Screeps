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
    }
};

module.exports = prefabs;