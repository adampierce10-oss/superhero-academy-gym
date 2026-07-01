const CONFIG = {
  version: "1.0.0-alpha.4",

  appName: "Superhero Academy Challenge",

  maxPlayers: 8,
  exercisesPerPlayer: 6,

  difficultyLevels: {
    easy: { label: "Sidekick (Easy)", multiplier: 1.0 },
    medium: { label: "Hero (Medium)", multiplier: 1.25 },
    hard: { label: "Superhero (Hard)", multiplier: 1.5 },
    extreme: { label: "Legend (Extreme)", multiplier: 2.0 }
  },

  colors: [
    "#FF4D6D", "#4D96FF", "#6BCB77", "#FFD93D",
    "#845EC2", "#00C9A7", "#FF9671", "#2C73D2"
  ],

  timers: {
    countdown: 3
  },

  scoring: {
    baseMultiplier: 100,

    holdBufferSeconds: 10,

    holdDecayRate: 2,   // points per second after buffer

    speedBonus: 1.5
  }
};
