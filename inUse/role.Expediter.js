
let borderChecks = require('module.borderChecks');
var roleExpediter = {

    /** @param {Creep} creep **/
    run: function (creep) {
//BORDER CHECK
        if(borderChecks.isOnBorder(creep) === true){
            borderChecks.nextStepIntoRoom(creep);
        }
        if (rangeSource(creep) === 1) {
            creep.moveTo(Game.flags.bump, {reusePath: 20}, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
            return null;
        }
        if (rangeAssignment(creep) > 4) {
            var container = Game.getObjectById(creep.memory.assignedContainer);
            creep.moveTo(container);
            return null;
        }
        var energy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 8);
        if (energy) {
            if (creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(energy[0], {reusePath: 20}, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
            }
        }

        //Haul to container
        var container = Game.getObjectById(creep.memory.assignedContainer);
        if (container && creep.carry.energy === creep.carryCapacity) {
            if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {reusePath: 20}, {visualizePathStyle: {stroke: '#ffffff'}, maxRooms: 1});
            }
        }
    }

};

module.exports = roleExpediter;
/**
 * Created by rober on 5/15/2017.
 */

function rangeSource(creep) {
    var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (creep.pos.getRangeTo(source) === 1) {
        return 1;
    }
    return null;
}

function rangeAssignment(creep) {
    var container = Game.getObjectById(creep.memory.assignedContainer);
    var assignment = creep.pos.getRangeTo(container);
    if (assignment) {
        return assignment;
    }
    return null;
}
