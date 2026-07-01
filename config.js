const CONFIG = {
  version: "1.0.0-alpha.6",

  appName: "Superhero Academy Challenge",

  maxPlayers: 8,
  exercisesPerPlayer: 6,

  timers: {
    countdown: 3
  },

  scoring: {
    baseMultiplier: 100,

    holdBufferSeconds: 10,

    holdDecayPerSecond: 3,

    speedBonusCap: 50
  },

  difficultyLevels: {
    easy: { multiplier: 1.0 },
    medium: { multiplier: 1.25 },
    hard: { multiplier: 1.5 },
    extreme: { multiplier: 2.0 }
  },

  colors: [
    "#FF4D6D","#4D96FF","#6BCB77","#FFD93D",
    "#845EC2","#00C9A7","#FF9671","#2C73D2"
  ]
};
