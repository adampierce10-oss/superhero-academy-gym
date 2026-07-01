/*
Superhero Academy Challenge v1.0.0-alpha.4
SCORING ENGINE + LIVE LEADERBOARD
*/

const AppState = {
  screen: "home",
  players: [],
  gameStarted: false,
  exerciseStartTime: {}
};

/* ---------------- SCREEN ---------------- */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const screen = document.getElementById("screen-" + id);
  if (screen) screen.classList.add("active");
}

/* ---------------- PLAYERS ---------------- */

function addPlayer() {
  const name = prompt("Enter hero name:");
  if (!name) return;

  AppState.players.push({
    id: Date.now(),
    name,
    score: 0,
    currentExercise: 0,
    exercises: [],
    finished: false,
    color: CONFIG.colors[AppState.players.length % CONFIG.colors.length]
  });

  renderPlayers();
}

function renderPlayers() {
  const el = document.getElementById("playerList");
  if (!el) return;

  el.innerHTML = AppState.players.length
    ? AppState.players.map(p =>
        `<div style="font-size:20px;margin:6px;color:${p.color}">
          🦸 ${p.name}
        </div>`
      ).join("")
    : "<p>No heroes yet</p>";
}

/* ---------------- EXERCISES ---------------- */

function generateExercises(player) {
  const pool = [...EXERCISES];
  const selected = [];

  for (let i = 0; i < CONFIG.exercisesPerPlayer; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(idx, 1)[0]);
  }

  player.exercises = selected;
  player.currentExercise = 0;
}

/* ---------------- GAME START ---------------- */

function startGameFlow() {
  if (!AppState.players.length) {
    alert("Add heroes first!");
    return;
  }

  AppState.players.forEach(generateExercises);

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

/* ---------------- GAME ---------------- */

function beginGame() {
  AppState.gameStarted = true;
  showScreen("gameplay");

  renderGame();
  renderLeaderboard();
}

/* ---------------- RENDER GAME ---------------- */

function renderGame() {
  const area = document.getElementById("gameArea");
  area.innerHTML = "";

  AppState.players.forEach(p => {
    const ex = p.exercises[p.currentExercise];

    const card = document.createElement("div");
    card.className = "playerCard";
    card.style.border = `3px solid ${p.color}`;

    if (!ex) {
      card.innerHTML = `<h3>${p.name}</h3><p>COMPLETE 🏁</p>`;
      area.appendChild(card);
      return;
    }

    // start timer when rendering exercise
    if (!AppState.exerciseStartTime[p.id]) {
      AppState.exerciseStartTime[p.id] = Date.now();
    }

    card.innerHTML = `
      <h3>${p.name}</h3>
      <div style="font-size:22px">${ex.icon} ${ex.name}</div>
      <div>Target: ${ex.target}</div>
      <div>Exercise ${p.currentExercise + 1}/6</div>
      <button onclick="completeExercise(${p.id})">COMPLETE</button>
    `;

    area.appendChild(card);
  });
}

/* ---------------- SCORING ENGINE ---------------- */

function calculateScore(player, exercise) {
  const multiplier = CONFIG.difficultyLevels[exercise.difficulty].multiplier;
  const base = exercise.basePoints;

  const start = AppState.exerciseStartTime[player.id];
  const elapsed = (Date.now() - start) / 1000;

  let score = base * multiplier;

  // Reps = faster is better
  if (exercise.type === "reps") {
    score += Math.max(0, 50 - elapsed);
  }

  // Hold = buffer then decay
  if (exercise.type === "hold") {
    if (elapsed <= CONFIG.scoring.holdBufferSeconds) {
      score += 50;
    } else {
      score -= (elapsed - CONFIG.scoring.holdBufferSeconds) * CONFIG.scoring.holdDecayRate;
    }
  }

  // Distance = speed bonus
  if (exercise.type === "distance") {
    score += Math.max(0, 40 - elapsed);
  }

  return Math.max(10, Math.floor(score));
}

/* ---------------- COMPLETE EXERCISE ---------------- */

function completeExercise(playerId) {
  const player = AppState.players.find(p => p.id === playerId);
  if (!player) return;

  const exercise = player.exercises[player.currentExercise];
  if (!exercise) return;

  const gained = calculateScore(player, exercise);

  player.score += gained;

  // reset timer
  AppState.exerciseStartTime[player.id] = Date.now();

  player.currentExercise++;

  renderGame();
  renderLeaderboard();

  checkEndGame();
}

/* ---------------- LEADERBOARD ---------------- */

function renderLeaderboard() {
  const board = document.getElementById("leaderboard");

  const sorted = [...AppState.players].sort((a,b) => b.score - a.score);

  board.innerHTML = sorted.map((p, index) => {
    const progress = (p.currentExercise / CONFIG.exercisesPerPlayer) * 100;

    return `
      <div style="
        margin:6px;
        padding:6px;
        border-left:8px solid ${p.color};
      ">
        <div style="display:flex;justify-content:space-between;">
          <strong>${p.name}</strong>
          <span>${p.score}</span>
        </div>

        <div style="height:8px;background:#333;">
          <div style="
            width:${progress}%;
            height:8px;
            background:${p.color};
          "></div>
        </div>
      </div>
    `;
  }).join("");
}

/* ---------------- END GAME ---------------- */

function checkEndGame() {
  const done = AppState.players.every(
    p => p.currentExercise >= CONFIG.exercisesPerPlayer
  );

  if (!done) return;

  showScreen("results");

  document.getElementById("results").innerHTML =
    [...AppState.players]
      .sort((a,b) => b.score - a.score)
      .map((p,i) => `
        <div style="font-size:24px;margin:10px;">
          ${i === 0 ? "🏆" : "⭐"} ${p.name} — ${p.score}
        </div>
      `).join("");
}

/* ---------------- EVENTS ---------------- */

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("startGameBtn").onclick = () => showScreen("playerSetup");
  document.getElementById("addPlayerBtn").onclick = addPlayer;
  document.getElementById("startCampBtn").onclick = startGameFlow;

});
