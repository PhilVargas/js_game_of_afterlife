let Pathfinder, gameSettings;

Pathfinder = require('pathfinder');
gameSettings = require('settings');

class Board {
  constructor( attributes ){
    this.humanoid = null;
    this.score = 0;
    this.dx = 0;
    this.dy = 0;
    this.humanoids = attributes.humanoids || [];
    this.width = attributes.width  || 600;
    this.height = attributes.height || 400;
  }

  isGameActive(){
    return this.humanoids.some(function(humanoid) {
      return humanoid.humanType === 'human' || humanoid.humanType === 'player';
    });
  }

  isPlayerAlive(){
    return this.humanoids.some(function(humanoid) {
      return humanoid.humanType === 'player';
    });
  }

  isPositionEqual( position1, position2 ){
    return position1.x === position2.x && position1.y === position2.y;
  }

  isValidDestination( targetPosition ){
    return !this.humanoids.some((humanoid) => {
      return this.isPositionEqual(humanoid.position, targetPosition);
    });
  }

  nearestHumanoid( humanoidType ){
    let similarHumanoids, closestPos, closestHumanoid;
    similarHumanoids = this.findSimilarHumanoids( humanoidType );
    closestPos = this.findClosestPos( similarHumanoids );
    closestHumanoid = this.findClosestHumanoid( closestPos, similarHumanoids );
    return closestHumanoid;
  }

  nextTurn(){
    let player;
    for( let i=0; i< this.humanoids.length; i++ ){
      this.humanoid = this.humanoids[i];
      this.humanoid.handleNextMove({
        nearestHuman: this.nearestHumanoid('human'),
        nearestZombie: this.nearestHumanoid('zombie'),
        player: this.nearestHumanoid('player'),
        dx: this.dx,
        dy: this.dy,
        humanoids: this.humanoids,
        getRelativePosition: this.getRelativePosition.bind(this)
      });
    }
    this.incrementScore();
  }

  getRelativePosition(position) {
    let x,y;
    x = ( (position.x + this.width) % this.width );
    y = ( (position.y + this.height) % this.height );
    return {x, y};
  }

  incrementScore(){
    if (this.isPlayerAlive()){ this.score += 10; }
  }

  otherHumanoids(){
    return this.humanoids.filter((currentHumanoid) => {
      return this.humanoid.id !== currentHumanoid.id;
    });
  }

  findSimilarHumanoids( humanoidType ){
    return this.otherHumanoids().filter(function(humanoid){
      return humanoid.humanType === humanoidType;
    });
  }

  findClosestPos( otherHumanoids ){
    let closestPos, dist;
    closestPos = [];
    for( let i=0; i< otherHumanoids.length; i++ ){
      dist = Pathfinder.distanceTo( otherHumanoids[i].position, this.humanoid.position );
      closestPos.push( dist );
    }
    return closestPos;
  }

  findClosestHumanoid( closestPos, otherHumanoids ){
    let closestHumanoidValue, closestHumanoid;
    closestHumanoidValue = Math.min.apply( null, closestPos );
    for( let i=0; i < closestPos.length; i++ ){
      if( closestPos[i] === closestHumanoidValue ){ closestHumanoid = otherHumanoids[i];}
    }
    return closestHumanoid;
  }
}

module.exports = Board;
