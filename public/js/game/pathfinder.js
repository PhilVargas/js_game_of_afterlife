let Pathfinder = {
  moveTowards: function(currentPosition, friendlyLocation, speed){
    let deltaY, deltaX, length;
    deltaY = friendlyLocation.y - currentPosition.y;
    deltaX = friendlyLocation.x - currentPosition.x;
    length = Pathfinder.distanceTo(friendlyLocation, currentPosition);
    if (speed !== 0 && length < speed){
      return friendlyLocation
    } else {
      return {
        x: (currentPosition.x + (deltaX / length * speed)),
        y: (currentPosition.y + (deltaY / length * speed))
      }
    }
  },

  moveAwayFrom: function(currentPosition, hostileLocation, speed){
    return Pathfinder.moveTowards(currentPosition, hostileLocation, -speed);
  },

  movePerpendicularTo: function(currentPosition, friendlyLocation, speed){
    let deltaY, deltaX, length;
    deltaY = friendlyLocation.y - currentPosition.y;
    deltaX = friendlyLocation.x - currentPosition.x;
    length = Pathfinder.distanceTo(friendlyLocation, currentPosition);
    if (speed !== 0 && length < speed){
      return friendlyLocation
    } else {
      return {
        x: (currentPosition.x + (deltaX / length * speed)),
        y: (currentPosition.y - (deltaY / length * speed))
      }
    }
  },

  distanceTo: function(targetLocation, currentPosition){
    let deltaY, deltaX;
    deltaY = targetLocation.y - currentPosition.y;
    deltaX = targetLocation.x - currentPosition.x;
    return Math.sqrt(Math.pow(deltaY,2) + Math.pow(deltaX,2))
  },

  moveRandomly: function(currentPosition, speed){
    let angle;
    angle = Math.random() * 2 * Math.PI;
      return {
        x: (currentPosition.x + Math.cos(angle) * speed),
        y: (currentPosition.y + Math.sin(angle) * speed)
      }
  },
}

module.exports = Pathfinder
