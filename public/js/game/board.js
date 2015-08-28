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
      if( this.humanoid.humanType === 'infectedHuman' ){
        this.humanoid.incrementTimeSinceInfection();
        continue;
      }
      if( this.humanoid.humanType === 'player' ){
        let targetLoc, coords;
        targetLoc = {
          x: this.humanoid.position.x + this.dx*this.humanoid.speed,
          y: this.humanoid.position.y + this.dy*this.humanoid.speed
        };
        coords = ( Pathfinder.moveTowards(this.humanoid.position, targetLoc, this.humanoid.speed) );
        this.humanoid.position = this.getRelativePosition(coords);
        continue;
      }
      let nearestHuman, nearestZombie, destination;
      nearestZombie = this.nearestHumanoid( 'zombie' );
      nearestHuman = this.nearestHumanoid( 'human' );
      player = this.nearestHumanoid( 'player' );
      destination = this.setDestination( nearestHuman, nearestZombie, player );
      destination.x = ( (destination.x + this.width) % this.width );
      destination.y = ( (destination.y + this.height) % this.height );

      if ( this.humanoid.isAbleToBite( player ) ){
        this.humanoid.bite( player );
      }

      if ( this.humanoid.isAbleToBite( nearestHuman ) ){
        this.humanoid.bite( nearestHuman );
      }

      if( this.isValidDestination( destination ) ){
        this.humanoid.position = destination;
      }
    }
    this.incrementScore(player);
  }

  getRelativePosition(position) {
    let x,y;
    x = ( (position.x + this.width) % this.width );
    y = ( (position.y + this.height) % this.height );
    return {x, y};
  }

  incrementScore(player){
    if (player && player.humanType === 'player'){ this.score += 10; }
  }

  setDestination( nearestHuman, nearestZombie, player ){
    if( this.humanoid.humanType === 'zombie' ){
      return this.setZombieDestination( nearestHuman, nearestZombie, player );
    }
    else if( this.humanoid.humanType === 'human' ){
      return this.setHumanDestination( nearestHuman, nearestZombie, player );
    }
    else { return this.humanoid.position; }
  }

  setZombieDestination( nearestHuman, nearestZombie, player ){
    let playerDistance, humanDistance, zombieDistance;
    playerDistance = Number.POSITIVE_INFINITY;
    humanDistance = Number.POSITIVE_INFINITY;
    zombieDistance = Number.POSITIVE_INFINITY;
    if (nearestZombie){
      zombieDistance = (
        Pathfinder.distanceTo( nearestZombie.position, this.humanoid.position ) *
        gameSettings.zombieSpread
      );
    }
    if (player){
      playerDistance = Pathfinder.distanceTo( player.position, this.humanoid.position );
    }
    if (nearestHuman){
      humanDistance = Pathfinder.distanceTo( nearestHuman.position, this.humanoid.position );
    }

    if ( playerDistance < humanDistance ){
      if ( playerDistance < zombieDistance ){
        return this.humanoid.moveNearest( player );
      } else {
        return this.humanoid.moveNearest( nearestZombie );
      }
    } else if ( humanDistance < zombieDistance ){
      return this.humanoid.moveNearest( nearestHuman );
    } else {
      return this.humanoid.moveNearest( nearestZombie );
    }
  }

  setHumanDestination( nearestHuman, nearestZombie, player ){
    let playerDistance, humanDistance, zombieDistance;
    playerDistance = Number.POSITIVE_INFINITY;
    humanDistance = Number.POSITIVE_INFINITY;
    zombieDistance = Pathfinder.distanceTo( nearestZombie.position, this.humanoid.position );
    if (player){
      playerDistance = Pathfinder.distanceTo( player.position, this.humanoid.position );
    }
    if (nearestHuman){
      humanDistance = Pathfinder.distanceTo( nearestHuman.position, this.humanoid.position );
    }

    if ( zombieDistance < gameSettings.humanFearRange || ( !player && !nearestHuman ) ){
      return this.humanoid.moveNearest( nearestZombie );
    } else if ( playerDistance < humanDistance ){
      return this.humanoid.moveNearest( player );
    } else {
      return this.humanoid.moveNearest( nearestHuman );
    }
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
