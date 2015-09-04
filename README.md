## Game of Afterlife  


The Game of Afterlife is a new take on Conway's Game of Life: Zombie Edition. A (formerlly) zero-player game, Game of Afterlife seeds the board with randomized initial conditions full of Humans (blue) and Zombies (red). Humans band together and run from zombies. Zombies chase nearby humans or wander aimlessly. If a human gets caught, they become infected and transform into zombies. With the addition of a few more complicated mechanics, these general rules guide the games behavior and form an entertaining digital ant farm of zombie hordes.  
With version 1.2 and above, you're in control: command a player humanoid with `ASWD` and run from zombies for as long as you can.

![Game of Afterlife](https://raw.githubusercontent.com/PhilVargas/js_game_of_afterlife/master/public/img/Game%20of%20Afterlife.png)

View it here: [philvargas.github.io/js_game_of_afterlife](http://philvargas.github.io/js_game_of_afterlife)

### Features
 - Controllable player character (green)
 - Human allies (blue), flock to both the player and other humans but run
 from zombies if they get too close.
 - Zombies enemies (red), slower than humans and the player but will chase down a
 nearby human or player. If no tasty humanoid is nearby a zombie will wander
 aimlessly. Zombies will bounce off each other if they get too close to other zombies.
 - Infected humans (dark red) are neutral characters and immobile.. for now. The
 infected are newly bitten humans that will quickly turn into zombies.
 - Score - the longer you live, the higher the score.
 - Delay - the game will speedup dramatically after the player has been bitten.

### Version v2.0.2  
---
Node v0.10.38  
npm v2.13.3  
JavaScript ES6  

### About  
---
This project originally started as a hackathon project during the @devbootcamp
student-alumni hackathon (Feb 2014). Initially a ruby-sinatra application
with minimal javascript, the project went on to win the DBC hackathon.  

The application is a new take on Conway's game of life. Humans vs. Zombies,
the game is seeded with random conditions and loaded with humans and just a few
 zombies. You can sit back and enjoy the view of little zombie ants chasing each other
 or take control of the player and run from the zombies for as long as you can.

 - Written in JavaScript (ES6)
 - Styled with Sass
 - Compiled with Gulp
 - Tested with Mocha and Chai

---
Kudos to the original team for winning the @devbootcamp hackathon Feb 2014, for
 building the [original app](https://github.com/ianaroot/game_of_afterlife) in ruby.

The original team:
[Ian Root](https://github.com/ianaroot)
[Phil Vargas](https://github.com/philvargas)
[Chermaine Zimmerman](https://github.com/c14jcdj)
[Hunter Paull](https://github.com/hpchess)
[Jose Menor](https://github.com/menor)
[David Reiman](https://github.com/elreimundo)
