let Pathfinder, gameSettings, Humanoid, Zombie;

gameSettings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
Zombie = require('humanoids/zombie');

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
    return(
      new Zombie(this.cloneProps())
    );
  }

  incrementTimeSinceInfection(){
    this.timeSinceInfection++;
  }

  handleNextMove(opts){
    let { humanoids } = opts;
    this.incrementTimeSinceInfection();
    if (this.timeSinceInfection >= 5){
      humanoids[this.id] = this.transform();
    }
  }
}

module.exports = InfectedHuman;
