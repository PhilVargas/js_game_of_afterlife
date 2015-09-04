let GameOfAfterlife, gameOfAfterlife;

GameOfAfterlife = require('game');

document.getElementById('initialize-game').addEventListener('click', function(){
  document.getElementById('overlay').className = 'hide';
  gameOfAfterlife = new GameOfAfterlife();
  gameOfAfterlife.init();
});
