let Board = require('board');
let HumanoidBuilder = require('humanoidFactory');
let gameSettings = require('settings');

function initialize(){
  let canvas = document.getElementsByTagName('canvas')[0];
  let width = canvas.width;
  let height = canvas.height;
  let ctx = canvas.getContext('2d');
  let allHumanoids = HumanoidBuilder.populate(gameSettings.humanCount , gameSettings.zombieCount);
  let board = new Board({humanoids: allHumanoids, width: width, height: height});

  document.addEventListener('keyup', function(e){
    // s = 83
    // w = 87
    // a = 65
    // d = 68
    if (e.which === 68 || e.which === 65){ board.dx = 0; }
    if (e.which === 83 || e.which === 87){ board.dy = 0; }
  });

  document.addEventListener('keydown', function(e){
    if (e.which === 65){ board.dx = -1; }
    else if (e.which === 68){ board.dx = 1; }
    else if (e.which === 87){ board.dy = -1; }
    else if (e.which === 83){ board.dy = 1; }
  });

  function drawHumanoids(){
    ctx.clearRect(0,0,width,height);
    for (let i = 0; i < board.humanoids.length; i++){
      ctx.beginPath();
      let player = board.humanoids[i];
      let x = player.position.x, y = player.position.y;
      ctx.arc(x,y,5,0,2*Math.PI);

      if (player.humanType === 'human') {
        player.color = '#00aaaa';
      } else if (player.humanType === 'zombie') {
        player.color = '#ff0000';
      } else if (player.humanType === 'player') {
        player.color = '#00cc00';
      } else {
        player.color = '#770000';
      }

      ctx.fillStyle = player.color;
      ctx.fill();
      ctx.stroke();
    }
  }

  function callNextTurn(board){
    let delay, nextRequest;
    nextRequest = function(){
      drawHumanoids();
      if (board.isGameActive()){
        document.getElementById('score').innerHTML = board.score;
        board.nextTurn();
        delay = (board.isPlayerAlive() ? gameSettings.turnDelay.normal : gameSettings.turnDelay.fast);
        setTimeout(nextRequest, delay);
      } else {
        alert('EVERYBODY IS DEAD!!!\nYour score was: ' + board.score);
      }
    };
    setTimeout(nextRequest, gameSettings.turnDelay.normal);
  }
  callNextTurn(board);
}

module.exports = initialize;
