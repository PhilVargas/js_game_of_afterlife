(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/board.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Pathfinder = undefined;

Pathfinder = require('pathfinder');

var Board = (function () {
  function Board(attributes) {
    _classCallCheck(this, Board);

    this.humanoid = null;
    this.score = 0;
    this.dx = 0;
    this.dy = 0;
    this.humanoids = attributes.humanoids || [];
  }

  _createClass(Board, [{
    key: 'isGameActive',
    value: function isGameActive() {
      return this.humanoids.some(function (humanoid) {
        return humanoid.isHuman() || humanoid.isPlayer();
      });
    }
  }, {
    key: 'isPlayerAlive',
    value: function isPlayerAlive() {
      return this.humanoids.some(function (humanoid) {
        return humanoid.isPlayer();
      });
    }
  }, {
    key: 'nearestLivingHumanoid',
    value: function nearestLivingHumanoid() {
      var livingHumanoids = undefined,
          closestPos = undefined,
          closestHumanoid = undefined;

      livingHumanoids = this.findSimilarHumanoids('Player').concat(this.findSimilarHumanoids('Human'));
      closestPos = this.findClosestPos(livingHumanoids);
      closestHumanoid = this.findClosestHumanoid(closestPos, livingHumanoids);
      return closestHumanoid;
    }
  }, {
    key: 'nearestZombie',
    value: function nearestZombie() {
      var similarHumanoids = undefined,
          closestPos = undefined,
          closestHumanoid = undefined;

      similarHumanoids = this.findSimilarHumanoids('Zombie');
      closestPos = this.findClosestPos(similarHumanoids);
      closestHumanoid = this.findClosestHumanoid(closestPos, similarHumanoids);
      return closestHumanoid;
    }
  }, {
    key: 'nextTurn',
    value: function nextTurn() {
      for (var i = 0; i < this.humanoids.length; i++) {
        this.humanoid = this.humanoids[i];
        this.humanoid.handleNextMove({
          nearestHumanoid: this.nearestLivingHumanoid(),
          nearestZombie: this.nearestZombie(),
          dx: this.dx,
          dy: this.dy,
          humanoids: this.humanoids
        });
      }
      this.incrementScore();
    }
  }, {
    key: 'incrementScore',
    value: function incrementScore() {
      if (this.isPlayerAlive()) {
        this.score += 10;
      }
    }
  }, {
    key: 'otherHumanoids',
    value: function otherHumanoids() {
      var _this = this;

      return this.humanoids.filter(function (currentHumanoid) {
        return _this.humanoid.id !== currentHumanoid.id;
      });
    }
  }, {
    key: 'findSimilarHumanoids',
    value: function findSimilarHumanoids(humanoidType) {
      return this.otherHumanoids().filter(function (humanoid) {
        return humanoid.humanType === humanoidType;
      });
    }
  }, {
    key: 'findClosestPos',
    value: function findClosestPos(otherHumanoids) {
      var closestPos = undefined,
          dist = undefined;

      closestPos = [];
      for (var i = 0; i < otherHumanoids.length; i++) {
        dist = Pathfinder.distanceTo(otherHumanoids[i].position, this.humanoid.position);
        closestPos.push(dist);
      }
      return closestPos;
    }
  }, {
    key: 'findClosestHumanoid',
    value: function findClosestHumanoid(closestPos, otherHumanoids) {
      var closestHumanoidValue = undefined,
          closestHumanoid = undefined;

      closestHumanoidValue = Math.min.apply(null, closestPos);
      for (var i = 0; i < closestPos.length; i++) {
        if (closestPos[i] === closestHumanoidValue) {
          closestHumanoid = otherHumanoids[i];
        }
      }
      return closestHumanoid;
    }
  }]);

  return Board;
})();

module.exports = Board;

},{"pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/game.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Board = undefined,
    HumanoidBuilder = undefined,
    gameSettings = undefined;

Board = require('board');
HumanoidBuilder = require('humanoidFactory');
gameSettings = require('settings');

var GameOfAfterlife = (function () {
  function GameOfAfterlife() {
    _classCallCheck(this, GameOfAfterlife);

    var canvas = undefined,
        allHumanoids = undefined;

    canvas = document.getElementsByTagName('canvas')[0];
    allHumanoids = HumanoidBuilder.populate(gameSettings.humanCount, gameSettings.zombieCount);
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

  _createClass(GameOfAfterlife, [{
    key: 'bindPlayerMovement',
    value: function bindPlayerMovement() {
      var _this = this;

      document.addEventListener('keyup', function (e) {
        // s = 83
        // w = 87
        // a = 65
        // d = 68
        if (e.which === 68 || e.which === 65) {
          _this.board.dx = 0;
        }
        if (e.which === 83 || e.which === 87) {
          _this.board.dy = 0;
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.which === 65) {
          _this.board.dx = -1;
        } else if (e.which === 68) {
          _this.board.dx = 1;
        } else if (e.which === 87) {
          _this.board.dy = -1;
        } else if (e.which === 83) {
          _this.board.dy = 1;
        }
      });
    }
  }, {
    key: 'drawHumanoids',
    value: function drawHumanoids() {
      var player = undefined,
          x = undefined,
          y = undefined;

      this.ctx.clearRect(0, 0, this.width, this.height);
      for (var i = 0; i < this.board.humanoids.length; i++) {
        this.ctx.beginPath();
        player = this.board.humanoids[i];
        x = player.position.x;
        y = player.position.y;
        this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.humanoidColorMap[player.humanType];
        this.ctx.fill();
        this.ctx.stroke();
      }
    }
  }, {
    key: 'callNextTurn',
    value: function callNextTurn() {
      var _this2 = this;

      var delay = undefined,
          nextRequest = undefined;

      nextRequest = function () {
        _this2.drawHumanoids();
        if (_this2.board.isGameActive()) {
          document.getElementById('score').innerHTML = _this2.board.score;
          _this2.board.nextTurn();
          delay = _this2.board.isPlayerAlive() ? gameSettings.turnDelay.normal : gameSettings.turnDelay.fast;
          setTimeout(nextRequest, delay);
        } else {
          document.getElementById('overlay-message').innerHTML = 'EVERYBODY IS DEAD!!!\nYour score was: ' + _this2.board.score;
          document.getElementById('overlay').className = '';
        }
      };
      setTimeout(nextRequest, gameSettings.turnDelay.normal);
    }
  }, {
    key: 'init',
    value: function init() {
      this.bindPlayerMovement();
      this.callNextTurn();
    }
  }]);

  return GameOfAfterlife;
})();

module.exports = GameOfAfterlife;

},{"board":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/board.js","humanoidFactory":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoidFactory.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoidFactory.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Human = undefined,
    Zombie = undefined,
    Player = undefined;

Human = require('humanoids/human');
Zombie = require('humanoids/zombie');
Player = require('humanoids/player');

var HumanoidBuilder = (function () {
  function HumanoidBuilder() {
    _classCallCheck(this, HumanoidBuilder);
  }

  _createClass(HumanoidBuilder, null, [{
    key: 'humanoidMap',
    value: function humanoidMap() {
      return {
        Human: Human,
        Zombie: Zombie,
        Player: Player
      };
    }
  }, {
    key: 'populate',
    value: function populate(numberOfHumans, numberOfZombies) {
      var population = undefined;

      population = [];
      population = population.concat(this.creation(numberOfHumans, 'Human'));
      population = population.concat(this.creation(numberOfZombies, 'Zombie', population.length));
      population = population.concat(this.creation(1, 'Player', population.length));
      return population;
    }
  }, {
    key: 'creation',
    value: function creation(number, type) {
      var baseId = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      var population = undefined,
          newHumanoid = undefined,
          map = undefined,
          H = undefined;

      map = this.humanoidMap();
      population = [];
      for (var i = 0; i < number; i++) {
        H = map[type];
        newHumanoid = new H({ id: baseId + i });
        population.push(newHumanoid);
      }
      return population;
    }
  }]);

  return HumanoidBuilder;
})();

module.exports = HumanoidBuilder;

},{"humanoids/human":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/human.js","humanoids/player":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/player.js","humanoids/zombie":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/zombie.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/human.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pathfinder = undefined,
    gameSettings = undefined,
    Humanoid = undefined,
    InfectedHuman = undefined;

gameSettings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
InfectedHuman = require('humanoids/infectedHuman');

var Human = (function (_Humanoid) {
  _inherits(Human, _Humanoid);

  function Human(opts) {
    _classCallCheck(this, Human);

    _get(Object.getPrototypeOf(Human.prototype), 'constructor', this).call(this, opts);
    this.speed = gameSettings.humanSpeed;
  }

  _createClass(Human, [{
    key: 'isAbleToBite',
    value: function isAbleToBite() {
      return false;
    }
  }, {
    key: 'transform',
    value: function transform() {
      return new InfectedHuman(this.cloneProps());
    }
  }, {
    key: 'handleNextMove',
    value: function handleNextMove(opts) {
      var destination = undefined;
      var nearestHumanoid = opts.nearestHumanoid;
      var nearestZombie = opts.nearestZombie;
      var humanoids = opts.humanoids;

      destination = Pathfinder.getRelativePosition(this.getNextDestination(nearestHumanoid, nearestZombie));
      if (this.isValidDestination(humanoids, destination)) {
        this.position = destination;
      }
    }
  }, {
    key: 'isValidDestination',
    value: function isValidDestination(humanoids, targetPosition) {
      return !humanoids.some(function (humanoid) {
        return Pathfinder.arePositionsEqual(humanoid.position, targetPosition);
      });
    }
  }, {
    key: 'getNextDestination',
    value: function getNextDestination(nearestHumanoid, nearestZombie) {
      if (this.isZombieNearest(nearestZombie, nearestHumanoid)) {
        return this.moveNearest(nearestZombie);
      } else {
        return this.moveNearest(nearestHumanoid);
      }
    }
  }, {
    key: 'isZombieNearest',
    value: function isZombieNearest(nearestZombie, nearestHumanoid) {
      var zombieDistance = undefined;

      if (nearestZombie) {
        zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.position);
      }

      // a zombie is within the human fear range, or there are no other living humanoids remaining
      return zombieDistance < gameSettings.humanFearRange || !nearestHumanoid;
    }
  }]);

  return Human;
})(Humanoid);

module.exports = Human;

},{"humanoids/humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js","humanoids/infectedHuman":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/infectedHuman.js","pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Pathfinder = undefined,
    gameSettings = undefined;

Pathfinder = require('pathfinder');
gameSettings = require('settings');

var Humanoid = (function () {
  function Humanoid(attributes) {
    _classCallCheck(this, Humanoid);

    this.id = attributes.id;
    this.position = attributes.position || { x: 5 + Math.floor(Math.random() * 591), y: 5 + Math.floor(Math.random() * 391) };
    this.lastPosition = { x: this.position.x, y: this.position.y };
    this.humanType = this.constructor.name;
  }

  _createClass(Humanoid, [{
    key: 'isZombie',
    value: function isZombie() {
      return this.humanType === 'Zombie';
    }
  }, {
    key: 'isPlayer',
    value: function isPlayer() {
      return this.humanType === 'Player';
    }
  }, {
    key: 'isHuman',
    value: function isHuman() {
      return this.humanType === 'Human';
    }
  }, {
    key: 'cloneProps',
    value: function cloneProps() {
      return {
        id: this.id,
        position: this.position,
        lastPosition: this.lastPosition
      };
    }
  }, {
    key: 'isAttractedTo',
    value: function isAttractedTo(nearestHumanoid) {
      return nearestHumanoid.isPlayer() || nearestHumanoid.isHuman();
    }
  }, {
    key: 'storeLastPosition',
    value: function storeLastPosition() {
      this.lastPosition = { x: this.position.x, y: this.position.y };
    }
  }, {
    key: 'isLastMoveRepeated',
    value: function isLastMoveRepeated(potentialMove) {
      return Math.abs(potentialMove.x - this.lastPosition.x) < gameSettings.repitionTolerance && Math.abs(potentialMove.y - this.lastPosition.y) < gameSettings.repitionTolerance;
    }
  }, {
    key: 'moveNearest',
    value: function moveNearest(nearestObject) {
      var potentialMove = undefined;

      if (this.isAttractedTo(nearestObject)) {
        potentialMove = Pathfinder.moveTowards(this.position, nearestObject.position, this.speed);
      } else {
        potentialMove = Pathfinder.moveAwayFrom(this.position, nearestObject.position, this.speed);
      }
      if (this.lastPosition.x === this.position.x && this.lastPosition.y === this.position.y) {
        this.storeLastPosition();
        return Pathfinder.moveRandomly(this.position, this.speed);
      } else if (this.isLastMoveRepeated(potentialMove)) {
        this.storeLastPosition();
        return Pathfinder.movePerpendicularTo(this.position, nearestObject.position, this.speed);
      } else {
        this.storeLastPosition();
        return potentialMove;
      }
    }
  }]);

  return Humanoid;
})();

module.exports = Humanoid;

},{"pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/infectedHuman.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Humanoid = undefined,
    Zombie = undefined,
    Settings = undefined;

Humanoid = require('humanoids/humanoid');
Zombie = require('humanoids/zombie');
Settings = require('settings');

var InfectedHuman = (function (_Humanoid) {
  _inherits(InfectedHuman, _Humanoid);

  function InfectedHuman(opts) {
    _classCallCheck(this, InfectedHuman);

    _get(Object.getPrototypeOf(InfectedHuman.prototype), 'constructor', this).call(this, opts);
    this.speed = 0;
    this.timeSinceInfection = 0;
  }

  _createClass(InfectedHuman, [{
    key: 'isAbleToBite',
    value: function isAbleToBite() {
      return false;
    }
  }, {
    key: 'transform',
    value: function transform() {
      return new Zombie(this.cloneProps());
    }
  }, {
    key: 'incrementTimeSinceInfection',
    value: function incrementTimeSinceInfection() {
      this.timeSinceInfection++;
    }
  }, {
    key: 'handleNextMove',
    value: function handleNextMove(opts) {
      var humanoids = opts.humanoids;

      this.incrementTimeSinceInfection();
      if (this.timeSinceInfection >= Settings.infectionIncubationTime) {
        humanoids[this.id] = this.transform();
      }
    }
  }]);

  return InfectedHuman;
})(Humanoid);

module.exports = InfectedHuman;

},{"humanoids/humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js","humanoids/zombie":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/zombie.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/player.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pathfinder = undefined,
    gameSettings = undefined,
    Humanoid = undefined,
    InfectedHuman = undefined;

gameSettings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');
InfectedHuman = require('humanoids/infectedHuman');

var Player = (function (_Humanoid) {
  _inherits(Player, _Humanoid);

  function Player(opts) {
    _classCallCheck(this, Player);

    _get(Object.getPrototypeOf(Player.prototype), 'constructor', this).call(this, opts);
    this.speed = gameSettings.playerSpeed;
  }

  _createClass(Player, [{
    key: 'isAbleToBite',
    value: function isAbleToBite() {
      return false;
    }
  }, {
    key: 'transform',
    value: function transform() {
      return new InfectedHuman(this.cloneProps());
    }
  }, {
    key: 'handleNextMove',
    value: function handleNextMove(opts) {
      var targetLoc = undefined,
          coords = undefined;
      var dx = opts.dx;
      var dy = opts.dy;

      targetLoc = {
        x: this.position.x + dx * this.speed,
        y: this.position.y + dy * this.speed
      };
      coords = Pathfinder.moveTowards(this.position, targetLoc, this.speed);
      this.position = Pathfinder.getRelativePosition(coords);
    }
  }]);

  return Player;
})(Humanoid);

module.exports = Player;

},{"humanoids/humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js","humanoids/infectedHuman":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/infectedHuman.js","pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/zombie.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pathfinder = undefined,
    gameSettings = undefined,
    Humanoid = undefined;

gameSettings = require('settings');
Pathfinder = require('pathfinder');
Humanoid = require('humanoids/humanoid');

var Zombie = (function (_Humanoid) {
  _inherits(Zombie, _Humanoid);

  function Zombie(opts) {
    _classCallCheck(this, Zombie);

    _get(Object.getPrototypeOf(Zombie.prototype), 'constructor', this).call(this, opts);
    this.speed = gameSettings.zombieSpeed;
  }

  _createClass(Zombie, [{
    key: 'isAbleToBite',
    value: function isAbleToBite(human) {
      return human && Pathfinder.distanceTo(human.position, this.position) < gameSettings.zombieBiteRange;
    }
  }, {
    key: 'transform',
    value: function transform() {
      return this;
    }
  }, {
    key: 'isValidDestination',
    value: function isValidDestination(humanoids, targetPosition) {
      return !humanoids.some(function (humanoid) {
        return Pathfinder.arePositionsEqual(humanoid.position, targetPosition);
      });
    }
  }, {
    key: 'getNextDestination',
    value: function getNextDestination(nearestLivingHumanoid, nearestZombie) {
      var zombieDistance = undefined,
          livingHumanoidDistance = undefined;

      livingHumanoidDistance = Number.POSITIVE_INFINITY;
      zombieDistance = Number.POSITIVE_INFINITY;

      if (nearestZombie) {
        zombieDistance = Pathfinder.distanceTo(nearestZombie.position, this.position) * gameSettings.zombieSpread;
      }

      if (nearestLivingHumanoid) {
        livingHumanoidDistance = Pathfinder.distanceTo(nearestLivingHumanoid.position, this.position);
      }

      if (livingHumanoidDistance < zombieDistance) {
        return this.moveNearest(nearestLivingHumanoid);
      } else {
        return this.moveNearest(nearestZombie);
      }
    }
  }, {
    key: 'handleNextMove',
    value: function handleNextMove(opts) {
      var destination = undefined;
      var nearestHumanoid = opts.nearestHumanoid;
      var nearestZombie = opts.nearestZombie;
      var humanoids = opts.humanoids;

      if (this.isAbleToBite(nearestHumanoid)) {
        humanoids[nearestHumanoid.id] = nearestHumanoid.transform();
      }

      destination = Pathfinder.getRelativePosition(this.getNextDestination(nearestHumanoid, nearestZombie));

      if (this.isValidDestination(humanoids, destination)) {
        this.position = destination;
      }
    }
  }]);

  return Zombie;
})(Humanoid);

module.exports = Zombie;

},{"humanoids/humanoid":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/humanoids/humanoid.js","pathfinder":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js","settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/initialize.js":[function(require,module,exports){
'use strict';

var GameOfAfterlife = undefined,
    gameOfAfterlife = undefined;

GameOfAfterlife = require('game');

document.getElementById('initialize-game').addEventListener('click', function () {
  document.getElementById('overlay').className = 'hide';
  gameOfAfterlife = new GameOfAfterlife();
  gameOfAfterlife.init();
});

},{"game":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/game.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/pathfinder.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Settings = undefined;

Settings = require('settings');

var Pathfinder = (function () {
  function Pathfinder() {
    _classCallCheck(this, Pathfinder);
  }

  _createClass(Pathfinder, null, [{
    key: 'getRelativePosition',
    value: function getRelativePosition(position) {
      var x = undefined,
          y = undefined;

      x = (position.x + Settings.defaultWidth) % Settings.defaultWidth;
      y = (position.y + Settings.defaultHeight) % Settings.defaultHeight;
      return { x: x, y: y };
    }
  }, {
    key: 'arePositionsEqual',
    value: function arePositionsEqual(position1, position2) {
      return position1.x === position2.x && position1.y === position2.y;
    }
  }, {
    key: 'moveTowards',
    value: function moveTowards(currentPosition, friendlyLocation, speed) {
      var deltaY = undefined,
          deltaX = undefined,
          length = undefined;

      deltaY = friendlyLocation.y - currentPosition.y;
      deltaX = friendlyLocation.x - currentPosition.x;
      length = this.distanceTo(friendlyLocation, currentPosition);
      if (speed !== 0 && length < speed) {
        return friendlyLocation;
      } else {
        return {
          x: currentPosition.x + deltaX / length * speed,
          y: currentPosition.y + deltaY / length * speed
        };
      }
    }
  }, {
    key: 'moveAwayFrom',
    value: function moveAwayFrom(currentPosition, hostileLocation, speed) {
      return this.moveTowards(currentPosition, hostileLocation, -speed);
    }
  }, {
    key: 'movePerpendicularTo',
    value: function movePerpendicularTo(currentPosition, friendlyLocation, speed) {
      var deltaY = undefined,
          deltaX = undefined,
          length = undefined;

      deltaY = friendlyLocation.y - currentPosition.y;
      deltaX = friendlyLocation.x - currentPosition.x;
      length = this.distanceTo(friendlyLocation, currentPosition);
      if (speed !== 0 && length < speed) {
        return friendlyLocation;
      } else {
        return {
          x: currentPosition.x + deltaX / length * speed,
          y: currentPosition.y - deltaY / length * speed
        };
      }
    }
  }, {
    key: 'distanceTo',
    value: function distanceTo(targetLocation, currentPosition) {
      var deltaY = undefined,
          deltaX = undefined;

      deltaY = targetLocation.y - currentPosition.y;
      deltaX = targetLocation.x - currentPosition.x;
      return Math.sqrt(Math.pow(deltaY, 2) + Math.pow(deltaX, 2));
    }
  }, {
    key: 'moveRandomly',
    value: function moveRandomly(currentPosition, speed) {
      var angle = undefined;

      angle = Math.random() * 2 * Math.PI;
      return {
        x: currentPosition.x + Math.cos(angle) * speed,
        y: currentPosition.y + Math.sin(angle) * speed
      };
    }
  }]);

  return Pathfinder;
})();

module.exports = Pathfinder;

},{"settings":"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js"}],"/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/settings.js":[function(require,module,exports){
"use strict";

var gameSettings = undefined;

gameSettings = {
  humanSpeed: 7,
  playerSpeed: 6,
  zombieSpeed: 4,
  humanCount: 30,
  zombieCount: 3,
  infectionIncubationTime: 5, // turn delay until infected become zombies. higher numbers take
  // longer to transform
  turnDelay: { normal: 100, fast: 25 }, // sets the timeout between turns
  repitionTolerance: 1, // the range in which a move is considered repetitive
  // lower values will reduce the size of the range.
  zombieSpread: 3, // lower zombieSpread values will cause zombies to spread out more
  humanFearRange: 20, // the range at which humans start running from zombies.
  zombieBiteRange: 10, // the range at which a zombie can bite a human.

  // TODO: Sync canvas with this value
  defaultWidth: 600, // default canvas width
  defaultHeight: 400 };

// default canvas height
module.exports = gameSettings;

},{}]},{},["/Users/philipavargas/Desktop/js_game_of_afterlife/public/js/game/initialize.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcGhpbGlwYXZhcmdhcy9EZXNrdG9wL2pzX2dhbWVfb2ZfYWZ0ZXJsaWZlL3B1YmxpYy9qcy9nYW1lL2JvYXJkLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9nYW1lLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9odW1hbm9pZEZhY3RvcnkuanMiLCIvVXNlcnMvcGhpbGlwYXZhcmdhcy9EZXNrdG9wL2pzX2dhbWVfb2ZfYWZ0ZXJsaWZlL3B1YmxpYy9qcy9nYW1lL2h1bWFub2lkcy9odW1hbi5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaHVtYW5vaWRzL2h1bWFub2lkLmpzIiwiL1VzZXJzL3BoaWxpcGF2YXJnYXMvRGVza3RvcC9qc19nYW1lX29mX2FmdGVybGlmZS9wdWJsaWMvanMvZ2FtZS9odW1hbm9pZHMvaW5mZWN0ZWRIdW1hbi5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaHVtYW5vaWRzL3BsYXllci5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaHVtYW5vaWRzL3pvbWJpZS5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvaW5pdGlhbGl6ZS5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvcGF0aGZpbmRlci5qcyIsIi9Vc2Vycy9waGlsaXBhdmFyZ2FzL0Rlc2t0b3AvanNfZ2FtZV9vZl9hZnRlcmxpZmUvcHVibGljL2pzL2dhbWUvc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxJQUFJLFVBQVUsWUFBQSxDQUFDOztBQUVmLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0lBRTdCLEtBQUs7QUFDRSxXQURQLEtBQUssQ0FDRyxVQUFVLEVBQUM7MEJBRG5CLEtBQUs7O0FBRVAsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixRQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNaLFFBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1osUUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztHQUM3Qzs7ZUFQRyxLQUFLOztXQVNHLHdCQUFFO0FBQ1osYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFTLFFBQVEsRUFBRTtBQUM1QyxlQUFPLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7T0FDbEQsQ0FBQyxDQUFDO0tBQ0o7OztXQUVZLHlCQUFFO0FBQ2IsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFTLFFBQVEsRUFBRTtBQUM1QyxlQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztPQUM1QixDQUFDLENBQUM7S0FDSjs7O1dBRW9CLGlDQUFFO0FBQ3JCLFVBQUksZUFBZSxZQUFBO1VBQUUsVUFBVSxZQUFBO1VBQUUsZUFBZSxZQUFBLENBQUM7O0FBRWpELHFCQUFlLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUM5QixNQUFNLENBQUMsSUFBSSxD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b290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJsZXQgUGF0aGZpbmRlcjtcblxuUGF0aGZpbmRlciA9IHJlcXVpcmUoJ3BhdGhmaW5kZXInKTtcblxuY2xhc3MgQm9hcmQge1xuICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzKXtcbiAgICB0aGlzLmh1bWFub2lkID0gbnVsbDtcbiAgICB0aGlzLnNjb3JlID0gMDtcbiAgICB0aGlzLmR4ID0gMDtcbiAgICB0aGlzLmR5ID0gMDtcbiAgICB0aGlzLmh1bWFub2lkcyA9IGF0dHJpYnV0ZXMuaHVtYW5vaWRzIHx8IFtdO1xuICB9XG5cbiAgaXNHYW1lQWN0aXZlKCl7XG4gICAgcmV0dXJuIHRoaXMuaHVtYW5vaWRzLnNvbWUoZnVuY3Rpb24oaHVtYW5vaWQpIHtcbiAgICAgIHJldHVybiBodW1hbm9pZC5pc0h1bWFuKCkgfHwgaHVtYW5vaWQuaXNQbGF5ZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzUGxheWVyQWxpdmUoKXtcbiAgICByZXR1cm4gdGhpcy5odW1hbm9pZHMuc29tZShmdW5jdGlvbihodW1hbm9pZCkge1xuICAgICAgcmV0dXJuIGh1bWFub2lkLmlzUGxheWVyKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZWFyZXN0TGl2aW5nSHVtYW5vaWQoKXtcbiAgICBsZXQgbGl2aW5nSHVtYW5vaWRzLCBjbG9zZXN0UG9zLCBjbG9zZXN0SHVtYW5vaWQ7XG5cbiAgICBsaXZpbmdIdW1hbm9pZHMgPSB0aGlzLmZpbmRTaW1pbGFySHVtYW5vaWRzKCdQbGF5ZXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHRoaXMuZmluZFNpbWlsYXJIdW1hbm9pZHMoJ0h1bWFuJykpO1xuICAgIGNsb3Nlc3RQb3MgPSB0aGlzLmZpbmRDbG9zZXN0UG9zKGxpdmluZ0h1bWFub2lkcyk7XG4gICAgY2xvc2VzdEh1bWFub2lkID0gdGhpcy5maW5kQ2xvc2VzdEh1bWFub2lkKGNsb3Nlc3RQb3MsIGxpdmluZ0h1bWFub2lkcyk7XG4gICAgcmV0dXJuIGNsb3Nlc3RIdW1hbm9pZDtcbiAgfVxuXG4gIG5lYXJlc3Rab21iaWUoKXtcbiAgICBsZXQgc2ltaWxhckh1bWFub2lkcywgY2xvc2VzdFBvcywgY2xvc2VzdEh1bWFub2lkO1xuXG4gICAgc2ltaWxhckh1bWFub2lkcyA9IHRoaXMuZmluZFNpbWlsYXJIdW1hbm9pZHMoJ1pvbWJpZScpO1xuICAgIGNsb3Nlc3RQb3MgPSB0aGlzLmZpbmRDbG9zZXN0UG9zKHNpbWlsYXJIdW1hbm9pZHMpO1xuICAgIGNsb3Nlc3RIdW1hbm9pZCA9IHRoaXMuZmluZENsb3Nlc3RIdW1hbm9pZChjbG9zZXN0UG9zLCBzaW1pbGFySHVtYW5vaWRzKTtcbiAgICByZXR1cm4gY2xvc2VzdEh1bWFub2lkO1xuICB9XG5cbiAgbmV4dFR1cm4oKXtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5odW1hbm9pZHMubGVuZ3RoOyBpKyspe1xuICAgICAgdGhpcy5odW1hbm9pZCA9IHRoaXMuaHVtYW5vaWRzW2ldO1xuICAgICAgdGhpcy5odW1hbm9pZC5oYW5kbGVOZXh0TW92ZSh7XG4gICAgICAgIG5lYXJlc3RIdW1hbm9pZDogdGhpcy5uZWFyZXN0TGl2aW5nSHVtYW5vaWQoKSxcbiAgICAgICAgbmVhcmVzdFpvbWJpZTogdGhpcy5uZWFyZXN0Wm9tYmllKCksXG4gICAgICAgIGR4OiB0aGlzLmR4LFxuICAgICAgICBkeTogdGhpcy5keSxcbiAgICAgICAgaHVtYW5vaWRzOiB0aGlzLmh1bWFub2lkcyxcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmluY3JlbWVudFNjb3JlKCk7XG4gIH1cblxuICBpbmNyZW1lbnRTY29yZSgpe1xuICAgIGlmICh0aGlzLmlzUGxheWVyQWxpdmUoKSkgeyB0aGlzLnNjb3JlICs9IDEwOyB9XG4gIH1cblxuICBvdGhlckh1bWFub2lkcygpe1xuICAgIHJldHVybiB0aGlzLmh1bWFub2lkcy5maWx0ZXIoKGN1cnJlbnRIdW1hbm9pZCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaHVtYW5vaWQuaWQgIT09IGN1cnJlbnRIdW1hbm9pZC5pZDtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmRTaW1pbGFySHVtYW5vaWRzKGh1bWFub2lkVHlwZSl7XG4gICAgcmV0dXJuIHRoaXMub3RoZXJIdW1hbm9pZHMoKS5maWx0ZXIoZnVuY3Rpb24oaHVtYW5vaWQpe1xuICAgICAgcmV0dXJuIGh1bWFub2lkLmh1bWFuVHlwZSA9PT0gaHVtYW5vaWRUeXBlO1xuICAgIH0pO1xuICB9XG5cbiAgZmluZENsb3Nlc3RQb3Mob3RoZXJIdW1hbm9pZHMpe1xuICAgIGxldCBjbG9zZXN0UG9zLCBkaXN0O1xuXG4gICAgY2xvc2VzdFBvcyA9IFtdO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBvdGhlckh1bWFub2lkcy5sZW5ndGg7IGkrKyl7XG4gICAgICBkaXN0ID0gUGF0aGZpbmRlci5kaXN0YW5jZVRvKG90aGVySHVtYW5vaWRzW2ldLnBvc2l0aW9uLCB0aGlzLmh1bWFub2lkLnBvc2l0aW9uKTtcbiAgICAgIGNsb3Nlc3RQb3MucHVzaChkaXN0KTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb3Nlc3RQb3M7XG4gIH1cblxuICBmaW5kQ2xvc2VzdEh1bWFub2lkKGNsb3Nlc3RQb3MsIG90aGVySHVtYW5vaWRzKXtcbiAgICBsZXQgY2xvc2VzdEh1bWFub2lkVmFsdWUsIGNsb3Nlc3RIdW1hbm9pZDtcblxuICAgIGNsb3Nlc3RIdW1hbm9pZFZhbHVlID0gTWF0aC5taW4uYXBwbHkobnVsbCwgY2xvc2VzdFBvcyk7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGNsb3Nlc3RQb3MubGVuZ3RoOyBpKyspe1xuICAgICAgaWYoY2xvc2VzdFBvc1tpXSA9PT0gY2xvc2VzdEh1bWFub2lkVmFsdWUpeyBjbG9zZXN0SHVtYW5vaWQgPSBvdGhlckh1bWFub2lkc1tpXTsgfVxuICAgIH1cbiAgICByZXR1cm4gY2xvc2VzdEh1bWFub2lkO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm9hcmQ7XG4iLCJsZXQgQm9hcmQsIEh1bWFub2lkQnVpbGRlciwgZ2FtZVNldHRpbmdzO1xuXG5Cb2FyZCA9IHJlcXVpcmUoJ2JvYXJkJyk7XG5IdW1hbm9pZEJ1aWxkZXIgPSByZXF1aXJlKCdodW1hbm9pZEZhY3RvcnknKTtcbmdhbWVTZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJyk7XG5cbmNsYXNzIEdhbWVPZkFmdGVybGlmZSB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgbGV0IGNhbnZhcywgYWxsSHVtYW5vaWRzO1xuXG4gICAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpWzBdO1xuICAgIGFsbEh1bWFub2lkcyA9IEh1bWFub2lkQnVpbGRlci5wb3B1bGF0ZShnYW1lU2V0dGluZ3MuaHVtYW5Db3VudCwgZ2FtZVNldHRpbmdzLnpvbWJpZUNvdW50KTtcbiAgICB0aGlzLmhhc0JlZ3VuID0gZmFsc2U7XG4gICAgdGhpcy53aWR0aCA9IGNhbnZhcy53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG4gICAgdGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEJvYXJkKHsgaHVtYW5vaWRzOiBhbGxIdW1hbm9pZHMgfSk7XG4gICAgdGhpcy5odW1hbm9pZENvbG9yTWFwID0ge1xuICAgICAgSHVtYW46ICcjMDBhYWFhJyxcbiAgICAgIFpvbWJpZTogJyNmZjAwMDAnLFxuICAgICAgUGxheWVyOiAnIzAwY2MwMCcsXG4gICAgICBJbmZlY3RlZEh1bWFuOiAnIzc3MDAwMCdcbiAgICB9O1xuICB9XG5cbiAgYmluZFBsYXllck1vdmVtZW50KCl7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgICAgLy8gcyA9IDgzXG4gICAgICAvLyB3ID0gODdcbiAgICAgIC8vIGEgPSA2NVxuICAgICAgLy8gZCA9IDY4XG4gICAgICBpZiAoZS53aGljaCA9PT0gNjggfHwgZS53aGljaCA9PT0gNjUpeyB0aGlzLmJvYXJkLmR4ID0gMDsgfVxuICAgICAgaWYgKGUud2hpY2ggPT09IDgzIHx8IGUud2hpY2ggPT09IDg3KXsgdGhpcy5ib2FyZC5keSA9IDA7IH1cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUud2hpY2ggPT09IDY1KXsgdGhpcy5ib2FyZC5keCA9IC0xOyB9XG4gICAgICBlbHNlIGlmIChlLndoaWNoID09PSA2OCl7IHRoaXMuYm9hcmQuZHggPSAxOyB9XG4gICAgICBlbHNlIGlmIChlLndoaWNoID09PSA4Nyl7IHRoaXMuYm9hcmQuZHkgPSAtMTsgfVxuICAgICAgZWxzZSBpZiAoZS53aGljaCA9PT0gODMpeyB0aGlzLmJvYXJkLmR5ID0gMTsgfVxuICAgIH0pO1xuICB9XG5cbiAgZHJhd0h1bWFub2lkcygpe1xuICAgIGxldCBwbGF5ZXIsIHgsIHk7XG5cbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2FyZC5odW1hbm9pZHMubGVuZ3RoOyBpKyspe1xuICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICBwbGF5ZXIgPSB0aGlzLmJvYXJkLmh1bWFub2lkc1tpXTtcbiAgICAgIHggPSBwbGF5ZXIucG9zaXRpb24ueDtcbiAgICAgIHkgPSBwbGF5ZXIucG9zaXRpb24ueTtcbiAgICAgIHRoaXMuY3R4LmFyYyh4LCB5LCA1LCAwLCAyICogTWF0aC5QSSk7XG4gICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSB0aGlzLmh1bWFub2lkQ29sb3JNYXBbcGxheWVyLmh1bWFuVHlwZV07XG4gICAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB9XG4gIH1cblxuICBjYWxsTmV4dFR1cm4oKXtcbiAgICBsZXQgZGVsYXksIG5leHRSZXF1ZXN0O1xuXG4gICAgbmV4dFJlcXVlc3QgPSAoKSA9PiB7XG4gICAgICB0aGlzLmRyYXdIdW1hbm9pZHMoKTtcbiAgICAgIGlmICh0aGlzLmJvYXJkLmlzR2FtZUFjdGl2ZSgpKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlJykuaW5uZXJIVE1MID0gdGhpcy5ib2FyZC5zY29yZTtcbiAgICAgICAgdGhpcy5ib2FyZC5uZXh0VHVybigpO1xuICAgICAgICBkZWxheSA9ICh0aGlzLmJvYXJkLmlzUGxheWVyQWxpdmUoKSA/IGdhbWVTZXR0aW5ncy50dXJuRGVsYXkubm9ybWFsIDogZ2FtZVNldHRpbmdzLnR1cm5EZWxheS5mYXN0KTtcbiAgICAgICAgc2V0VGltZW91dChuZXh0UmVxdWVzdCwgZGVsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXktbWVzc2FnZScpXG4gICAgICAgIC5pbm5lckhUTUwgPSBgRVZFUllCT0RZIElTIERFQUQhISFcXG5Zb3VyIHNjb3JlIHdhczogJHt0aGlzLmJvYXJkLnNjb3JlfWA7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5JykuY2xhc3NOYW1lID0gJyc7XG4gICAgICB9XG4gICAgfTtcbiAgICBzZXRUaW1lb3V0KG5leHRSZXF1ZXN0LCBnYW1lU2V0dGluZ3MudHVybkRlbGF5Lm5vcm1hbCk7XG4gIH1cblxuICBpbml0KCl7XG4gICAgdGhpcy5iaW5kUGxheWVyTW92ZW1lbnQoKTtcbiAgICB0aGlzLmNhbGxOZXh0VHVybigpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZU9mQWZ0ZXJsaWZlO1xuIiwibGV0IEh1bWFuLCBab21iaWUsIFBsYXllcjtcblxuSHVtYW4gPSByZXF1aXJlKCdodW1hbm9pZHMvaHVtYW4nKTtcblpvbWJpZSA9IHJlcXVpcmUoJ2h1bWFub2lkcy96b21iaWUnKTtcblBsYXllciA9IHJlcXVpcmUoJ2h1bWFub2lkcy9wbGF5ZXInKTtcblxuY2xhc3MgSHVtYW5vaWRCdWlsZGVyIHtcbiAgc3RhdGljIGh1bWFub2lkTWFwKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIEh1bWFuLFxuICAgICAgWm9tYmllLFxuICAgICAgUGxheWVyXG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBwb3B1bGF0ZShudW1iZXJPZkh1bWFucywgbnVtYmVyT2Zab21iaWVzKXtcbiAgICBsZXQgcG9wdWxhdGlvbjtcblxuICAgIHBvcHVsYXRpb24gPSBbXTtcbiAgICBwb3B1bGF0aW9uID0gcG9wdWxhdGlvbi5jb25jYXQodGhpcy5jcmVhdGlvbihudW1iZXJPZkh1bWFucywgJ0h1bWFuJykpO1xuICAgIHBvcHVsYXRpb24gPSBwb3B1bGF0aW9uLmNvbmNhdChcbiAgICAgIHRoaXMuY3JlYXRpb24obnVtYmVyT2Zab21iaWVzLCAnWm9tYmllJywgcG9wdWxhdGlvbi5sZW5ndGgpXG4gICAgKTtcbiAgICBwb3B1bGF0aW9uID0gcG9wdWxhdGlvbi5jb25jYXQoXG4gICAgICB0aGlzLmNyZWF0aW9uKDEsICdQbGF5ZXInLCBwb3B1bGF0aW9uLmxlbmd0aClcbiAgICApO1xuICAgIHJldHVybiBwb3B1bGF0aW9uO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0aW9uKG51bWJlciwgdHlwZSwgYmFzZUlkID0gMCl7XG4gICAgbGV0IHBvcHVsYXRpb24sIG5ld0h1bWFub2lkLCBtYXAsIEg7XG5cbiAgICBtYXAgPSB0aGlzLmh1bWFub2lkTWFwKCk7XG4gICAgcG9wdWxhdGlvbiA9IFtdO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBudW1iZXI7IGkrKyl7XG4gICAgICBIID0gbWFwW3R5cGVdO1xuICAgICAgbmV3SHVtYW5vaWQgPSBuZXcgSCh7IGlkOiBiYXNlSWQgKyBpIH0pO1xuICAgICAgcG9wdWxhdGlvbi5wdXNoKG5ld0h1bWFub2lkKTtcbiAgICB9XG4gICAgcmV0dXJuIHBvcHVsYXRpb247XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIdW1hbm9pZEJ1aWxkZXI7XG4iLCJsZXQgUGF0aGZpbmRlciwgZ2FtZVNldHRpbmdzLCBIdW1hbm9pZCwgSW5mZWN0ZWRIdW1hbjtcblxuZ2FtZVNldHRpbmdzID0gcmVxdWlyZSgnc2V0dGluZ3MnKTtcblBhdGhmaW5kZXIgPSByZXF1aXJlKCdwYXRoZmluZGVyJyk7XG5IdW1hbm9pZCA9IHJlcXVpcmUoJ2h1bWFub2lkcy9odW1hbm9pZCcpO1xuSW5mZWN0ZWRIdW1hbiA9IHJlcXVpcmUoJ2h1bWFub2lkcy9pbmZlY3RlZEh1bWFuJyk7XG5cbmNsYXNzIEh1bWFuIGV4dGVuZHMgSHVtYW5vaWQge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy5zcGVlZCA9IGdhbWVTZXR0aW5ncy5odW1hblNwZWVkO1xuICB9XG5cbiAgaXNBYmxlVG9CaXRlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRyYW5zZm9ybSgpIHtcbiAgICByZXR1cm4oXG4gICAgICBuZXcgSW5mZWN0ZWRIdW1hbih0aGlzLmNsb25lUHJvcHMoKSlcbiAgICApO1xuICB9XG5cbiAgaGFuZGxlTmV4dE1vdmUob3B0cyl7XG4gICAgbGV0IGRlc3RpbmF0aW9uO1xuICAgIGxldCB7IG5lYXJlc3RIdW1hbm9pZCwgbmVhcmVzdFpvbWJpZSwgaHVtYW5vaWRzIH0gPSBvcHRzO1xuXG4gICAgZGVzdGluYXRpb24gPSBQYXRoZmluZGVyLmdldFJlbGF0aXZlUG9zaXRpb24oXG4gICAgICB0aGlzLmdldE5leHREZXN0aW5hdGlvbihuZWFyZXN0SHVtYW5vaWQsIG5lYXJlc3Rab21iaWUpXG4gICAgKTtcbiAgICBpZiAodGhpcy5pc1ZhbGlkRGVzdGluYXRpb24oaHVtYW5vaWRzLCBkZXN0aW5hdGlvbikpIHtcbiAgICAgIHRoaXMucG9zaXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICB9XG4gIH1cblxuICBpc1ZhbGlkRGVzdGluYXRpb24oaHVtYW5vaWRzLCB0YXJnZXRQb3NpdGlvbikge1xuICAgIHJldHVybiAhaHVtYW5vaWRzLnNvbWUoKGh1bWFub2lkKSA9PiB7XG4gICAgICByZXR1cm4gUGF0aGZpbmRlci5hcmVQb3NpdGlvbnNFcXVhbChodW1hbm9pZC5wb3NpdGlvbiwgdGFyZ2V0UG9zaXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TmV4dERlc3RpbmF0aW9uKG5lYXJlc3RIdW1hbm9pZCwgbmVhcmVzdFpvbWJpZSl7XG4gICAgaWYgKHRoaXMuaXNab21iaWVOZWFyZXN0KG5lYXJlc3Rab21iaWUsIG5lYXJlc3RIdW1hbm9pZCkpe1xuICAgICAgcmV0dXJuIHRoaXMubW92ZU5lYXJlc3QobmVhcmVzdFpvbWJpZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm1vdmVOZWFyZXN0KG5lYXJlc3RIdW1hbm9pZCk7XG4gICAgfVxuICB9XG5cbiAgaXNab21iaWVOZWFyZXN0KG5lYXJlc3Rab21iaWUsIG5lYXJlc3RIdW1hbm9pZCkge1xuICAgIGxldCB6b21iaWVEaXN0YW5jZTtcblxuICAgIGlmIChuZWFyZXN0Wm9tYmllKSB7XG4gICAgICB6b21iaWVEaXN0YW5jZSA9IFBhdGhmaW5kZXIuZGlzdGFuY2VUbyhuZWFyZXN0Wm9tYmllLnBvc2l0aW9uLCB0aGlzLnBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBhIHpvbWJpZSBpcyB3aXRoaW4gdGhlIGh1bWFuIGZlYXIgcmFuZ2UsIG9yIHRoZXJlIGFyZSBubyBvdGhlciBsaXZpbmcgaHVtYW5vaWRzIHJlbWFpbmluZ1xuICAgIHJldHVybiAoem9tYmllRGlzdGFuY2UgPCBnYW1lU2V0dGluZ3MuaHVtYW5GZWFyUmFuZ2UgfHwgKCFuZWFyZXN0SHVtYW5vaWQpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEh1bWFuO1xuIiwibGV0IFBhdGhmaW5kZXIsIGdhbWVTZXR0aW5ncztcblxuUGF0aGZpbmRlciA9IHJlcXVpcmUoJ3BhdGhmaW5kZXInKTtcbmdhbWVTZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJyk7XG5cbmNsYXNzIEh1bWFub2lkIHtcbiAgY29uc3RydWN0b3IoYXR0cmlidXRlcyl7XG4gICAgdGhpcy5pZCA9IGF0dHJpYnV0ZXMuaWQ7XG4gICAgdGhpcy5wb3NpdGlvbiA9IGF0dHJpYnV0ZXMucG9zaXRpb24gfHxcbiAgICAgIHsgeDogKDUgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1OTEpKSwgeTogKDUgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzOTEpKSB9O1xuICAgIHRoaXMubGFzdFBvc2l0aW9uID0geyB4OiB0aGlzLnBvc2l0aW9uLngsIHk6IHRoaXMucG9zaXRpb24ueSB9O1xuICAgIHRoaXMuaHVtYW5UeXBlID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgaXNab21iaWUoKXtcbiAgICByZXR1cm4gdGhpcy5odW1hblR5cGUgPT09ICdab21iaWUnO1xuICB9XG5cbiAgaXNQbGF5ZXIoKXtcbiAgICByZXR1cm4gdGhpcy5odW1hblR5cGUgPT09ICdQbGF5ZXInO1xuICB9XG5cbiAgaXNIdW1hbigpe1xuICAgIHJldHVybiB0aGlzLmh1bWFuVHlwZSA9PT0gJ0h1bWFuJztcbiAgfVxuXG4gIGNsb25lUHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgcG9zaXRpb246IHRoaXMucG9zaXRpb24sXG4gICAgICBsYXN0UG9zaXRpb246IHRoaXMubGFzdFBvc2l0aW9uXG4gICAgfTtcbiAgfVxuXG4gIGlzQXR0cmFjdGVkVG8obmVhcmVzdEh1bWFub2lkKXtcbiAgICByZXR1cm4gbmVhcmVzdEh1bWFub2lkLmlzUGxheWVyKCkgfHwgbmVhcmVzdEh1bWFub2lkLmlzSHVtYW4oKTtcbiAgfVxuXG4gIHN0b3JlTGFzdFBvc2l0aW9uKCl7XG4gICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7IHg6IHRoaXMucG9zaXRpb24ueCwgeTogdGhpcy5wb3NpdGlvbi55IH07XG4gIH1cblxuICBpc0xhc3RNb3ZlUmVwZWF0ZWQocG90ZW50aWFsTW92ZSl7XG4gICAgcmV0dXJuIChcbiAgICAgIChNYXRoLmFicyhwb3RlbnRpYWxNb3ZlLnggLSB0aGlzLmxhc3RQb3NpdGlvbi54KSA8IGdhbWVTZXR0aW5ncy5yZXBpdGlvblRvbGVyYW5jZSkgJiZcbiAgICAgICAgKE1hdGguYWJzKHBvdGVudGlhbE1vdmUueSAtIHRoaXMubGFzdFBvc2l0aW9uLnkpIDwgZ2FtZVNldHRpbmdzLnJlcGl0aW9uVG9sZXJhbmNlKVxuICAgICk7XG4gIH1cblxuICBtb3ZlTmVhcmVzdChuZWFyZXN0T2JqZWN0KXtcbiAgICBsZXQgcG90ZW50aWFsTW92ZTtcblxuICAgIGlmICh0aGlzLmlzQXR0cmFjdGVkVG8obmVhcmVzdE9iamVjdCkpe1xuICAgICAgcG90ZW50aWFsTW92ZSA9IFBhdGhmaW5kZXIubW92ZVRvd2FyZHModGhpcy5wb3NpdGlvbiwgbmVhcmVzdE9iamVjdC5wb3NpdGlvbiwgdGhpcy5zcGVlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvdGVudGlhbE1vdmUgPSBQYXRoZmluZGVyLm1vdmVBd2F5RnJvbSh0aGlzLnBvc2l0aW9uLCBuZWFyZXN0T2JqZWN0LnBvc2l0aW9uLCB0aGlzLnNwZWVkKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdFBvc2l0aW9uLnggPT09IHRoaXMucG9zaXRpb24ueCAmJiB0aGlzLmxhc3RQb3NpdGlvbi55ID09PSB0aGlzLnBvc2l0aW9uLnkpe1xuICAgICAgdGhpcy5zdG9yZUxhc3RQb3NpdGlvbigpO1xuICAgICAgcmV0dXJuIFBhdGhmaW5kZXIubW92ZVJhbmRvbWx5KHRoaXMucG9zaXRpb24sIHRoaXMuc3BlZWQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0xhc3RNb3ZlUmVwZWF0ZWQocG90ZW50aWFsTW92ZSkpe1xuICAgICAgdGhpcy5zdG9yZUxhc3RQb3NpdGlvbigpO1xuICAgICAgcmV0dXJuIFBhdGhmaW5kZXIubW92ZVBlcnBlbmRpY3VsYXJUbyh0aGlzLnBvc2l0aW9uLCBuZWFyZXN0T2JqZWN0LnBvc2l0aW9uLCB0aGlzLnNwZWVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdG9yZUxhc3RQb3NpdGlvbigpO1xuICAgICAgcmV0dXJuIHBvdGVudGlhbE1vdmU7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSHVtYW5vaWQ7XG4iLCJsZXQgSHVtYW5vaWQsIFpvbWJpZSwgU2V0dGluZ3M7XG5cbkh1bWFub2lkID0gcmVxdWlyZSgnaHVtYW5vaWRzL2h1bWFub2lkJyk7XG5ab21iaWUgPSByZXF1aXJlKCdodW1hbm9pZHMvem9tYmllJyk7XG5TZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJyk7XG5cbmNsYXNzIEluZmVjdGVkSHVtYW4gZXh0ZW5kcyBIdW1hbm9pZCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLnNwZWVkID0gMDtcbiAgICB0aGlzLnRpbWVTaW5jZUluZmVjdGlvbiA9IDA7XG4gIH1cblxuICBpc0FibGVUb0JpdGUoKXtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cmFuc2Zvcm0oKSB7XG4gICAgcmV0dXJuKFxuICAgICAgbmV3IFpvbWJpZSh0aGlzLmNsb25lUHJvcHMoKSlcbiAgICApO1xuICB9XG5cbiAgaW5jcmVtZW50VGltZVNpbmNlSW5mZWN0aW9uKCl7XG4gICAgdGhpcy50aW1lU2luY2VJbmZlY3Rpb24rKztcbiAgfVxuXG4gIGhhbmRsZU5leHRNb3ZlKG9wdHMpe1xuICAgIGxldCB7IGh1bWFub2lkcyB9ID0gb3B0cztcblxuICAgIHRoaXMuaW5jcmVtZW50VGltZVNpbmNlSW5mZWN0aW9uKCk7XG4gICAgaWYgKHRoaXMudGltZVNpbmNlSW5mZWN0aW9uID49IFNldHRpbmdzLmluZmVjdGlvbkluY3ViYXRpb25UaW1lKXtcbiAgICAgIGh1bWFub2lkc1t0aGlzLmlkXSA9IHRoaXMudHJhbnNmb3JtKCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW5mZWN0ZWRIdW1hbjtcbiIsImxldCBQYXRoZmluZGVyLCBnYW1lU2V0dGluZ3MsIEh1bWFub2lkLCBJbmZlY3RlZEh1bWFuO1xuXG5nYW1lU2V0dGluZ3MgPSByZXF1aXJlKCdzZXR0aW5ncycpO1xuUGF0aGZpbmRlciA9IHJlcXVpcmUoJ3BhdGhmaW5kZXInKTtcbkh1bWFub2lkID0gcmVxdWlyZSgnaHVtYW5vaWRzL2h1bWFub2lkJyk7XG5JbmZlY3RlZEh1bWFuID0gcmVxdWlyZSgnaHVtYW5vaWRzL2luZmVjdGVkSHVtYW4nKTtcblxuY2xhc3MgUGxheWVyIGV4dGVuZHMgSHVtYW5vaWQge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy5zcGVlZCA9IGdhbWVTZXR0aW5ncy5wbGF5ZXJTcGVlZDtcbiAgfVxuXG4gIGlzQWJsZVRvQml0ZSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cmFuc2Zvcm0oKSB7XG4gICAgcmV0dXJuKFxuICAgICAgbmV3IEluZmVjdGVkSHVtYW4odGhpcy5jbG9uZVByb3BzKCkpXG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZU5leHRNb3ZlKG9wdHMpe1xuICAgIGxldCB0YXJnZXRMb2MsIGNvb3JkcztcbiAgICBsZXQgeyBkeCwgZHkgfSA9IG9wdHM7XG5cbiAgICB0YXJnZXRMb2MgPSB7XG4gICAgICB4OiB0aGlzLnBvc2l0aW9uLnggKyBkeCAqIHRoaXMuc3BlZWQsXG4gICAgICB5OiB0aGlzLnBvc2l0aW9uLnkgKyBkeSAqIHRoaXMuc3BlZWRcbiAgICB9O1xuICAgIGNvb3JkcyA9IChQYXRoZmluZGVyLm1vdmVUb3dhcmRzKHRoaXMucG9zaXRpb24sIHRhcmdldExvYywgdGhpcy5zcGVlZCkpO1xuICAgIHRoaXMucG9zaXRpb24gPSBQYXRoZmluZGVyLmdldFJlbGF0aXZlUG9zaXRpb24oY29vcmRzKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcblxuIiwibGV0IFBhdGhmaW5kZXIsIGdhbWVTZXR0aW5ncywgSHVtYW5vaWQ7XG5cbmdhbWVTZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJyk7XG5QYXRoZmluZGVyID0gcmVxdWlyZSgncGF0aGZpbmRlcicpO1xuSHVtYW5vaWQgPSByZXF1aXJlKCdodW1hbm9pZHMvaHVtYW5vaWQnKTtcblxuY2xhc3MgWm9tYmllIGV4dGVuZHMgSHVtYW5vaWQge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy5zcGVlZCA9IGdhbWVTZXR0aW5ncy56b21iaWVTcGVlZDtcbiAgfVxuXG4gIGlzQWJsZVRvQml0ZShodW1hbil7XG4gICAgcmV0dXJuIChcbiAgICAgIGh1bWFuICYmIFBhdGhmaW5kZXIuZGlzdGFuY2VUbyhodW1hbi5wb3NpdGlvbiwgdGhpcy5wb3NpdGlvbikgPCBnYW1lU2V0dGluZ3Muem9tYmllQml0ZVJhbmdlXG4gICAgKTtcbiAgfVxuXG4gIHRyYW5zZm9ybSgpIHtcbiAgICByZXR1cm4odGhpcyk7XG4gIH1cblxuICBpc1ZhbGlkRGVzdGluYXRpb24oaHVtYW5vaWRzLCB0YXJnZXRQb3NpdGlvbikge1xuICAgIHJldHVybiAhaHVtYW5vaWRzLnNvbWUoKGh1bWFub2lkKSA9PiB7XG4gICAgICByZXR1cm4gUGF0aGZpbmRlci5hcmVQb3NpdGlvbnNFcXVhbChodW1hbm9pZC5wb3NpdGlvbiwgdGFyZ2V0UG9zaXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TmV4dERlc3RpbmF0aW9uKG5lYXJlc3RMaXZpbmdIdW1hbm9pZCwgbmVhcmVzdFpvbWJpZSl7XG4gICAgbGV0IHpvbWJpZURpc3RhbmNlLCBsaXZpbmdIdW1hbm9pZERpc3RhbmNlO1xuXG4gICAgbGl2aW5nSHVtYW5vaWREaXN0YW5jZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB6b21iaWVEaXN0YW5jZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcblxuICAgIGlmIChuZWFyZXN0Wm9tYmllKXtcbiAgICAgIHpvbWJpZURpc3RhbmNlID0gKFxuICAgICAgICBQYXRoZmluZGVyLmRpc3RhbmNlVG8obmVhcmVzdFpvbWJpZS5wb3NpdGlvbiwgdGhpcy5wb3NpdGlvbikgKlxuICAgICAgICBnYW1lU2V0dGluZ3Muem9tYmllU3ByZWFkXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChuZWFyZXN0TGl2aW5nSHVtYW5vaWQpe1xuICAgICAgbGl2aW5nSHVtYW5vaWREaXN0YW5jZSA9IFBhdGhmaW5kZXIuZGlzdGFuY2VUbyhuZWFyZXN0TGl2aW5nSHVtYW5vaWQucG9zaXRpb24sIHRoaXMucG9zaXRpb24pO1xuICAgIH1cblxuICAgIGlmIChsaXZpbmdIdW1hbm9pZERpc3RhbmNlIDwgem9tYmllRGlzdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vdmVOZWFyZXN0KG5lYXJlc3RMaXZpbmdIdW1hbm9pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm1vdmVOZWFyZXN0KG5lYXJlc3Rab21iaWUpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU5leHRNb3ZlKG9wdHMpe1xuICAgIGxldCBkZXN0aW5hdGlvbjtcbiAgICBsZXQgeyBuZWFyZXN0SHVtYW5vaWQsIG5lYXJlc3Rab21iaWUsIGh1bWFub2lkcyB9ID0gb3B0cztcblxuICAgIGlmICh0aGlzLmlzQWJsZVRvQml0ZShuZWFyZXN0SHVtYW5vaWQpKXtcbiAgICAgIGh1bWFub2lkc1tuZWFyZXN0SHVtYW5vaWQuaWRdID0gbmVhcmVzdEh1bWFub2lkLnRyYW5zZm9ybSgpO1xuICAgIH1cblxuICAgIGRlc3RpbmF0aW9uID0gUGF0aGZpbmRlci5nZXRSZWxhdGl2ZVBvc2l0aW9uKFxuICAgICAgdGhpcy5nZXROZXh0RGVzdGluYXRpb24obmVhcmVzdEh1bWFub2lkLCBuZWFyZXN0Wm9tYmllKVxuICAgICk7XG5cbiAgICBpZiAodGhpcy5pc1ZhbGlkRGVzdGluYXRpb24oaHVtYW5vaWRzLCBkZXN0aW5hdGlvbikpIHtcbiAgICAgIHRoaXMucG9zaXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBab21iaWU7XG4iLCJsZXQgR2FtZU9mQWZ0ZXJsaWZlLCBnYW1lT2ZBZnRlcmxpZmU7XG5cbkdhbWVPZkFmdGVybGlmZSA9IHJlcXVpcmUoJ2dhbWUnKTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luaXRpYWxpemUtZ2FtZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXknKS5jbGFzc05hbWUgPSAnaGlkZSc7XG4gIGdhbWVPZkFmdGVybGlmZSA9IG5ldyBHYW1lT2ZBZnRlcmxpZmUoKTtcbiAgZ2FtZU9mQWZ0ZXJsaWZlLmluaXQoKTtcbn0pO1xuIiwibGV0IFNldHRpbmdzO1xuXG5TZXR0aW5ncyA9IHJlcXVpcmUoJ3NldHRpbmdzJyk7XG5cbmNsYXNzIFBhdGhmaW5kZXIge1xuICBzdGF0aWMgZ2V0UmVsYXRpdmVQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIGxldCB4LCB5O1xuXG4gICAgeCA9ICgocG9zaXRpb24ueCArIFNldHRpbmdzLmRlZmF1bHRXaWR0aCkgJSBTZXR0aW5ncy5kZWZhdWx0V2lkdGgpO1xuICAgIHkgPSAoKHBvc2l0aW9uLnkgKyBTZXR0aW5ncy5kZWZhdWx0SGVpZ2h0KSAlIFNldHRpbmdzLmRlZmF1bHRIZWlnaHQpO1xuICAgIHJldHVybiB7IHgsIHkgfTtcbiAgfVxuXG4gIHN0YXRpYyBhcmVQb3NpdGlvbnNFcXVhbChwb3NpdGlvbjEsIHBvc2l0aW9uMil7XG4gICAgcmV0dXJuIHBvc2l0aW9uMS54ID09PSBwb3NpdGlvbjIueCAmJiBwb3NpdGlvbjEueSA9PT0gcG9zaXRpb24yLnk7XG4gIH1cblxuICBzdGF0aWMgbW92ZVRvd2FyZHMoY3VycmVudFBvc2l0aW9uLCBmcmllbmRseUxvY2F0aW9uLCBzcGVlZCl7XG4gICAgbGV0IGRlbHRhWSwgZGVsdGFYLCBsZW5ndGg7XG5cbiAgICBkZWx0YVkgPSBmcmllbmRseUxvY2F0aW9uLnkgLSBjdXJyZW50UG9zaXRpb24ueTtcbiAgICBkZWx0YVggPSBmcmllbmRseUxvY2F0aW9uLnggLSBjdXJyZW50UG9zaXRpb24ueDtcbiAgICBsZW5ndGggPSB0aGlzLmRpc3RhbmNlVG8oZnJpZW5kbHlMb2NhdGlvbiwgY3VycmVudFBvc2l0aW9uKTtcbiAgICBpZiAoc3BlZWQgIT09IDAgJiYgbGVuZ3RoIDwgc3BlZWQpe1xuICAgICAgcmV0dXJuIGZyaWVuZGx5TG9jYXRpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IChjdXJyZW50UG9zaXRpb24ueCArIChkZWx0YVggLyBsZW5ndGggKiBzcGVlZCkpLFxuICAgICAgICB5OiAoY3VycmVudFBvc2l0aW9uLnkgKyAoZGVsdGFZIC8gbGVuZ3RoICogc3BlZWQpKVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbW92ZUF3YXlGcm9tKGN1cnJlbnRQb3NpdGlvbiwgaG9zdGlsZUxvY2F0aW9uLCBzcGVlZCl7XG4gICAgcmV0dXJuIHRoaXMubW92ZVRvd2FyZHMoY3VycmVudFBvc2l0aW9uLCBob3N0aWxlTG9jYXRpb24sIC1zcGVlZCk7XG4gIH1cblxuICBzdGF0aWMgbW92ZVBlcnBlbmRpY3VsYXJUbyhjdXJyZW50UG9zaXRpb24sIGZyaWVuZGx5TG9jYXRpb24sIHNwZWVkKXtcbiAgICBsZXQgZGVsdGFZLCBkZWx0YVgsIGxlbmd0aDtcblxuICAgIGRlbHRhWSA9IGZyaWVuZGx5TG9jYXRpb24ueSAtIGN1cnJlbnRQb3NpdGlvbi55O1xuICAgIGRlbHRhWCA9IGZyaWVuZGx5TG9jYXRpb24ueCAtIGN1cnJlbnRQb3NpdGlvbi54O1xuICAgIGxlbmd0aCA9IHRoaXMuZGlzdGFuY2VUbyhmcmllbmRseUxvY2F0aW9uLCBjdXJyZW50UG9zaXRpb24pO1xuICAgIGlmIChzcGVlZCAhPT0gMCAmJiBsZW5ndGggPCBzcGVlZCl7XG4gICAgICByZXR1cm4gZnJpZW5kbHlMb2NhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogKGN1cnJlbnRQb3NpdGlvbi54ICsgKGRlbHRhWCAvIGxlbmd0aCAqIHNwZWVkKSksXG4gICAgICAgIHk6IChjdXJyZW50UG9zaXRpb24ueSAtIChkZWx0YVkgLyBsZW5ndGggKiBzcGVlZCkpXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBkaXN0YW5jZVRvKHRhcmdldExvY2F0aW9uLCBjdXJyZW50UG9zaXRpb24pe1xuICAgIGxldCBkZWx0YVksIGRlbHRhWDtcblxuICAgIGRlbHRhWSA9IHRhcmdldExvY2F0aW9uLnkgLSBjdXJyZW50UG9zaXRpb24ueTtcbiAgICBkZWx0YVggPSB0YXJnZXRMb2NhdGlvbi54IC0gY3VycmVudFBvc2l0aW9uLng7XG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhkZWx0YVksIDIpICsgTWF0aC5wb3coZGVsdGFYLCAyKSk7XG4gIH1cblxuICBzdGF0aWMgbW92ZVJhbmRvbWx5KGN1cnJlbnRQb3NpdGlvbiwgc3BlZWQpe1xuICAgIGxldCBhbmdsZTtcblxuICAgIGFuZ2xlID0gTWF0aC5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuICAgIHJldHVybiB7XG4gICAgICB4OiAoY3VycmVudFBvc2l0aW9uLnggKyBNYXRoLmNvcyhhbmdsZSkgKiBzcGVlZCksXG4gICAgICB5OiAoY3VycmVudFBvc2l0aW9uLnkgKyBNYXRoLnNpbihhbmdsZSkgKiBzcGVlZClcbiAgICB9O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGF0aGZpbmRlcjtcbiIsImxldCBnYW1lU2V0dGluZ3M7XG5cbmdhbWVTZXR0aW5ncyA9IHtcbiAgaHVtYW5TcGVlZDogNyxcbiAgcGxheWVyU3BlZWQ6IDYsXG4gIHpvbWJpZVNwZWVkOiA0LFxuICBodW1hbkNvdW50OiAzMCxcbiAgem9tYmllQ291bnQ6IDMsXG4gIGluZmVjdGlvbkluY3ViYXRpb25UaW1lOiA1LCAvLyB0dXJuIGRlbGF5IHVudGlsIGluZmVjdGVkIGJlY29tZSB6b21iaWVzLiBoaWdoZXIgbnVtYmVycyB0YWtlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsb25nZXIgdG8gdHJhbnNmb3JtXG4gIHR1cm5EZWxheTogeyBub3JtYWw6IDEwMCwgZmFzdDogMjUgfSwgLy8gc2V0cyB0aGUgdGltZW91dCBiZXR3ZWVuIHR1cm5zXG4gIHJlcGl0aW9uVG9sZXJhbmNlOiAxLCAvLyB0aGUgcmFuZ2UgaW4gd2hpY2ggYSBtb3ZlIGlzIGNvbnNpZGVyZWQgcmVwZXRpdGl2ZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG93ZXIgdmFsdWVzIHdpbGwgcmVkdWNlIHRoZSBzaXplIG9mIHRoZSByYW5nZS5cbiAgem9tYmllU3ByZWFkOiAzLCAvLyBsb3dlciB6b21iaWVTcHJlYWQgdmFsdWVzIHdpbGwgY2F1c2Ugem9tYmllcyB0byBzcHJlYWQgb3V0IG1vcmVcbiAgaHVtYW5GZWFyUmFuZ2U6IDIwLCAvLyB0aGUgcmFuZ2UgYXQgd2hpY2ggaHVtYW5zIHN0YXJ0IHJ1bm5pbmcgZnJvbSB6b21iaWVzLlxuICB6b21iaWVCaXRlUmFuZ2U6IDEwLCAvLyB0aGUgcmFuZ2UgYXQgd2hpY2ggYSB6b21iaWUgY2FuIGJpdGUgYSBodW1hbi5cblxuICAvLyBUT0RPOiBTeW5jIGNhbnZhcyB3aXRoIHRoaXMgdmFsdWVcbiAgZGVmYXVsdFdpZHRoOiA2MDAsIC8vIGRlZmF1bHQgY2FudmFzIHdpZHRoXG4gIGRlZmF1bHRIZWlnaHQ6IDQwMCwgLy8gZGVmYXVsdCBjYW52YXMgaGVpZ2h0XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdhbWVTZXR0aW5ncztcbiJdfQ==
