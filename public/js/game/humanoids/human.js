let Pathfinder, gameSettings, Humanoid, InfectedHuman;

gameSettings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
InfectedHuman = require('humanoids/infectedHuman');

class Human extends Humanoid {
  constructor(opts) {
    super(opts);
    this.speed = gameSettings.humanSpeed;
  }

  isAbleToBite() {
    return false;
  }

  transform() {
    return(
      new InfectedHuman(this.cloneProps())
    );
  }

  handleNextMove(opts){
    let destination;
    let { nearestHuman, nearestZombie, player, humanoids, getRelativePosition} = opts;
    // TODO extract get relative position to pathfinder, use settings for board width/height
    destination = getRelativePosition(
      this.getNextDestination(nearestHuman, nearestZombie, player)
    );
    if ( this.isValidDestination(humanoids, destination) ) {
      this.position = destination;
    }
  }

  isValidDestination(humanoids, targetPosition) {
    return !humanoids.some((humanoid) => {
      // TODO extract this comparison out to pathfinder
      return humanoid.position.x === targetPosition.x && humanoid.position.y === targetPosition.y;
    });
  }

  getNextDestination(nearestHuman, nearestZombie, player){
    let playerDistance, humanDistance, zombieDistance;
    playerDistance = Number.POSITIVE_INFINITY;
    humanDistance = Number.POSITIVE_INFINITY;
    zombieDistance = Pathfinder.distanceTo( nearestZombie.position, this.position );
    if (player){
      playerDistance = Pathfinder.distanceTo( player.position, this.position );
    }
    if (nearestHuman){
      humanDistance = Pathfinder.distanceTo( nearestHuman.position, this.position );
    }

    if ( zombieDistance < gameSettings.humanFearRange || ( !player && !nearestHuman ) ){
      return this.moveNearest( nearestZombie );
    } else if ( playerDistance < humanDistance ){
      return this.moveNearest( player );
    } else {
      return this.moveNearest( nearestHuman );
    }
  }
}

module.exports = Human;
