let Pathfinder, Settings;

Pathfinder = require('pathfinder');
Settings = require('settings');

class Humanoid {
  constructor(attributes){
    this.id = attributes.id;
    this.position = attributes.position ||
      { x: (5 + Math.floor(Math.random() * 591)), y: (5 + Math.floor(Math.random() * 391)) };
    this.lastPosition = { x: this.position.x, y: this.position.y };
    this.humanType = this.constructor.name;
  }

  isZombie(){
    return this.humanType === 'Zombie';
  }

  isPlayer(){
    return this.humanType === 'Player';
  }

  isHuman(){
    return this.humanType === 'Human';
  }

  cloneProps() {
    return {
      id: this.id,
      position: this.position,
      lastPosition: this.lastPosition
    };
  }

  isAttractedTo(nearestHumanoid){
    return nearestHumanoid.isPlayer() || nearestHumanoid.isHuman();
  }

  storeLastPosition(){
    this.lastPosition = { x: this.position.x, y: this.position.y };
  }

  isLastMoveRepeated(potentialMove){
    return (
      (Math.abs(potentialMove.x - this.lastPosition.x) < Settings.repitionTolerance) &&
        (Math.abs(potentialMove.y - this.lastPosition.y) < Settings.repitionTolerance)
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
