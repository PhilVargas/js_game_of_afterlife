/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Settings = {
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
  defaultHeight: 400 // default canvas height
};

exports.default = Settings;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _settings = __webpack_require__(0);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pathfinder = function () {
  function Pathfinder() {
    _classCallCheck(this, Pathfinder);
  }

  _createClass(Pathfinder, null, [{
    key: 'getRelativePosition',
    value: function getRelativePosition(position) {
      var x = (position.x + _settings2.default.defaultWidth) % _settings2.default.defaultWidth;
      var y = (position.y + _settings2.default.defaultHeight) % _settings2.default.defaultHeight;

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
      var deltaY = friendlyLocation.y - currentPosition.y;
      var deltaX = friendlyLocation.x - currentPosition.x;
      var length = this.distanceTo(friendlyLocation, currentPosition);

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
      var deltaY = friendlyLocation.y - currentPosition.y;
      var deltaX = friendlyLocation.x - currentPosition.x;
      var length = this.distanceTo(friendlyLocation, currentPosition);

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
      var deltaY = targetLocation.y - currentPosition.y;
      var deltaX = targetLocation.x - currentPosition.x;

      return Math.sqrt(Math.pow(deltaY, 2) + Math.pow(deltaX, 2));
    }
  }, {
    key: 'moveRandomly',
    value: function moveRandomly(currentPosition, speed) {
      var angle = Math.random() * 2 * Math.PI;

      return {
        x: currentPosition.x + Math.cos(angle) * speed,
        y: currentPosition.y + Math.sin(angle) * speed
      };
    }
  }]);

  return Pathfinder;
}();

exports.default = Pathfinder;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathfinder = __webpack_require__(1);

var _pathfinder2 = _interopRequireDefault(_pathfinder);

var _settings = __webpack_require__(0);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Humanoid = function () {
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
      return Math.abs(potentialMove.x - this.lastPosition.x) < _settings2.default.repitionTolerance && Math.abs(potentialMove.y - this.lastPosition.y) < _settings2.default.repitionTolerance;
    }
  }, {
    key: 'moveNearest',
    value: function moveNearest(nearestObject) {
      var potentialMove = void 0;

      if (this.isAttractedTo(nearestObject)) {
        potentialMove = _pathfinder2.default.moveTowards(this.position, nearestObject.position, this.speed);
      } else {
        potentialMove = _pathfinder2.default.moveAwayFrom(this.position, nearestObject.position, this.speed);
      }
      if (this.lastPosition.x === this.position.x && this.lastPosition.y === this.position.y) {
        this.storeLastPosition();
        return _pathfinder2.default.moveRandomly(this.position, this.speed);
      } else if (this.isLastMoveRepeated(potentialMove)) {
        this.storeLastPosition();
        return _pathfinder2.default.movePerpendicularTo(this.position, nearestObject.position, this.speed);
      } else {
        this.storeLastPosition();
        return potentialMove;
      }
    }
  }]);

  return Humanoid;
}();

exports.default = Humanoid;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _settings = __webpack_require__(0);

var _settings2 = _interopRequireDefault(_settings);

var _humanoid = __webpack_require__(2);

var _humanoid2 = _interopRequireDefault(_humanoid);

var _zombie = __webpack_require__(4);

