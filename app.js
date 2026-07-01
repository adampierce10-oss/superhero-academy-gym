/*
v1.0.0-alpha.5
GAME FEEL + POLISH LAYER
*/

const AppState = {
  screen: "home",
  players: [],
  selectedAvatar: null,
  cooldown: {}
};

/* ---------------- SCREEN ---------------- */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
  });

  const el = document.getElementById("screen-" + id);
  if (el) el.classList.add("active");

  AppState.screen = id;

  if (id === "rosterReview") renderRoster();
}

/* ---------------- AVATARS ---------------- */

function renderAvatars() {
  const grid = document.getElementById("avatarGrid");
  if (!grid) return;

  const taken = AppState.players.map(p => p.avatar);

  grid.innerHTML = AVATARS.map(a => `
    <div class="avatar ${taken.includes(a.icon) ? "selected" : ""}"
         onclick="selectAvatar('${a.icon}')">
      ${a.icon}
    </div>
  `).join("");
}

function selectAvatar(icon) {
  if (AppState.players.find(p => p.avatar === icon)) return;

  AppState.selectedAvatar = icon;
}

/* ---------------- PLAYERS ---------------- */

function addPlayer() {
  const name = prompt("Hero name:");
  if (!name) return;

  if (!AppState.selectedAvatar) {
    alert("Select an avatar first!");
    return;
  }

  AppState.players.push({
    id: Date.now(),
    name,
    avatar: AppState.selectedAvatar,
    score: 0,
    currentExercise: 0,
    exercises: []
  });

  AppState.selectedAvatar = null;

  renderPlayers();
  renderAvatars();
}

function renderPlayers() {
  const el = document.getElementById("playerList");
  if (!el) return;

  el.innerHTML = AppState.players.map(p => `
    <div style="font-size:20px;margin:6px;">
      ${p.avatar} ${p.name}
    </div>
  `).join("");
}

/* ---------------- ROSTER ---------------- */

function renderRoster() {
  const el = document.getElementById("rosterList");

  el.innerHTML = AppState.players.map(p => `
    <div style="font-size:22px;margin:8px;">
      ${p.avatar} ${p.name}
    </div>
  `).join("");
}

/* ---------------- EXERCISES ---------------- */

function assignExercises(player) {
  const pool = [...EXERCISES];
  const chosen = [];

  for (let i = 0; i < CONFIG.exercisesPerPlayer; i++) {
    chosen.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  }

  player.exercises = chosen;
  player.currentExercise = 0;
}

/* ---------------- GAME START ---------------- */

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

/* ---------------- GAME RENDER ---------------- */

function renderGame() {
  const area = document.getElementById("gameArea");
  area.innerHTML = "";

  AppState.players.forEach(p => {
    const ex = p.exercises[p.currentExercise];

    const card = document.createElement("div");
    card.className = "playerCard";

    if (!ex) {
      card.innerHTML = `<h3>${p.avatar} ${p.name}</h3><p>DONE 🏁</p>`;
      area.appendChild(card);
      return;
    }

    card.innerHTML = `
      <h3>${p.avatar} ${p.name}</h3>
      <div>${ex.icon} ${ex.name}</div>
      <div>Target: ${ex.target}</div>
      <button onclick="completeExercise(${p.id}, event)">COMPLETE</button>
    `;

    area.appendChild(card);
  });
}

/* ---------------- SCORING ---------------- */

function score(ex, time) {
  let base = ex.basePoints || 100;

  if (ex.type === "reps") base += Math.max(0, 50 - time);
  if (ex.type === "distance") base += Math.max(0, 40 - time);
  if (ex.type === "hold") base += time < 10 ? 50 : -time;

  return Math.max(10, Math.floor(base));
}

/* ---------------- COMPLETE ---------------- */

function completeExercise(id, e) {
  if (AppState.cooldown[id]) return;

  AppState.cooldown[id] = true;
  setTimeout(() => AppState.cooldown[id] = false, 600);

  const p = AppState.players.find(x => x.id === id);
  const ex = p.exercises[p.currentExercise];

  const time = Math.random() * 20;

  const gained = score(ex, time);

  p.score += gained;
  p.currentExercise++;

  showPopup(e, "+" + gained);

  renderGame();
  renderLeaderboard();
  checkEnd();
}

/* ---------------- POPUP ---------------- */

function showPopup(e, text) {
  const d = document.createElement("div");
  d.className = "scorePopup";
  d.innerText = text;
  d.style.left = e.pageX + "px";
  d.style.top = e.pageY + "px";

  document.body.appendChild(d);

  setTimeout(() => d.remove(), 800);
}

/* ---------------- LEADERBOARD ---------------- */

function renderLeaderboard() {
  const board = document.getElementById("leaderboard");

  board.innerHTML = [...AppState.players]
    .sort((a,b) => b.score - a.score)
    .map(p => `
      <div class="playerBar" style="border-color:#0E78FF">
        ${p.avatar} ${p.name} — ${p.score}
      </div>
    `).join("");
}

/* ---------------- END ---------------- */

function checkEnd() {
  if (AppState.players.every(p => p.currentExercise >= CONFIG.exercisesPerPlayer)) {
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

  document.getElementById("startGameBtn").onclick = () => {
    renderAvatars();
    showScreen("playerSetup");
  };

  document.getElementById("addPlayerBtn").onclick = addPlayer;

  document.getElementById("goRosterBtn").onclick = () => showScreen("rosterReview");

  document.getElementById("startCampBtn").onclick = startMission;

});
