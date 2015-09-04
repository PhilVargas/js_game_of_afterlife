class Pathfinder {
  static arePositionsEqual(position1, position2){
    return position1.x === position2.x && position1.y === position2.y;
  }

  static moveTowards(currentPosition, friendlyLocation, speed){
    let deltaY, deltaX, length;

    deltaY = friendlyLocation.y - currentPosition.y;
    deltaX = friendlyLocation.x - currentPosition.x;
    length = this.distanceTo(friendlyLocation, currentPosition);
    if (speed !== 0 && length < speed){
      return friendlyLocation;
    } else {
      return {
        x: (currentPosition.x + (deltaX / length * speed)),
        y: (currentPosition.y + (deltaY / length * speed))
      };
    }
  }

  static moveAwayFrom(currentPosition, hostileLocation, speed){
    return this.moveTowards(currentPosition, hostileLocation, -speed);
  }

  static movePerpendicularTo(currentPosition, friendlyLocation, speed){
    let deltaY, deltaX, length;

    deltaY = friendlyLocation.y - currentPosition.y;
    deltaX = friendlyLocation.x - currentPosition.x;
    length = this.distanceTo(friendlyLocation, currentPosition);
    if (speed !== 0 && length < speed){
      return friendlyLocation;
    } else {
      return {
        x: (currentPosition.x + (deltaX / length * speed)),
        y: (currentPosition.y - (deltaY / length * speed))
      };
    }
  }

  static distanceTo(targetLocation, currentPosition){
    let deltaY, deltaX;

    deltaY = targetLocation.y - currentPosition.y;
    deltaX = targetLocation.x - currentPosition.x;
    return Math.sqrt(Math.pow(deltaY, 2) + Math.pow(deltaX, 2));
  }

  static moveRandomly(currentPosition, speed){
    let angle;

    angle = Math.random() * 2 * Math.PI;
    return {
      x: (currentPosition.x + Math.cos(angle) * speed),
      y: (currentPosition.y + Math.sin(angle) * speed)
    };
  }
}

module.exports = Pathfinder;
