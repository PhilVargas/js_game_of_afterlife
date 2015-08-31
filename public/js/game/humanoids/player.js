let Pathfinder, gameSettings, Humanoid, InfectedHuman;

gameSettings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
InfectedHuman = require('humanoids/infectedHuman');

class Player extends Humanoid {
  constructor(opts) {
    super(opts);
    this.speed = gameSettings.playerSpeed;
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
    let targetLoc, coords;
    let { dx, dy, getRelativePosition } = opts;
    targetLoc = {
      x: this.position.x + dx*this.speed,
      y: this.position.y + dy*this.speed
    };
    coords = ( Pathfinder.moveTowards(this.position, targetLoc, this.speed) );
    this.position = getRelativePosition(coords);
  }
}

module.exports = Player;

