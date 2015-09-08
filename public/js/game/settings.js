let Settings;

Settings = {
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
  defaultHeight: 400, // default canvas height
};

module.exports = Settings;
