var Humanoid = function(attributes){
  this.position = attributes.position || {'x': (5+ Math.floor(Math.random()*591)),'y': (5+ Math.floor(Math.random()*391))};
  this.speed = attributes.speed;
  this.humanType = attributes.humanType; 
  this.timeSinceInfection = 0;
  this.lastPosition = {'x': this.position.x, 'y': this.position.y};
}

Humanoid.prototype = {
  isAttractedTo: function(nearestObject){
    return nearestObject.humanType === 'human';
  },

  storeLastPosition: function(){
    this.lastPosition = {'x': this.position.x, 'y': this.position.y};
  },

  isLastMoveRepeated: function(potentialMove){
    return ((Math.abs(potentialMove.x - this.lastPosition.x) < gameSettings.repitionTolerance) && (Math.abs(potentialMove.y - this.lastPosition.y) < gameSettings.repitionTolerance));
  },

  getBitten: function(){
    this.humanType = 'infectedHuman'
    this.speed = 0
  },

  bite: function(human){
    if ( human && (Pathfinder.distanceTo( human.position, this.position ) < 10) ){
      human.getBitten();
    }
  },

  turnToZombie: function(){
    this.humanType = 'zombie'
    this.speed = gameSettings.zombieSpeed
  },

  isAbleToBite: function(){
    return this.humanType === 'zombie';
  },

  incrementTimeSinceInfection: function(){
    this.timeSinceInfection ++;
    if (this.timeSinceInfection === 5){
      this.turnToZombie();
    }
  },

  moveNearest: function(nearestObject){
    var potentialMove;
    if (this.isAttractedTo(nearestObject)){
      potentialMove = Pathfinder.moveTowards(this.position, nearestObject.position, this.speed)
    } else {
      potentialMove = Pathfinder.moveAwayFrom(this.position, nearestObject.position, this.speed)
    }
    if (this.lastPosition.x === this.position.x && this.lastPosition.y === this.position.y){
      this.storeLastPosition();
      return Pathfinder.moveRandomly(this.position, this.speed);
    } else if (this.isLastMoveRepeated(potentialMove)){
      this.storeLastPosition();
      return Pathfinder.movePerpendicularTo(this.position, nearestObject.position, this.speed)
    } else {
      this.storeLastPosition();
      return potentialMove
    }
  },
}