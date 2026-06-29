let gameState = {
  status: "setup",
  players: [],
  leaderboard: []
};

let selectedAvatar = null;

document.getElementById("addHeroBtn").onclick = openModal;
document.getElementById("startBtn").onclick = startGame;

function openModal() {
  document.getElementById("heroModal").classList.remove("hidden");
  renderAvatars();
}

function closeModal() {
  document.getElementById("heroModal").classList.add("hidden");
}

function nextStep(n) {
  document.querySelectorAll(".step").forEach(s => s.classList.add("hidden"));
  document.getElementById("step" + n).classList.remove("hidden");
}

function renderAvatars() {
  const grid = document.getElementById("avatarGrid");
  grid.innerHTML = "";

  avatars.forEach(a => {
    const div = document.createElement("div");
    div.className = "avatar";
    div.innerText = a;

    div.onclick = () => {
      selectedAvatar = a;
      document.querySelectorAll(".avatar").forEach(v => v.classList.remove("selected"));
      div.classList.add("selected");
    };

    grid.appendChild(div);
  });
}

function createHero() {
  const name = document.getElementById("heroName").value;
  const difficulty = document.getElementById("heroDifficulty").value;

  if (!name || !selectedAvatar) return;

  const player = {
    id: Date.now(),
    name,
    avatar: selectedAvatar,
    difficulty: Number(difficulty),
    multiplier: Number(difficulty),
    score: 0,
    currentIndex: 0,
    exercises: [],
    startTime: null,
    completed: 0
  };

  gameState.players.push(player);

  renderPlayers();
  closeModal();
}

function startGame() {
  if (gameState.players.length === 0) return;

  gameState.status = "playing";

  gameState.players.forEach(p => {
    p.exercises = assignExercises();
    p.currentIndex = 0;
    p.completed = 0;
    p.score = 0;
    startExercise(p);
  });

  renderPlayers();
  updateLeaderboard();
}

function assignExercises() {
  let pool = [...exercisePool];
  let selected = [];

  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * pool.length);
    selected.push(pool[index]);
    pool.splice(index, 1);
  }

  return selected;
}

function startExercise(player) {
  player.startTime = Date.now();
}

function completeExercise(id) {
  const player = gameState.players.find(p => p.id === id);
  const ex = player.exercises[player.currentIndex];

  const time = (Date.now() - player.startTime) / 1000;

  let speed = ex.benchmark / time;
  speed = Math.max(0.25, Math.min(1.5, speed));

  const score = Math.round(ex.basePoints * player.multiplier * speed);

  player.score += score;
  player.completed++;
  player.currentIndex++;

  startExercise(player);

  updateLeaderboard();
  renderPlayers();
}

function renderPlayers() {
  const grid = document.getElementById("playerGrid");
  grid.innerHTML = "";

  gameState.players.forEach(p => {

    const ex = p.exercises[p.currentIndex];

    const card = document.createElement("div");
    card.className = "playerCard";

    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.avatar}</p>

      <h2>${ex ? ex.target : "DONE"}</h2>
      <h3>${ex ? ex.name : "FINISHED"}</h3>

      <p>${((Date.now() - (p.startTime || Date.now())) / 1000).toFixed(1)}s</p>

      <button onclick="completeExercise(${p.id})">
        I DID IT!
      </button>

      <p>${p.completed}/6</p>
      <p>Score: ${p.score}</p>
    `;

    grid.appendChild(card);
  });
}

function updateLeaderboard() {
  const board = document.getElementById("leaderboardList");
  board.innerHTML = "";

  gameState.players
    .sort((a,b) => b.score - a.score)
    .forEach(p => {
      const div = document.createElement("div");
      div.innerText = `${p.name} — ${p.score}`;
      board.appendChild(div);
    });
}
