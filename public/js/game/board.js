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
    this.width = attributes.width  || '600px';
    this.height = attributes.height || '400px';
  }

  isGameActive(){
    let activeStatus = false;
    for (let i = 0; i < this.humanoids.length; i++){
      if (this.humanoids[i].humanType === 'human' || this.humanoids[i].humanType === 'player'){
        activeStatus = true;
        break;
      }
    }
    return activeStatus;
  }

  isPlayerAlive(){
    let activeStatus = false;
    for (let i = 0; i < this.humanoids.length; i++){
      if (this.humanoids[i].humanType === 'player'){
        activeStatus = true;
        break;
      }
    }
    return activeStatus;
  }

  isPositionEqual( position1, position2 ){
    return position1.x === position2.x && position1.y === position2.y;
  }

  isValidDestination( targetPosition ){
    let result = true;
    for(let i= 0; i < this.humanoids.length; i++ ){
      if( this.isPositionEqual( this.humanoids[i].position , targetPosition ) ){
        result = false;
        break;
      }
    }
    return result;
  }

  nearestHumanoid( humanoidType ){
    let similarHumanoids, closestPos, closestHumanoid;
    similarHumanoids = this.findSimilarHumanoids( humanoidType );
    closestPos = this.findClosestPos( similarHumanoids );
    closestHumanoid = this.findClosestHumanoid( closestPos, similarHumanoids );
    return closestHumanoid;
  }

  isAnyHumanRemaining(){
    let result = false;
    for( let i=0; i < this.humanoids.length; i++ ){
      if(this.humanoids[i].humanType === 'human'  || this.humanoids[i].humanType === 'player') {
        result = true;
        break;
      }
    }
    return result;
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
        coords.x = ( (coords.x + this.width) % this.width );
        coords.y = ( (coords.y + this.height) % this.height );
        this.humanoid.position = coords;
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
    this.incrementStore(player);
  }

  incrementStore(player){
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
    zombieDistance = Pathfinder.distanceTo( nearestZombie.position, this.humanoid.position ) * gameSettings.zombieSpread
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

  deleteSelfHumanoid(){
    let otherHumanoids = [];
    for( let i=0; i < this.humanoids.length; i++){otherHumanoids.push(this.humanoids[i]);}

    for( let i=0; i < this.humanoids.length; i++ ){
      if( this.isPositionEqual( this.humanoids[i].position , this.humanoid.position ) ){
        otherHumanoids.splice( i, 1 );
        break;
      }
    }
    return otherHumanoids;
  }

  findSimilarHumanoids( humanoidType ){
    let otherHumanoids, similar;
    otherHumanoids = this.deleteSelfHumanoid();
    similar = [];
    for( let i=0; i< otherHumanoids.length; i++ ){
      if( otherHumanoids[i].humanType === humanoidType ){ similar.push(otherHumanoids[i]);}
    }
    return similar;
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
