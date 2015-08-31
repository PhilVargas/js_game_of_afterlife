let Pathfinder, gameSettings, Humanoid, InfectedHuman;

gameSettings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
InfectedHuman = require('humanoids/infectedHuman');

class Zombie extends Humanoid {
  constructor(opts) {
    super(opts);
    this.speed = gameSettings.zombieSpeed;
  }

  isAbleToBite(human){
    return ( human && Pathfinder.distanceTo( human.position, this.position ) < 10);
  }

  transform() {
    return(
      new InfectedHuman(this.cloneProps())
    );
  }

  isValidDestination(humanoids, targetPosition) {
    return !humanoids.some((humanoid) => {
      return humanoid.position.x === targetPosition.x && humanoid.position.y === targetPosition.y;
    });
  }

  getNextDestination(nearestHuman, nearestZombie, player){
    let playerDistance, humanDistance, zombieDistance;
    playerDistance = Number.POSITIVE_INFINITY;
    humanDistance = Number.POSITIVE_INFINITY;
    zombieDistance = Number.POSITIVE_INFINITY;
    if (nearestZombie){
      zombieDistance = (
        Pathfinder.distanceTo( nearestZombie.position, this.position ) *
        gameSettings.zombieSpread
      );
    }
    if (player){
      playerDistance = Pathfinder.distanceTo( player.position, this.position );
    }
    if (nearestHuman){
      humanDistance = Pathfinder.distanceTo( nearestHuman.position, this.position );
    }

    if ( playerDistance < humanDistance ){
      if ( playerDistance < zombieDistance ){
        return this.moveNearest( player );
      } else {
        return this.moveNearest( nearestZombie );
      }
    } else if ( humanDistance < zombieDistance ){
      return this.moveNearest( nearestHuman );
    } else {
      return this.moveNearest( nearestZombie );
    }
  }

  handleNextMove(opts){
    let destination;
    let { nearestHuman, nearestZombie, player, humanoids, getRelativePosition} = opts;
    if ( this.isAbleToBite( player ) ){
      humanoids[player.id] = player.transform();
    }
    if ( this.isAbleToBite( nearestHuman ) ){
      humanoids[nearestHuman.id] = nearestHuman.transform();
    }
    destination = getRelativePosition(
      this.getNextDestination(nearestHuman, nearestZombie, player)
    );
    if ( this.isValidDestination(humanoids, destination) ) {
      this.position = destination;
    }
  }
}

module.exports = Zombie;
