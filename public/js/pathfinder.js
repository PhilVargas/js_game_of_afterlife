var Pathfinder = {
  moveTowards: function(friendlyLocation, currentPosition, speed){
    var deltaY = location.y - currentPosition.y;
    var deltaX = location.x - currentPosition.x;
    var length = distanceTo(friendlyLocation);
    if (speed > 0 && length < speed){
      return friendlyLocation
    } else {
      return {'x': ((position.x + deltaX)/length * speed),'y': ((position.y + deltaY)/length * speed)}
    }
  },

  movePerpendicularTo: function(location, currentPosition, speed){
    var deltaY = location.y - currentPosition.y;
    var deltaX = location.x - currentPosition.x;
    var length = distanceTo(friendlyLocation);
    if (speed > 0 && length < speed){
      return friendlyLocation
    } else {
      return {'x': ((position.x + deltaX)/length * speed),'y': ((position.y - deltaY)/length * speed)}
    }
  },

  moveAwayFrom: function(currentPosition, hostileLocation, speed){
    moveTowards(currentPosition, hostileLocation, -speed);
  },

  distanceTo: function(targetLocation, currentPosition){
    var deltaY = targetLocation.y - currentPosition.y;
    var deltaX = targetLocation.x - currentPosition.x;
    return Math.pow(deltaY,2) + Math.pow(deltaX,2)
  },

  moveRandomly: function(currentPosition, speed){
    angle = Math.random() * 2 * Math.PI;
      return {'x': (currentPosition.x + Math.cos(angle) * speed),'y': (currentPosition.y + Math.sin(angle) * speed)}
  },
}