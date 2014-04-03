var Humanoid = function(attributes){
this.position = attributes.position || {'x': (5+ Math.floor(Math.random()*591)),'y': (5+ Math.floor(Math.random()*391))};
  this.speed = attributes.speed;
  this.humanType = attributes.humanType; //may be removed in favor of class inheritence
  this.timeSinceInfection = 0 // time since infection may be moved to infected zombie class
  this.lastPosition = {'x': this.position.x, 'y': this.position.y}
}

Humanoid.prototype = {
  isAttractedTo: function(nearestObject){
    return nearestObject.humanType === 'human';
    // nearestObject instanceOf Human
  },

  storeLastPosition: function(){
    this.lastPosition = {'x': this.position.x, 'y': this.position.y};
  },

  isLastMoveRepeated: function(potentialMove){
    return ((Math.abs(potentialMove.x - this.lastPosition.x) < 5) && (Math.abs(potentialMove.y - this.lastPosition.y)) < 5);
  },

  getBitten: function(){
    this.humanType = 'infectedHuman'
    //this.__proto__ = InfectedHuman.prototype
    this.speed = 0
  },

  bite: function(humanoid){
    if (humanoid.humanType === 'human'){
    // if (humanoid instanceOf Human){
      humanoid.getBitten();
    }
  },

  turnToZombie: function(){
    this.humanType = 'zombie'
    // this.__proto__ = Zombie.prototype
    this.speed = 5
  },

  isAbleToBite: function(){
    return this.humanType === 'zombie';
    // return this instanceOf Zombie
  },

  incrementTimeSinceInfection: function(){
    this.timeSinceInfection ++;
    if (this.timeSinceInfection === 5){
      this.turnToZombie();
    }
  },

  moveNearest: function(nearestObject){
    if (this.isAttractedTo()){
      var potentialMove = Pathfinder.moveTowards(this.position, nearestObject.position, this.speed)
    } else {
      var potentialMove = Pathfinder.moveAwayFrom(this.position, nearestObject.position, this.speed)
    }

    if (this.lastPosition.x === this.position.x && this.lastPosition.y === this.position.y){
      this.storeLastPosition();
      return Pathfinder.moveRandomly(this.position, this.speed);
    } else if (this.isLastMoveRepeated(potentialMove)){
      this.storeLastPosition();
      return Pathfinder.movePerpendicularTo(nearestObject.position, this.position, this.speed)
    } else {
      this.storeLastPosition();
      return potentialMove
    }
  },
}