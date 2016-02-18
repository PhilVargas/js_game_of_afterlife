import { default as Pathfinder } from 'pathfinder';
import { default as Settings } from 'settings';
import { default as Humanoid } from 'humanoids/humanoid';
import { default as InfectedHuman } from 'humanoids/infectedHuman';

class Human extends Humanoid {
  constructor(opts){
    super(opts);
    this.speed = Settings.humanSpeed;
  }

  isAbleToBite(){
    return false;
  }

  transform(){
    return (
      new InfectedHuman(this.cloneProps())
    );
  }

  handleNextMove(opts){
    const { nearestHumanoid, nearestZombie, humanoids } = opts;
    const destination = Pathfinder.getRelativePosition(
      this.getNextDestination(nearestHumanoid, nearestZombie)
    );

    if (this.isValidDestination(humanoids, destination)) {
      this.position = destination;
    }
  }

  isValidDestination(humanoids, targetPosition){
    return !humanoids.some((humanoid) => {
      return Pathfinder.arePositionsEqual(humanoid.position, targetPosition);
    });
  }

  getNextDestination(nearestHumanoid, nearestZombie){
    if (this.isZombieNearest(nearestZombie, nearestHumanoid)) {
      return this.moveNearest(nearestZombie);
    } else {
      return this.moveNearest(nearestHumanoid);
    }
  }

  isZombieNearest(nearestZombie, nearestHumanoid){
    let zombieDistance;

    if (nearestZombie) {
      zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.position);
    }

    // a zombie is within the human fear range, or there are no other living humanoids remaining
    return (zombieDistance < Settings.humanFearRange || (!nearestHumanoid));
  }
}

export { Human as default };