var _zombie2 = _interopRequireDefault(_zombie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfectedHuman = function (_Humanoid) {
  _inherits(InfectedHuman, _Humanoid);

  function InfectedHuman(opts) {
    _classCallCheck(this, InfectedHuman);

    var _this = _possibleConstructorReturn(this, (InfectedHuman.__proto__ || Object.getPrototypeOf(InfectedHuman)).call(this, opts));

    _this.speed = 0;
    _this.timeSinceInfection = 0;
    return _this;
  }

  _createClass(InfectedHuman, [{
    key: 'isAbleToBite',
    value: function isAbleToBite() {
      return false;
    }
  }, {
    key: 'transform',
    value: function transform() {
      return new _zombie2.default(this.cloneProps());
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
      if (this.timeSinceInfection >= _settings2.default.infectionIncubationTime) {
        humanoids[this.id] = this.transform();
      }
    }
  }]);

  return InfectedHuman;
}(_humanoid2.default);

exports.default = InfectedHuman;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathfinder = __webpack_require__(1);

var _pathfinder2 = _interopRequireDefault(_pathfinder);

var _settings = __webpack_require__(0);

var _settings2 = _interopRequireDefault(_settings);

var _humanoid = __webpack_require__(2);

var _humanoid2 = _interopRequireDefault(_humanoid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Zombie = function (_Humanoid) {
  _inherits(Zombie, _Humanoid);

  function Zombie(opts) {
    _classCallCheck(this, Zombie);

    var _this = _possibleConstructorReturn(this, (Zombie.__proto__ || Object.getPrototypeOf(Zombie)).call(this, opts));

    _this.speed = _settings2.default.zombieSpeed;
    return _this;
  }

  _createClass(Zombie, [{
    key: 'isAbleToBite',
    value: function isAbleToBite(human) {
      return human && _pathfinder2.default.distanceTo(human.position, this.position) < _settings2.default.zombieBiteRange;
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
        return _pathfinder2.default.arePositionsEqual(humanoid.position, targetPosition);
      });
    }
  }, {
    key: 'getNextDestination',
    value: function getNextDestination(nearestLivingHumanoid, nearestZombie) {
      var zombieDistance = void 0,
          livingHumanoidDistance = void 0;

      livingHumanoidDistance = Number.POSITIVE_INFINITY;
      zombieDistance = Number.POSITIVE_INFINITY;

      if (nearestZombie) {
        zombieDistance = _pathfinder2.default.distanceTo(nearestZombie.position, this.position) * _settings2.default.zombieSpread;
      }

      if (nearestLivingHumanoid) {
        livingHumanoidDistance = _pathfinder2.default.distanceTo(nearestLivingHumanoid.position, this.position);
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
      var nearestHumanoid = opts.nearestHumanoid,
          nearestZombie = opts.nearestZombie,
          humanoids = opts.humanoids;


      if (this.isAbleToBite(nearestHumanoid)) {
        humanoids[nearestHumanoid.id] = nearestHumanoid.transform();
      }

      var destination = _pathfinder2.default.getRelativePosition(this.getNextDestination(nearestHumanoid, nearestZombie));

      if (this.isValidDestination(humanoids, destination)) {
        this.position = destination;
      }
    }
  }]);

  return Zombie;
}(_humanoid2.default);

exports.default = Zombie;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _game = __webpack_require__(6);

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.getElementById('initialize-game').addEventListener('click', function () {
  var gameOfAfterlife = new _game2.default();

  document.getElementById('overlay').className = 'hide';
  gameOfAfterlife.init();
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _settings = __webpack_require__(0);

var _settings2 = _interopRequireDefault(_settings);

var _humanoidFactory = __webpack_require__(7);

var _humanoidFactory2 = _interopRequireDefault(_humanoidFactory);

var _board = __webpack_require__(10);

var _board2 = _interopRequireDefault(_board);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameOfAfterlife = function () {
  function GameOfAfterlife() {
    _classCallCheck(this, GameOfAfterlife);

    var canvas = document.getElementsByTagName('canvas')[0];
    var allHumanoids = _humanoidFactory2.default.populate(_settings2.default.humanCount, _settings2.default.zombieCount);

    this.hasBegun = false;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.board = new _board2.default({ humanoids: allHumanoids });
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
        switch (e.which) {
          case 65:
            _this.board.dx = -1;
            break;
          case 68:
            _this.board.dx = 1;
            break;
          case 87:
            _this.board.dy = -1;
            break;
          case 83:
            _this.board.dy = 1;
            break;
        }
      });
    }
  }, {
    key: 'drawHumanoids',
    value: function drawHumanoids() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (var i = 0; i < this.board.humanoids.length; i++) {
        var player = this.board.humanoids[i];
        var x = player.position.x;
        var y = player.position.y;

        this.ctx.beginPath();
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

      var _nextRequest = void 0;

      _nextRequest = function nextRequest() {
        _this2.drawHumanoids();
        if (_this2.board.isGameActive()) {
          document.getElementById('score').innerHTML = _this2.board.score;
          _this2.board.nextTurn();
          var delay = _this2.board.isPlayerAlive() ? _settings2.default.turnDelay.normal : _settings2.default.turnDelay.fast;

          setTimeout(_nextRequest, delay);
        } else {
          document.getElementById('overlay-message').innerHTML = 'EVERYBODY IS DEAD!!!\nYour score was: ' + _this2.board.score;
          document.getElementById('overlay').className = '';
        }
      };
      setTimeout(_nextRequest, _settings2.default.turnDelay.normal);
    }
  }, {
    key: 'init',
    value: function init() {
      this.bindPlayerMovement();
      this.callNextTurn();
    }
  }]);

  return GameOfAfterlife;
}();

