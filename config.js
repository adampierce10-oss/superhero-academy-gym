const avatars = [
  "Lightning Hero",
  "Fire Hero",
  "Ice Hero",
  "Robot Hero",
  "Galaxy Hero",
  "Ninja Hero",
  "Speed Hero",
  "Shadow Hero"
];

const difficulties = {
  1: { name: "Sidekick", multiplier: 1 },
  1.5: { name: "Hero", multiplier: 1.5 },
  2: { name: "Superhero", multiplier: 2 },
  3: { name: "Legend", multiplier: 3 }
};

const exercisePool = [
  { id: 1, name: "Push-Ups", type: "reps", target: 20, benchmark: 25, basePoints: 100 },
  { id: 2, name: "Squats", type: "reps", target: 25, benchmark: 30, basePoints: 100 },
  { id: 3, name: "Plank", type: "hold", target: 30, benchmark: 35, basePoints: 120 },
  { id: 4, name: "Bear Crawl", type: "distance", target: 20, benchmark: 25, basePoints: 140 },
  { id: 5, name: "Lunges", type: "reps", target: 15, benchmark: 20, basePoints: 110 },
  { id: 6, name: "Wall Sit", type: "hold", target: 40, benchmark: 45, basePoints: 130 }
];
