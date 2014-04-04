(function(){
  var canvas = document.getElementsByTagName('canvas')[0];
  var width = canvas.width
  var height = canvas.height
  var ctx = canvas.getContext('2d');
  var allHumanoids = HumanoidBuilder.populate(40,10)
  var board = new Board({humanoids: allHumanoids, width: width, height: height})

  function draw(player){
    ctx.beginPath();
    var x = player.position.x, y = player.position.y
    ctx.arc(x,y,5,0,2*Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.stroke();
  }

  function callNextTurn(board){
    nextRequest = setInterval(function(){
      if (board.humanoids.length == 0) {
        clearInterval(nextRequest);
        alert('EVERYBODY IS DEAD!!!')
      } else {
        ctx.clearRect(0,0,width,height)

        for (var i = 0; i < board.humanoids.length; i++){

          var humanoid = board.humanoids[i]

          if (humanoid.humanType === 'human') {
            humanoid.color = '#00aaaa'
          } else if (humanoid.humanType === 'zombie') {
            humanoid.color = '#ff0000'
          } else {
            humanoid.color = '#770000'
          }
          draw(humanoid)
        }
        board.nextTurn()
      } 
    }, 150);
  }
  callNextTurn(board)
})()









