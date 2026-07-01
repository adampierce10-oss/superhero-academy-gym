/*
Superhero Academy Challenge
v1.0.0-alpha.3
REAL GAME ENGINE
*/

const AppState = {
  screen: "home",
  players: [],
  gameStarted: false
};

/* ---------------------------
SCREEN MANAGER
----------------------------*/

function showScreen(id) {
  document.querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));

  const screen = document.getElementById("screen-" + id);

  if (!screen) return;

  screen.classList.add("active");
  AppState.screen = id;
}

/* ---------------------------
PLAYER SYSTEM
----------------------------*/

function addPlayer() {
  const name = prompt("Enter hero name:");
  if (!name) return;

  AppState.players.push({
    id: Date.now(),
    name,
    score: 0,
    currentExercise: 0,
    exercises: [],
    finished: false
  });

  renderPlayers();
}

function renderPlayers() {
  const el = document.getElementById("playerList");
  if (!el) return;

  el.innerHTML = AppState.players.length
    ? AppState.players.map(p =>
        `<div style="font-size:22px;margin:8px;">🦸 ${p.name}</div>`
      ).join("")
    : "<p>No heroes yet</p>";
}

/* ---------------------------
EXERCISE ENGINE
----------------------------*/

function generateExercisesForPlayer(player) {
  const pool = [...EXERCISES];
  const selected = [];

  for (let i = 0; i < CONFIG.exercisesPerPlayer; i++) {
    const index = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }

  player.exercises = selected;
  player.currentExercise = 0;
}

/* ---------------------------
GAME START
----------------------------*/

function startGameFlow() {
  if (AppState.players.length === 0) {
    alert("Add at least one hero!");
    return;
  }

  AppState.players.forEach(generateExercisesForPlayer);

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

/* ---------------------------
GAME LOOP
----------------------------*/

function beginGame() {
  AppState.gameStarted = true;

  showScreen("gameplay");

  renderGame();
  renderLeaderboard();
}

/* ---------------------------
RENDER GAME
----------------------------*/

function renderGame() {
  const area = document.getElementById("gameArea");
  area.innerHTML = "";

  AppState.players.forEach(p => {
    const ex = p.exercises[p.currentExercise];

    const card = document.createElement("div");
    card.className = "playerCard";

    if (!ex) {
      card.innerHTML = `
        <h3>${p.name}</h3>
        <p>COMPLETE</p>
      `;
      area.appendChild(card);
      return;
    }

    card.innerHTML = `
      <h3>${p.name}</h3>
      <div style="font-size:20px;">
        ${ex.icon} ${ex.name}
      </div>
      <div>Target: ${ex.target}</div>
      <div>Exercise ${p.currentExercise + 1}/6</div>
      <button onclick="completeExercise(${p.id})">
        COMPLETE
      </button>
    `;

    area.appendChild(card);
  });
}

/* ---------------------------
COMPLETE EXERCISE
----------------------------*/

function completeExercise(playerId) {
  const player = AppState.players.find(p => p.id === playerId);
  if (!player) return;

  const exercise = player.exercises[player.currentExercise];

  if (!exercise) return;

  // placeholder scoring (will be upgraded in alpha.4)
  player.score += exercise.basePoints || 100;

  player.currentExercise++;

  if (player.currentExercise >= CONFIG.exercisesPerPlayer) {
    player.finished = true;
  }

  renderGame();
  renderLeaderboard();
  checkEndGame();
}

/* ---------------------------
LEADERBOARD
----------------------------*/

function renderLeaderboard() {
  const board = document.getElementById("leaderboard");

  board.innerHTML = [...AppState.players]
    .sort((a,b) => b.score - a.score)
    .map(p => `
      <div style="font-size:18px;">
        ${p.name} — ${p.score}
      </div>
    `).join("");
}

/* ---------------------------
END GAME
----------------------------*/

function checkEndGame() {
  const done = AppState.players.every(
    p => p.currentExercise >= CONFIG.exercisesPerPlayer
  );

  if (!done) return;

  showScreen("results");

  document.getElementById("results").innerHTML =
    [...AppState.players]
      .sort((a,b) => b.score - a.score)
      .map(p => `
        <div style="font-size:22px;margin:10px;">
          🏆 ${p.name} — ${p.score}
        </div>
      `).join("");
}

/* ---------------------------
EVENTS
----------------------------*/

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("startGameBtn")
    .onclick = () => showScreen("playerSetup");

  document.getElementById("addPlayerBtn")
    .onclick = addPlayer;

  document.getElementById("startCampBtn")
    .onclick = startGameFlow;

  document.getElementById("hallBtn")
    .onclick = () => showScreen("hall");

  document.getElementById("settingsBtn")
    .onclick = () => showScreen("settings");

});