exports.default = GameOfAfterlife;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _human = __webpack_require__(8);

var _human2 = _interopRequireDefault(_human);

var _zombie = __webpack_require__(4);

var _zombie2 = _interopRequireDefault(_zombie);

var _player = __webpack_require__(9);

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HumanoidBuilder = function () {
  function HumanoidBuilder() {
    _classCallCheck(this, HumanoidBuilder);
  }

  _createClass(HumanoidBuilder, null, [{
    key: 'humanoidMap',
    value: function humanoidMap() {
      return {
        Human: _human2.default,
        Zombie: _zombie2.default,
        Player: _player2.default
      };
    }
  }, {
    key: 'populate',
    value: function populate(numberOfHumans, numberOfZombies) {
      var population = void 0;

      population = [];
      population = population.concat(this.creation(numberOfHumans, 'Human'));
      population = population.concat(this.creation(numberOfZombies, 'Zombie', population.length));
      population = population.concat(this.creation(1, 'Player', population.length));
      return population;
    }
  }, {
    key: 'creation',
    value: function creation(number, type) {
      var baseId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var map = this.humanoidMap();
      var H = map[type];
      var population = [];

      for (var i = 0; i < number; i++) {
        var newHumanoid = new H({ id: baseId + i });

        population.push(newHumanoid);
      }
      return population;
    }
  }]);

  return HumanoidBuilder;
}();

exports.default = HumanoidBuilder;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathfinder = __webpack_require__(1);

var _pathfinder2 = _interopRequireDefault(_pathfinder);

var _settings = __webpack_require__(0);

var _settings2 = _interopRequireDefault(_settings);

var _humanoid = __webpack_require__(2);

var _humanoid2 = _interopRequireDefault(_humanoid);

var _infectedHuman = __webpack_require__(3);

