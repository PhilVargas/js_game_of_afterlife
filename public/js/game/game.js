let Board, HumanoidBuilder, gameSettings;
Board = require('board');
HumanoidBuilder = require('humanoidFactory');
gameSettings = require('settings');

class GameOfAfterlife {
  constructor(){
    let canvas, allHumanoids;
    canvas = document.getElementsByTagName('canvas')[0];
    allHumanoids = HumanoidBuilder.populate(gameSettings.humanCount , gameSettings.zombieCount);
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.board = new Board({humanoids: allHumanoids, width: this.width, height: this.height});
    this.humanoidColorMap = {
      human: '#00aaaa',
      zombie: '#ff0000',
      player: '#00cc00',
      infectedHuman: '#770000'
    };
  }

  bindPlayerMovement(){
    document.addEventListener('keyup', (e) =>{
      // s = 83
      // w = 87
      // a = 65
      // d = 68
      if (e.which === 68 || e.which === 65){ this.board.dx = 0; }
      if (e.which === 83 || e.which === 87){ this.board.dy = 0; }
    });

    document.addEventListener('keydown', (e) =>{
      if (e.which === 65){ this.board.dx = -1; }
      else if (e.which === 68){ this.board.dx = 1; }
      else if (e.which === 87){ this.board.dy = -1; }
      else if (e.which === 83){ this.board.dy = 1; }
    });
  }


  drawHumanoids(){
    let player, x, y;
    this.ctx.clearRect(0,0,this.width,this.height);
    for (let i = 0; i < this.board.humanoids.length; i++){
      this.ctx.beginPath();
      player = this.board.humanoids[i];
      x = player.position.x;
      y = player.position.y;
      this.ctx.arc(x,y,5,0,2*Math.PI);
      this.ctx.fillStyle = this.humanoidColorMap[player.humanType];
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

  callNextTurn(){
    let delay, nextRequest;
    nextRequest = ()=> {
      this.drawHumanoids();
      if (this.board.isGameActive()){
        document.getElementById('score').innerHTML = this.board.score;
        this.board.nextTurn();
        delay = (this.board.isPlayerAlive() ? gameSettings.turnDelay.normal : gameSettings.turnDelay.fast);
        setTimeout(nextRequest, delay);
      } else {
        alert(`EVERYBODY IS DEAD!!!\nYour score was: ${this.board.score}`);
      }
    };
    setTimeout(nextRequest, gameSettings.turnDelay.normal);
  }

  init(){
    this.bindPlayerMovement();
    this.callNextTurn();
  }
}

module.exports = GameOfAfterlife;
