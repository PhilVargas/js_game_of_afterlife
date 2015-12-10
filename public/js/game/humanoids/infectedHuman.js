import { default as Settings } from 'settings';
import { default as Humanoid } from 'humanoids/humanoid';
import { default as Zombie } from 'humanoids/zombie';

class InfectedHuman extends Humanoid {
  constructor(opts){
    super(opts);
    this.speed = 0;
    this.timeSinceInfection = 0;
  }

  isAbleToBite(){
    return false;
  }

  transform(){
    return (
      new Zombie(this.cloneProps())
    );
  }

  incrementTimeSinceInfection(){
    this.timeSinceInfection++;
  }

  handleNextMove(opts){
    const { humanoids } = opts;

    this.incrementTimeSinceInfection();
    if (this.timeSinceInfection >= Settings.infectionIncubationTime) {
      humanoids[this.id] = this.transform();
    }
  }
}

export { InfectedHuman as default };
