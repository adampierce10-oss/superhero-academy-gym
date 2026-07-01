/*
Superhero Academy Challenge
v1.0.0-alpha.2 PATCH 1
FIX: Player Setup Flow Stability
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

  if (!screen) {
    console.warn("Screen not found:", id);
    return;
  }

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
    exercises: []
  });

  renderPlayers();
}

function renderPlayers() {
  const el = document.getElementById("playerList");
  if (!el) return;

  el.innerHTML = AppState.players.length
    ? AppState.players.map(p => `<div style="font-size:22px;margin:10px;">🦸 ${p.name}</div>`).join("")
    : "<p>No heroes added yet</p>";
}

/* ---------------------------
GAME START
----------------------------*/

function startGameFlow() {
  if (AppState.players.length === 0) {
    alert("Add at least one hero first!");
    return;
  }

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
BEGIN GAME (SAFE STUB)
----------------------------*/

function beginGame() {
  AppState.gameStarted = true;
  showScreen("gameplay");

  const gameArea = document.getElementById("gameArea");

  gameArea.innerHTML = AppState.players.map(p => `
    <div class="playerCard">
      <h3>${p.name}</h3>
      <p>Ready for Exercises</p>
      <button onclick="completeExercise(${p.id})">
        COMPLETE
      </button>
    </div>
  `).join("");
}

/* ---------------------------
EXERCISE COMPLETE (TEMP)
----------------------------*/

function completeExercise(playerId) {
  const player = AppState.players.find(p => p.id === playerId);
  if (!player) return;

  player.score += 100;
  player.currentExercise++;

  renderLeaderboard();
}

/* ---------------------------
LEADERBOARD (MINIMAL)
----------------------------*/

function renderLeaderboard() {
  const board = document.getElementById("leaderboard");
  if (!board) return;

  board.innerHTML = [...AppState.players]
    .sort((a,b) => b.score - a.score)
    .map(p => `
      <div style="padding:6px;font-size:18px;">
        ${p.name} — ${p.score}
      </div>
    `).join("");
}

/* ---------------------------
EVENTS
----------------------------*/

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("startGameBtn")
    .onclick = () => showScreen("playerSetup");

  document.getElementById("hallBtn")
    .onclick = () => showScreen("hall");

  document.getElementById("settingsBtn")
    .onclick = () => showScreen("settings");

  document.getElementById("addPlayerBtn")
    .onclick = addPlayer;

  document.getElementById("startCampBtn")
    .onclick = startGameFlow;

});
