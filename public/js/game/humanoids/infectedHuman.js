let Humanoid, Zombie, Settings;

Humanoid = require('humanoids/humanoid');
Zombie = require('humanoids/zombie');
Settings = require('settings');

class InfectedHuman extends Humanoid {
  constructor(opts) {
    super(opts);
    this.speed = 0;
    this.timeSinceInfection = 0;
  }

  isAbleToBite(){
    return false;
  }

  transform() {
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
    if (this.timeSinceInfection >= Settings.infectionIncubationTime){
      humanoids[this.id] = this.transform();
    }
  }
}

module.exports = InfectedHuman;
