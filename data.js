/*
---------------------------------------------------
Superhero Academy Challenge
Version: 1.0.0-alpha.2
File: data.js
---------------------------------------------------
*/

// =====================
// EXERCISE DATABASE
// =====================

const EXERCISES = [
  {
    id: 1,
    name: "Push Ups",
    type: "reps",
    target: 10,
    difficulty: "easy",
    benchmark: 15,
    basePoints: 100,
    icon: "💪"
  },
  {
    id: 2,
    name: "L-Hold",
    type: "hold",
    target: 20,
    difficulty: "medium",
    benchmark: 30,
    basePoints: 150,
    icon: "⏱"
  },
  {
    id: 3,
    name: "Bear Crawl",
    type: "distance",
    target: 15,
    difficulty: "hard",
    benchmark: 20,
    basePoints: 200,
    icon: "🏃"
  },
  {
    id: 4,
    name: "Jump Squats",
    type: "reps",
    target: 12,
    difficulty: "easy",
    benchmark: 18,
    basePoints: 110,
    icon: "💪"
  },
  {
    id: 5,
    name: "Plank Hold",
    type: "hold",
    target: 30,
    difficulty: "medium",
    benchmark: 45,
    basePoints: 160,
    icon: "⏱"
  },
  {
    id: 6,
    name: "Shuttle Run",
    type: "distance",
    target: 20,
    difficulty: "hard",
    benchmark: 25,
    basePoints: 220,
    icon: "🏃"
  }
];

// =====================
// AVATARS
// =====================

const AVATARS = [
  { id: 1, name: "Captain Thunder", icon: "⚡" },
  { id: 2, name: "Shadow Ninja", icon: "🥷" },
  { id: 3, name: "Robot Rex", icon: "🤖" },
  { id: 4, name: "Galaxy Guardian", icon: "🌌" },
  { id: 5, name: "Iron Falcon", icon: "🦅" },
  { id: 6, name: "Speed Fox", icon: "🦊" },
  { id: 7, name: "Shield Bearer", icon: "🛡️" },
  { id: 8, name: "Storm Panther", icon: "🐆" }
];

// =====================
// ENCOURAGEMENT MESSAGES
// =====================

const ENCOURAGEMENTS = [
  "Heroic!",
  "Amazing!",
  "Fantastic!",
  "Incredible!",
  "Power Up!",
  "Super Speed!",
  "Outstanding!"
];
