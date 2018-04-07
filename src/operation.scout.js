Creep.prototype.scoutRoom = function () {
    if (this.room.name !== this.memory.targetRoom) return this.shibMove(new RoomPosition(25, 25, this.memory.targetRoom), {range: 23});
    this.room.cacheRoomIntel(true);
    let towers = _.filter(this.room.structures, (s) => s.structureType === STRUCTURE_TOWER);
    let controller = this.room.controller;
    if (controller.owner && controller.safeMode) {
        let cache = Memory.targetRooms || {};
        let tick = Game.time;
        cache[Game.flags[name].pos.roomName] = {
            tick: tick,
            type: 'pending',
            dDay: tick + this.room.controller.safeMode,
        };
        Memory.targetRooms = cache;
        return this.suicide();
    } else if (controller.owner && (!towers.length || _.max(towers, 'energy').energy === 0)) {
        let cache = Memory.targetRooms || {};
        let tick = Game.time;
        cache[this.pos.roomName] = {
            tick: tick,
            type: 'clean',
            level: 2,
            escort: true
        };
        Memory.targetRooms = cache;
        return this.suicide();
    } else if (controller.owner && towers.length) {
        let cache = Memory.targetRooms || {};
        let tick = Game.time;
        let level = _.round((towers.length / 3) + 0.5);
        if (level > 1 && Memory.targetRooms[this.pos.roomName].local) {
            delete Memory.targetRooms[this.pos.roomName];
            return this.suicide();
        }
        cache[this.pos.roomName] = {
            tick: tick,
            type: 'siege',
            level: level
        };
        Memory.targetRooms = cache;
        return this.suicide();
    } else if (!controller.owner && (!this.room.structures.length || this.room.structures.length < 3)) {
        let cache = Memory.targetRooms || {};
        let tick = Game.time;
        cache[this.pos.roomName] = {
            tick: tick,
            type: 'harass',
            level: 1
        };
        Memory.targetRooms = cache;
        return this.suicide();
    } else if (!controller.owner && this.room.structures.length > 2) {
        let cache = Memory.targetRooms || {};
        let tick = Game.time;
        cache[this.pos.roomName] = {
            tick: tick,
            type: 'clean',
            level: 1
        };
        Memory.targetRooms = cache;
        return this.suicide();
    }
    delete this.memory.targetRoom;
    this.memory.role = 'explorer';
};