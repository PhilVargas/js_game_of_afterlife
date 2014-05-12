(function(){
  var canvas = document.getElementsByTagName('canvas')[0];
  var width = canvas.width
  var height = canvas.height
  var ctx = canvas.getContext('2d');
  var allHumanoids = HumanoidBuilder.populate(gameSettings.humanCount , gameSettings.zombieCount)
  var board = new Board({humanoids: allHumanoids, width: width, height: height})

  function drawHumanoids(){
    for (var i = 0; i < board.humanoids.length; i++){
      ctx.beginPath();
      var player = board.humanoids[i]
      var x = player.position.x, y = player.position.y
      ctx.arc(x,y,5,0,2*Math.PI);

      if (player.humanType === 'human') {
        player.color = '#00aaaa'
      } else if (player.humanType === 'zombie') {
        player.color = '#ff0000'
      } else {
        player.color = '#770000'
      }

      ctx.fillStyle = player.color;
      ctx.fill();
      ctx.stroke();
    }
  }

  function callNextTurn(board){
    nextRequest = setInterval(function(){
      ctx.clearRect(0,0,width,height)
      drawHumanoids()
      
      if (board.isAnyHumanRemaining()) {
        board.nextTurn()
      } else {
        clearInterval(nextRequest);
        alert('EVERYBODY IS DEAD!!!')
      }
    }, gameSettings.turnDelay);
  }
  callNextTurn(board)
})()
