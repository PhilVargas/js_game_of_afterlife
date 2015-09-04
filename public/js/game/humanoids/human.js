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
    let { nearestHuman, nearestZombie, player, humanoids } = opts;

    destination = Pathfinder.getRelativePosition(
      this.getNextDestination(nearestHuman, nearestZombie, player)
    );
    if (this.isValidDestination(humanoids, destination)) {
      this.position = destination;
    }
  }

  isValidDestination(humanoids, targetPosition) {
    return !humanoids.some((humanoid) => {
      return Pathfinder.arePositionsEqual(humanoid.position, targetPosition);
    });
  }

  getNextDestination(nearestHuman, nearestZombie, player){
    if (this.isZombieNearest(nearestZombie, nearestHuman, player)){
      return this.moveNearest(nearestZombie);
    } else if (this.isPlayerNearest(player, nearestHuman)){
      return this.moveNearest(player);
    } else {
      return this.moveNearest(nearestHuman);
    }
  }

  isPlayerNearest(player, nearestHuman) {
    let playerDistance, humanDistance;

    playerDistance = Number.POSITIVE_INFINITY;
    humanDistance = Number.POSITIVE_INFINITY;

    if (player){
      playerDistance = Pathfinder.distanceTo(player.position, this.position);
    }

    if (nearestHuman){
      humanDistance = Pathfinder.distanceTo(nearestHuman.position, this.position);
    }

    return playerDistance < humanDistance;
  }

  isZombieNearest(nearestZombie, nearestHuman, player) {
    let zombieDistance;

    if (nearestZombie) {
      zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.position);
    }

    return (zombieDistance < gameSettings.humanFearRange || (!player && !nearestHuman));
  }
}

module.exports = Human;
