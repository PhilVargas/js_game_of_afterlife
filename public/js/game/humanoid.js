let Pathfinder, gameSettings;

Pathfinder = require('pathfinder');
gameSettings = require('settings');

class Humanoid {
  constructor(attributes){
    this.id = attributes.id;
    this.position = attributes.position ||
      { x: (5+ Math.floor(Math.random()*591)), y: (5+ Math.floor(Math.random()*391)) };
    this.lastPosition = { x: this.position.x, y: this.position.y };
  }

  cloneProps() {
    return {
      id: this.id,
      position: this.position,
      lastPosition: this.lastPosition
    };
  }

  isAttractedTo(nearestObject){
    return nearestObject.humanType === 'human' || nearestObject.humanType === 'player';
  }

  storeLastPosition(){
    this.lastPosition = {x: this.position.x, y: this.position.y};
  }

  isLastMoveRepeated(potentialMove){
    return (
      (Math.abs(potentialMove.x - this.lastPosition.x) < gameSettings.repitionTolerance) &&
        (Math.abs(potentialMove.y - this.lastPosition.y) < gameSettings.repitionTolerance)
    );
  }

  moveNearest(nearestObject){
    let potentialMove;
    if (this.isAttractedTo(nearestObject)){
      potentialMove = Pathfinder.moveTowards(this.position, nearestObject.position, this.speed);
    } else {
      potentialMove = Pathfinder.moveAwayFrom(this.position, nearestObject.position, this.speed);
    }
    if (this.lastPosition.x === this.position.x && this.lastPosition.y === this.position.y){
      this.storeLastPosition();
      return Pathfinder.moveRandomly(this.position, this.speed);
    } else if (this.isLastMoveRepeated(potentialMove)){
      this.storeLastPosition();
      return Pathfinder.movePerpendicularTo(this.position, nearestObject.position, this.speed);
    } else {
      this.storeLastPosition();
      return potentialMove;
    }
  }
}

module.exports = Humanoid;
