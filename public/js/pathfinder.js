var Pathfinder = {
  moveTowards: function(currentPosition, friendlyLocation, speed){
    var deltaY = friendlyLocation.y - currentPosition.y;
    var deltaX = friendlyLocation.x - currentPosition.x;
    var length = Pathfinder.distanceTo(friendlyLocation, currentPosition);
    if (speed !== 0 && length < speed){
      return friendlyLocation
    } else {
    return {'x': (currentPosition.x + (deltaX / length * speed)),'y': (currentPosition.y + (deltaY / length * speed))}
    }
  },

  playerMove: function(currentPosition, dx, dy, speed){
    return{ x: currentPosition.x + (dx * speed), y: currentPosition.y + ( dy * speed ) }
  },

  movePerpendicularTo: function(currentPosition, friendlyLocation, speed){
    var deltaY = friendlyLocation.y - currentPosition.y;
    var deltaX = friendlyLocation.x - currentPosition.x;
    var length = Pathfinder.distanceTo(friendlyLocation, currentPosition);
    if (speed !== 0 && length < speed){
      return friendlyLocation
    } else {
      return {'x': (currentPosition.x + (deltaX / length * speed)),'y': (currentPosition.y - (deltaY / length * speed))}
    }
  },

  moveAwayFrom: function(currentPosition, hostileLocation, speed){
    return Pathfinder.moveTowards(currentPosition, hostileLocation, -speed);
  },

  distanceTo: function(targetLocation, currentPosition){
    var deltaY = targetLocation.y - currentPosition.y;
    var deltaX = targetLocation.x - currentPosition.x;
    return Math.sqrt(Math.pow(deltaY,2) + Math.pow(deltaX,2))
  },

  moveRandomly: function(currentPosition, speed){
    angle = Math.random() * 2 * Math.PI;
      return {'x': (currentPosition.x + Math.cos(angle) * speed),'y': (currentPosition.y + Math.sin(angle) * speed)}
  },
}
