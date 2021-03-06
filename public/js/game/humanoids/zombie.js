import { default as Pathfinder } from 'pathfinder';
import { default as Settings } from 'settings';
import { default as Humanoid } from 'humanoids/humanoid';

class Zombie extends Humanoid {
  constructor(opts){
    super(opts);
    this.speed = Settings.zombieSpeed;
  }

  isAbleToBite(human){
    return (
      human && Pathfinder.distanceTo(human.position, this.position) < Settings.zombieBiteRange
    );
  }

  transform(){
    return (this);
  }

  isValidDestination(humanoids, targetPosition){
    return !humanoids.some((humanoid) => {
      return Pathfinder.arePositionsEqual(humanoid.position, targetPosition);
    });
  }

  getNextDestination(nearestLivingHumanoid, nearestZombie){
    let zombieDistance, livingHumanoidDistance;

    livingHumanoidDistance = Number.POSITIVE_INFINITY;
    zombieDistance = Number.POSITIVE_INFINITY;

    if (nearestZombie) {
      zombieDistance = (
        Pathfinder.distanceTo(nearestZombie.position, this.position) *
        Settings.zombieSpread
      );
    }

    if (nearestLivingHumanoid) {
      livingHumanoidDistance = Pathfinder.distanceTo(nearestLivingHumanoid.position, this.position);
    }

    if (livingHumanoidDistance < zombieDistance) {
      return this.moveNearest(nearestLivingHumanoid);
    } else {
      return this.moveNearest(nearestZombie);
    }
  }

  handleNextMove(opts){
    const { nearestHumanoid, nearestZombie, humanoids } = opts;

    if (this.isAbleToBite(nearestHumanoid)) {
      humanoids[nearestHumanoid.id] = nearestHumanoid.transform();
    }

    const destination = Pathfinder.getRelativePosition(
      this.getNextDestination(nearestHumanoid, nearestZombie)
    );

    if (this.isValidDestination(humanoids, destination)) {
      this.position = destination;
    }
  }
}

export { Zombie as default };
