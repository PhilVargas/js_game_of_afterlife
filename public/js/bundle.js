!function i(e,t,n){function o(s,r){if(!t[s]){if(!e[s]){var u="function"==typeof require&&require;if(!r&&u)return u(s,!0);if(a)return a(s,!0);var h=new Error("Cannot find module '"+s+"'");throw h.code="MODULE_NOT_FOUND",h}var d=t[s]={exports:{}};e[s][0].call(d.exports,function(i){var t=e[s][1][i];return o(t?t:i)},d,d.exports,i,e,t,n)}return t[s].exports}for(var a="function"==typeof require&&require,s=0;s<n.length;s++)o(n[s]);return o}({"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/board.js":[function(i,e,t){"use strict";function n(i,e){if(!(i instanceof e))throw new TypeError("Cannot call a class as a function")}var o=function(){function i(i,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(i,n.key,n)}}return function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}}(),a=void 0,s=void 0;a=i("pathfinder"),s=i("settings");var r=function(){function i(e){n(this,i),this.humanoid=null,this.score=0,this.dx=0,this.dy=0,this.humanoids=e.humanoids||[],this.width=e.width||"600px",this.height=e.height||"400px"}return o(i,[{key:"isGameActive",value:function(){return this.humanoids.some(function(i){return"human"===i.humanType||"player"===i.humanType})}},{key:"isPlayerAlive",value:function(){return this.humanoids.some(function(i){return"player"===i.humanType})}},{key:"isPositionEqual",value:function(i,e){return i.x===e.x&&i.y===e.y}},{key:"isValidDestination",value:function(i){var e=this;return!this.humanoids.some(function(t){return e.isPositionEqual(t.position,i)})}},{key:"nearestHumanoid",value:function(i){var e=void 0,t=void 0,n=void 0;return e=this.findSimilarHumanoids(i),t=this.findClosestPos(e),n=this.findClosestHumanoid(t,e)}},{key:"nextTurn",value:function(){for(var i=void 0,e=0;e<this.humanoids.length;e++)if(this.humanoid=this.humanoids[e],"infectedHuman"!==this.humanoid.humanType)if("player"!==this.humanoid.humanType){var t=void 0,n=void 0,o=void 0;n=this.nearestHumanoid("zombie"),t=this.nearestHumanoid("human"),i=this.nearestHumanoid("player"),o=this.setDestination(t,n,i),o.x=(o.x+this.width)%this.width,o.y=(o.y+this.height)%this.height,this.humanoid.isAbleToBite(i)&&this.humanoid.bite(i),this.humanoid.isAbleToBite(t)&&this.humanoid.bite(t),this.isValidDestination(o)&&(this.humanoid.position=o)}else{var s=void 0,r=void 0;s={x:this.humanoid.position.x+this.dx*this.humanoid.speed,y:this.humanoid.position.y+this.dy*this.humanoid.speed},r=a.moveTowards(this.humanoid.position,s,this.humanoid.speed),r.x=(r.x+this.width)%this.width,r.y=(r.y+this.height)%this.height,this.humanoid.position=r}else this.humanoid.incrementTimeSinceInfection();this.incrementScore(i)}},{key:"incrementScore",value:function(i){i&&"player"===i.humanType&&(this.score+=10)}},{key:"setDestination",value:function(i,e,t){return"zombie"===this.humanoid.humanType?this.setZombieDestination(i,e,t):"human"===this.humanoid.humanType?this.setHumanDestination(i,e,t):this.humanoid.position}},{key:"setZombieDestination",value:function(i,e,t){var n=void 0,o=void 0,r=void 0;return n=Number.POSITIVE_INFINITY,o=Number.POSITIVE_INFINITY,r=Number.POSITIVE_INFINITY,e&&(r=a.distanceTo(e.position,this.humanoid.position)*s.zombieSpread),t&&(n=a.distanceTo(t.position,this.humanoid.position)),i&&(o=a.distanceTo(i.position,this.humanoid.position)),this.humanoid.moveNearest(o>n?r>n?t:e:r>o?i:e)}},{key:"setHumanDestination",value:function(i,e,t){var n=void 0,o=void 0,r=void 0;return n=Number.POSITIVE_INFINITY,o=Number.POSITIVE_INFINITY,r=a.distanceTo(e.position,this.humanoid.position),t&&(n=a.distanceTo(t.position,this.humanoid.position)),i&&(o=a.distanceTo(i.position,this.humanoid.position)),this.humanoid.moveNearest(r<s.humanFearRange||!t&&!i?e:o>n?t:i)}},{key:"otherHumanoids",value:function(){var i=this;return this.humanoids.filter(function(e){return i.humanoid.id!==e.id})}},{key:"findSimilarHumanoids",value:function(i){return this.otherHumanoids().filter(function(e){return e.humanType===i})}},{key:"findClosestPos",value:function(i){var e=void 0,t=void 0;e=[];for(var n=0;n<i.length;n++)t=a.distanceTo(i[n].position,this.humanoid.position),e.push(t);return e}},{key:"findClosestHumanoid",value:function(i,e){var t=void 0,n=void 0;t=Math.min.apply(null,i);for(var o=0;o<i.length;o++)i[o]===t&&(n=e[o]);return n}}]),i}();e.exports=r},{pathfinder:"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js",settings:"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/game.js":[function(i,e,t){"use strict";function n(i,e){if(!(i instanceof e))throw new TypeError("Cannot call a class as a function")}var o=function(){function i(i,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(i,n.key,n)}}return function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}}(),a=void 0,s=void 0,r=void 0;a=i("board"),s=i("humanoidFactory"),r=i("settings");var u=function(){function i(){n(this,i);var e=void 0,t=void 0;e=document.getElementsByTagName("canvas")[0],t=s.populate(r.humanCount,r.zombieCount),this.hasBegun=!1,this.width=e.width,this.height=e.height,this.ctx=e.getContext("2d"),this.board=new a({humanoids:t,width:this.width,height:this.height}),this.humanoidColorMap={human:"#00aaaa",zombie:"#ff0000",player:"#00cc00",infectedHuman:"#770000"}}return o(i,[{key:"bindPlayerMovement",value:function(){var i=this;document.addEventListener("keyup",function(e){(68===e.which||65===e.which)&&(i.board.dx=0),(83===e.which||87===e.which)&&(i.board.dy=0)}),document.addEventListener("keydown",function(e){65===e.which?i.board.dx=-1:68===e.which?i.board.dx=1:87===e.which?i.board.dy=-1:83===e.which&&(i.board.dy=1)})}},{key:"drawHumanoids",value:function(){var i=void 0,e=void 0,t=void 0;this.ctx.clearRect(0,0,this.width,this.height);for(var n=0;n<this.board.humanoids.length;n++)this.ctx.beginPath(),i=this.board.humanoids[n],e=i.position.x,t=i.position.y,this.ctx.arc(e,t,5,0,2*Math.PI),this.ctx.fillStyle=this.humanoidColorMap[i.humanType],this.ctx.fill(),this.ctx.stroke()}},{key:"callNextTurn",value:function(){var i=this,e=void 0,t=void 0;t=function(){i.drawHumanoids(),i.board.isGameActive()?(document.getElementById("score").innerHTML=i.board.score,i.board.nextTurn(),e=i.board.isPlayerAlive()?r.turnDelay.normal:r.turnDelay.fast,setTimeout(t,e)):(document.getElementById("overlay-message").innerHTML="EVERYBODY IS DEAD!!!\nYour score was: "+i.board.score,document.getElementById("overlay").className="")},setTimeout(t,r.turnDelay.normal)}},{key:"init",value:function(){this.bindPlayerMovement(),this.callNextTurn()}}]),i}();e.exports=u},{board:"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/board.js",humanoidFactory:"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoidFactory.js",settings:"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoid.js":[function(i,e,t){"use strict";function n(i,e){if(!(i instanceof e))throw new TypeError("Cannot call a class as a function")}var o=function(){function i(i,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(i,n.key,n)}}return function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}}(),a=void 0,s=void 0;a=i("pathfinder"),s=i("settings");var r=function(){function i(e){n(this,i),this.id=e.id,this.position=e.position||{x:5+Math.floor(591*Math.random()),y:5+Math.floor(391*Math.random())},this.speed=e.speed,this.humanType=e.humanType,this.timeSinceInfection=0,this.lastPosition={x:this.position.x,y:this.position.y}}return o(i,[{key:"isAttractedTo",value:function(i){return"human"===i.humanType||"player"===i.humanType}},{key:"storeLastPosition",value:function(){this.lastPosition={x:this.position.x,y:this.position.y}}},{key:"isLastMoveRepeated",value:function(i){return Math.abs(i.x-this.lastPosition.x)<s.repitionTolerance&&Math.abs(i.y-this.lastPosition.y)<s.repitionTolerance}},{key:"getBitten",value:function(){this.humanType="infectedHuman",this.speed=0}},{key:"bite",value:function(i){i&&i.getBitten()}},{key:"turnToZombie",value:function(){this.humanType="zombie",this.speed=s.zombieSpeed}},{key:"isAbleToBite",value:function(i){return i?"zombie"===this.humanType&&a.distanceTo(i.position,this.position)<10:void 0}},{key:"incrementTimeSinceInfection",value:function(){this.timeSinceInfection++,5===this.timeSinceInfection&&this.turnToZombie()}},{key:"moveNearest",value:function(i){var e=void 0;return e=this.isAttractedTo(i)?a.moveTowards(this.position,i.position,this.speed):a.moveAwayFrom(this.position,i.position,this.speed),this.lastPosition.x===this.position.x&&this.lastPosition.y===this.position.y?(this.storeLastPosition(),a.moveRandomly(this.position,this.speed)):this.isLastMoveRepeated(e)?(this.storeLastPosition(),a.movePerpendicularTo(this.position,i.position,this.speed)):(this.storeLastPosition(),e)}}]),i}();e.exports=r},{pathfinder:"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js",settings:"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoidFactory.js":[function(i,e,t){"use strict";function n(i,e){if(!(i instanceof e))throw new TypeError("Cannot call a class as a function")}var o=function(){function i(i,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(i,n.key,n)}}return function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}}(),a=void 0,s=void 0;s=i("settings"),a=i("humanoid");var r=function(){function i(){n(this,i)}return o(i,null,[{key:"populate",value:function(i,e){var t=[];return t=t.concat(this.creation(i,"human",s.humanSpeed)),t=t.concat(this.creation(e,"zombie",s.zombieSpeed,t.length)),t=t.concat(this.creation(1,"player",s.playerSpeed,t.length))}},{key:"creation",value:function(i,e,t){var n=arguments.length<=3||void 0===arguments[3]?0:arguments[3],o=void 0,s=void 0;o=[];for(var r=0;i>r;r++)s=new a({humanType:e,speed:t,id:n+r}),o.push(s);return o}}]),i}();e.exports=r},{humanoid:"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoid.js",settings:"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/initialize.js":[function(i,e,t){"use strict";var n=void 0,o=void 0;n=i("game"),document.getElementById("initialize-game").addEventListener("click",function(i){document.getElementById("overlay").className="hide",o=new n,o.init()})},{game:"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/game.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js":[function(i,e,t){"use strict";function n(i,e){if(!(i instanceof e))throw new TypeError("Cannot call a class as a function")}var o=function(){function i(i,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(i,n.key,n)}}return function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}}(),a=function(){function i(){n(this,i)}return o(i,null,[{key:"moveTowards",value:function(i,e,t){var n=void 0,o=void 0,a=void 0;return n=e.y-i.y,o=e.x-i.x,a=this.distanceTo(e,i),0!==t&&t>a?e:{x:i.x+o/a*t,y:i.y+n/a*t}}},{key:"moveAwayFrom",value:function(i,e,t){return this.moveTowards(i,e,-t)}},{key:"movePerpendicularTo",value:function(i,e,t){var n=void 0,o=void 0,a=void 0;return n=e.y-i.y,o=e.x-i.x,a=this.distanceTo(e,i),0!==t&&t>a?e:{x:i.x+o/a*t,y:i.y-n/a*t}}},{key:"distanceTo",value:function(i,e){var t=void 0,n=void 0;return t=i.y-e.y,n=i.x-e.x,Math.sqrt(Math.pow(t,2)+Math.pow(n,2))}},{key:"moveRandomly",value:function(i,e){var t=void 0;return t=2*Math.random()*Math.PI,{x:i.x+Math.cos(t)*e,y:i.y+Math.sin(t)*e}}}]),i}();e.exports=a},{}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js":[function(i,e,t){"use strict";var n={humanSpeed:7,playerSpeed:6,zombieSpeed:4,humanCount:30,zombieCount:3,turnDelay:{normal:100,fast:25},repitionTolerance:1,zombieSpread:3,humanFearRange:20};e.exports=n},{}]},{},["/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/initialize.js"]);