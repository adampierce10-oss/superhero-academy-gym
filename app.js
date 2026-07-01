/*
Superhero Academy Challenge
v1.0.0-alpha.2
GAME ENGINE
*/

const AppState = {
  screen: "home",
  players: [],
  activeExercises: {},
  exerciseIndex: 0,
  gameStarted: false,
  startTime: null
};

/* ---------------------------
SCREEN MANAGER
----------------------------*/

function showScreen(id) {
  document.querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));

  document.getElementById("screen-" + id)
    .classList.add("active");

  AppState.screen = id;
}

/* ---------------------------
PLAYER SYSTEM
----------------------------*/

function addPlayer() {
  const name = prompt("Enter hero name:");
  if (!name) return;

  const player = {
    id: Date.now(),
    name,
    score: 0,
    progress: 0,
    exercises: [],
    currentExercise: 0
  };

  AppState.players.push(player);
  renderPlayers();
}

function renderPlayers() {
  const list = document.getElementById("playerList");
  if (!list) return;

  list.innerHTML = AppState.players
    .map(p => `<div>${p.name}</div>`)
    .join("");
}

/* ---------------------------
EXERCISE ASSIGNMENT
----------------------------*/

function assignExercises() {
  return AppState.players.map(p => {
    const pool = [...EXERCISES];

    const selected = [];

    for (let i = 0; i < CONFIG.exercisesPerPlayer; i++) {
      const index = Math.floor(Math.random() * pool.length);
      selected.push(pool.splice(index, 1)[0]);
    }

    p.exercises = selected;
    p.currentExercise = 0;

    return p;
  });
}

/* ---------------------------
GAME FLOW
----------------------------*/

function startGame() {
  assignExercises();

  showScreen("countdown");

  let count = CONFIG.timers.countdown;

  const interval = setInterval(() => {
    document.getElementById("countdownText").innerText = count;

    count--;

    if (count < 0) {
      clearInterval(interval);
      beginGame();
    }
  }, 1000);
}

function beginGame() {
  AppState.gameStarted = true;
  AppState.startTime = Date.now();

  showScreen("gameplay");

  renderGame();
}

/* ---------------------------
GAME RENDER
----------------------------*/

function renderGame() {
  const area = document.getElementById("gameArea");
  area.innerHTML = "";

  AppState.players.forEach(p => {
    const ex = p.exercises[p.currentExercise];

    const card = document.createElement("div");
    card.className = "playerCard";

    card.innerHTML = `
      <h3>${p.name}</h3>
      <div>${ex.icon} ${ex.name}</div>
      <div>Target: ${ex.target}</div>
      <button onclick="completeExercise(${p.id})">COMPLETE</button>
    `;

    area.appendChild(card);
  });
}

/* ---------------------------
EXERCISE COMPLETE
----------------------------*/

function completeExercise(playerId) {
  const player = AppState.players.find(p => p.id === playerId);

  if (!player) return;

  player.currentExercise++;

  player.score += 100; // placeholder scoring

  if (player.currentExercise >= CONFIG.exercisesPerPlayer) {
    player.finished = true;
  }

  checkEndGame();
  renderGame();
}

/* ---------------------------
END GAME CHECK
----------------------------*/

function checkEndGame() {
  const done = AppState.players.every(p =>
    p.currentExercise >= CONFIG.exercisesPerPlayer
  );

  if (!done) return;

  showScreen("results");

  document.getElementById("results").innerHTML =
    AppState.players
      .sort((a,b) => b.score - a.score)
      .map(p => `<div>${p.name}: ${p.score}</div>`)
      .join("");
}

/* ---------------------------
EVENT BINDING
----------------------------*/

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("startGameBtn")
    .onclick = () => showScreen("playerSetup");

  document.getElementById("addPlayerBtn")
    .onclick = addPlayer;

  document.getElementById("startCampBtn")
    .onclick = startGame;

  document.getElementById("hallBtn")
    .onclick = () => showScreen("hall");

  document.getElementById("settingsBtn")
    .onclick = () => showScreen("settings");

});
