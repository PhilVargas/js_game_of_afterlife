import { default as Settings } from 'settings';
import { default as HumanoidBuilder } from 'humanoidFactory';
import { default as Board } from 'board';

class GameOfAfterlife {
  constructor(){
    const canvas = document.getElementsByTagName('canvas')[0];
    const allHumanoids = HumanoidBuilder.populate(Settings.humanCount, Settings.zombieCount);

    this.hasBegun = false;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.board = new Board({ humanoids: allHumanoids });
    this.humanoidColorMap = {
      Human: '#00aaaa',
      Zombie: '#ff0000',
      Player: '#00cc00',
      InfectedHuman: '#770000'
    };
  }

  bindPlayerMovement(){
    document.addEventListener('keyup', (e) => {
      // s = 83
      // w = 87
      // a = 65
      // d = 68
      if (e.which === 68 || e.which === 65) { this.board.dx = 0; }
      if (e.which === 83 || e.which === 87) { this.board.dy = 0; }
    });

    document.addEventListener('keydown', (e) => {
      switch (e.which) {
        case 65:
          this.board.dx = -1;
          break;
        case 68:
          this.board.dx = 1;
          break;
        case 87:
          this.board.dy = -1;
          break;
        case 83:
          this.board.dy = 1;
          break;
      }
    });
  }

  drawHumanoids(){
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.board.humanoids.length; i++) {
      const player = this.board.humanoids[i];
      const x = player.position.x;
      const y = player.position.y;

      this.ctx.beginPath();
      this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
      this.ctx.fillStyle = this.humanoidColorMap[player.humanType];
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

  callNextTurn(){
    let nextRequest;

    nextRequest = () => {
      this.drawHumanoids();
      if (this.board.isGameActive()) {
        document.getElementById('score').innerHTML = this.board.score;
        this.board.nextTurn();
        const delay = (this.board.isPlayerAlive() ? Settings.turnDelay.normal : Settings.turnDelay.fast);

        setTimeout(nextRequest, delay);
      } else {
        document.getElementById('overlay-message')
        .innerHTML = `EVERYBODY IS DEAD!!!\nYour score was: ${this.board.score}`;
        document.getElementById('overlay').className = '';
      }
    };
    setTimeout(nextRequest, Settings.turnDelay.normal);
  }

  init(){
    this.bindPlayerMovement();
    this.callNextTurn();
  }
}

export { GameOfAfterlife as default };
