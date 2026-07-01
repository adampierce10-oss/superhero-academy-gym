/*
v1.0.0-alpha.6
FINAL CORE ENGINE
TIME + PERFORMANCE SCORING SYSTEM
*/

const AppState = {
  screen: "home",
  players: [],
  selectedAvatar: null,
  exerciseStart: {},
  sessionHistory: []
};

/* ---------------- SCREEN ---------------- */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById("screen-" + id);
  if (el) el.classList.add("active");

  AppState.screen = id;
}

/* ---------------- PLAYER ---------------- */

function addPlayer() {
  const name = prompt("Hero name:");
  if (!name || !AppState.selectedAvatar) return;

  AppState.players.push({
    id: Date.now(),
    name,
    avatar: AppState.selectedAvatar,
    score: 0,
    currentExercise: 0,
    exercises: [],
    finished: false
  });

  AppState.selectedAvatar = null;
  renderPlayers();
  renderAvatars();
}

/* ---------------- EXERCISES ---------------- */

function assignExercises(p) {
  const pool = [...EXERCISES];
  const chosen = [];

  for (let i = 0; i < CONFIG.exercisesPerPlayer; i++) {
    chosen.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  }

  p.exercises = chosen;
  p.currentExercise = 0;
}

/* ---------------- TIMER START ---------------- */

function startExerciseTimer(playerId) {
  AppState.exerciseStart[playerId] = Date.now();
}

/* ---------------- SCORING ENGINE ---------------- */

function calculateScore(ex, elapsed) {

  const mult = CONFIG.difficultyLevels[ex.difficulty].multiplier;

  let score = ex.basePoints * mult;

  // REPS
  if (ex.type === "reps") {
    const bonus = Math.max(0, CONFIG.scoring.speedBonusCap - elapsed * 2);
    score += bonus;
  }

  // HOLD
  if (ex.type === "hold") {
    if (elapsed <= CONFIG.scoring.holdBufferSeconds) {
      score += 50;
    } else {
      score -= (elapsed - CONFIG.scoring.holdBufferSeconds) * CONFIG.scoring.holdDecayPerSecond;
    }
  }

  // DISTANCE
  if (ex.type === "distance") {
    const bonus = Math.max(0, CONFIG.scoring.speedBonusCap - elapsed * 1.5);
    score += bonus;
  }

  return Math.max(10, Math.floor(score));
}

/* ---------------- COMPLETE ---------------- */

function completeExercise(playerId, e) {

  const p = AppState.players.find(x => x.id === playerId);
  const ex = p.exercises[p.currentExercise];

  if (!AppState.exerciseStart[playerId]) {
    startExerciseTimer(playerId);
  }

  const elapsed = (Date.now() - AppState.exerciseStart[playerId]) / 1000;

  const gained = calculateScore(ex, elapsed);

  p.score += gained;
  p.currentExercise++;

  AppState.exerciseStart[playerId] = Date.now();

  renderGame();
  renderLeaderboard();

  checkEnd();
}

/* ---------------- GAME FLOW ---------------- */

function startMission() {

  AppState.players.forEach(assignExercises);

  showScreen("countdown");

  let c = CONFIG.timers.countdown;

  const i = setInterval(() => {
    document.getElementById("countdownText").innerText = c--;
    if (c < 0) {
      clearInterval(i);
      beginGame();
    }
  }, 1000);
}

/* ---------------- GAME ---------------- */

function beginGame() {
  showScreen("gameplay");
  renderGame();
  renderLeaderboard();
}

/* ---------------- RENDER ---------------- */

function renderGame() {
  const area = document.getElementById("gameArea");
  area.innerHTML = "";

  AppState.players.forEach(p => {

    const ex = p.exercises[p.currentExercise];

    const card = document.createElement("div");
    card.className = "playerCard";

    if (!ex) {
      card.innerHTML = `<h3>${p.avatar} ${p.name}</h3><p>COMPLETE 🏁</p>`;
      area.appendChild(card);
      return;
    }

    startExerciseTimer(p.id);

    card.innerHTML = `
      <h3>${p.avatar} ${p.name}</h3>
      <div>${ex.icon} ${ex.name}</div>
      <div>Target: ${ex.target}</div>
      <div>Exercise ${p.currentExercise + 1}/6</div>
      <button onclick="completeExercise(${p.id}, event)">COMPLETE</button>
    `;

    area.appendChild(card);
  });
}

/* ---------------- LEADERBOARD ---------------- */

function renderLeaderboard() {
  const board = document.getElementById("leaderboard");

  board.innerHTML = [...AppState.players]
    .sort((a,b) => b.score - a.score)
    .map(p => `
      <div style="margin:6px;padding:6px;border-left:6px solid #0E78FF;">
        ${p.avatar} ${p.name} — ${p.score}
      </div>
    `).join("");
}

/* ---------------- END ---------------- */

function checkEnd() {
  if (AppState.players.every(p => p.currentExercise >= CONFIG.exercisesPerPlayer)) {

    AppState.sessionHistory.push({
      date: Date.now(),
      results: AppState.players.map(p => ({
        name: p.name,
        score: p.score
      }))
    });

    showScreen("results");

    document.getElementById("results").innerHTML =
      [...AppState.players]
        .sort((a,b) => b.score - a.score)
        .map(p => `<div>🏆 ${p.avatar} ${p.name} — ${p.score}</div>`)
        .join("");
  }
}

/* ---------------- EVENTS ---------------- */

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("startGameBtn").onclick = () => showScreen("playerSetup");

  document.getElementById("addPlayerBtn").onclick = addPlayer;

  document.getElementById("startCampBtn").onclick = startMission;

});
