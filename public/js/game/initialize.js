import { default as GameOfAfterlife } from 'game';

document.getElementById('initialize-game').addEventListener('click', function(){
  const gameOfAfterlife = new GameOfAfterlife();

  document.getElementById('overlay').className = 'hide';
  gameOfAfterlife.init();
});