var _infectedHuman2 = _interopRequireDefault(_infectedHuman);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Human = function (_Humanoid) {
  _inherits(Human, _Humanoid);

  function Human(opts) {
    _classCallCheck(this, Human);

    var _this = _possibleConstructorReturn(this, (Human.__proto__ || Object.getPrototypeOf(Human)).call(this, opts));

    _this.speed = _settings2.default.humanSpeed;
    return _this;
  }

  _createClass(Human, [{
    key: 'isAbleToBite',
    value: function isAbleToBite() {
      return false;
    }
  }, {
    key: 'transform',
    value: function transform() {
      return new _infectedHuman2.default(this.cloneProps());
    }
  }, {
    key: 'handleNextMove',
    value: function handleNextMove(opts) {
      var nearestHumanoid = opts.nearestHumanoid,
          nearestZombie = opts.nearestZombie,
          humanoids = opts.humanoids;

      var destination = _pathfinder2.default.getRelativePosition(this.getNextDestination(nearestHumanoid, nearestZombie));

      if (this.isValidDestination(humanoids, destination)) {
        this.position = destination;
      }
    }
  }, {
    key: 'isValidDestination',
    value: function isValidDestination(humanoids, targetPosition) {
      return !humanoids.some(function (humanoid) {
        return _pathfinder2.default.arePositionsEqual(humanoid.position, targetPosition);
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
      var zombieDistance = void 0;

      if (nearestZombie) {
        zombieDistance = _pathfinder2.default.distanceTo(nearestZombie.position, this.position);
      }

      // a zombie is within the human fear range, or there are no other living humanoids remaining
      return zombieDistance < _settings2.default.humanFearRange || !nearestHumanoid;
    }
  }]);

  return Human;
}(_humanoid2.default);

exports.default = Human;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathfinder = __webpack_require__(1);

var _pathfinder2 = _interopRequireDefault(_pathfinder);

var _settings = __webpack_require__(0);

var _settings2 = _interopRequireDefault(_settings);

var _humanoid = __webpack_require__(2);

var _humanoid2 = _interopRequireDefault(_humanoid);

var _infectedHuman = __webpack_require__(3);

var _infectedHuman2 = _interopRequireDefault(_infectedHuman);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = function (_Humanoid) {
  _inherits(Player, _Humanoid);

  function Player(opts) {
    _classCallCheck(this, Player);

    var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, opts));

    _this.speed = _settings2.default.playerSpeed;
    return _this;
  }

  _createClass(Player, [{
    key: 'isAbleToBite',
    value: function isAbleToBite() {
      return false;
    }
  }, {
    key: 'transform',
    value: function transform() {
      return new _infectedHuman2.default(this.cloneProps());
    }
  }, {
    key: 'handleNextMove',
    value: function handleNextMove(opts) {
      var dx = opts.dx,
          dy = opts.dy;

      var targetLoc = {
        x: this.position.x + dx * this.speed,
        y: this.position.y + dy * this.speed
      };
      var coords = _pathfinder2.default.moveTowards(this.position, targetLoc, this.speed);

      this.position = _pathfinder2.default.getRelativePosition(coords);
    }
  }]);

  return Player;
}(_humanoid2.default);

exports.default = Player;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pathfinder = __webpack_require__(1);

var _pathfinder2 = _interopRequireDefault(_pathfinder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function () {
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
      var livingHumanoids = this.findSimilarHumanoids('Player').concat(this.findSimilarHumanoids('Human'));
      var closestPos = this.findClosestPos(livingHumanoids);
      var closestHumanoid = this.findClosestHumanoid(closestPos, livingHumanoids);

      return closestHumanoid;
    }
  }, {
    key: 'nearestZombie',
    value: function nearestZombie() {
      var similarHumanoids = this.findSimilarHumanoids('Zombie');
      var closestPos = this.findClosestPos(similarHumanoids);
      var closestHumanoid = this.findClosestHumanoid(closestPos, similarHumanoids);

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
      var closestPos = [];

      for (var i = 0; i < otherHumanoids.length; i++) {
        var dist = _pathfinder2.default.distanceTo(otherHumanoids[i].position, this.humanoid.position);

        closestPos.push(dist);
      }
      return closestPos;
    }
  }, {
    key: 'findClosestHumanoid',
    value: function findClosestHumanoid(closestPos, otherHumanoids) {
      var closestHumanoid = void 0;
      var closestHumanoidValue = Math.min.apply(null, closestPos);

      for (var i = 0; i < closestPos.length; i++) {
        if (closestPos[i] === closestHumanoidValue) {
          closestHumanoid = otherHumanoids[i];
        }
      }
      return closestHumanoid;
    }
  }]);

  return Board;
}();

exports.default = Board;

/***/ })
/******/ ]);