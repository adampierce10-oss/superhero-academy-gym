let gameState = {
  status: "setup", // setup | playing | finished
  players: [],
  exercisesPool: [],
  sessionExercises: {},
  leaderboard: [],
  settings: {
    exercisesPerPlayer: 6
  }
};

let selectedAvatar = null;
let step = 1;

document.getElementById("addHeroBtn").onclick = openModal;

function openModal() {
  document.getElementById("heroModal").classList.remove("hidden");
  renderAvatars();
}

function closeModal() {
  document.getElementById("heroModal").classList.add("hidden");
  resetWizard();
}

function nextStep(n) {
  document.querySelectorAll(".step").forEach(s => s.classList.add("hidden"));
  document.getElementById("step" + n).classList.remove("hidden");
  step = n;
}

function renderAvatars() {
  const grid = document.getElementById("avatarGrid");
  grid.innerHTML = "";

  avatars.forEach(a => {
    const div = document.createElement("div");
    div.className = "avatar";

    if (gameState.usedAvatars.includes(a)) {
      div.style.opacity = "0.3";
      div.style.pointerEvents = "none";
    }

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
  id: 1,
  name: "Emma",
  avatar: "Lightning Hero",
  difficulty: 2,
  multiplier: 2,

  score: 0,

  currentIndex: 0,

  exercises: [],

  startTime: null,

  completed: 0
}

  gameState.players.push(player);
  gameState.usedAvatars.push(selectedAvatar);

  renderPlayers();
  closeModal();
}

function renderPlayers() {
  const grid = document.getElementById("playerGrid");
  grid.innerHTML = "";

  gameState.players.forEach(p => {
    const div = document.createElement("div");
    div.className = "playerCard";

    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.avatar}</p>
      <p>Score: ${p.score}</p>
    `;

    grid.appendChild(div);
  });
}
function resetWizard() {
  step = 1;
  selectedAvatar = null;
  document.getElementById("heroName").value = "";
  document.querySelectorAll(".step").forEach(s => s.classList.add("hidden"));
  document.getElementById("step1").classList.remove("hidden");
}
const exercisePool = [
  { id: 1, name: "Push-Ups", type: "reps", target: 20, benchmark: 25, basePoints: 100 },
  { id: 2, name: "Squats", type: "reps", target: 25, benchmark: 30, basePoints: 100 },
  { id: 3, name: "Plank", type: "hold", target: 30, benchmark: 35, basePoints: 120 },
  { id: 4, name: "Bear Crawl", type: "distance", target: 20, benchmark: 25, basePoints: 140 },
  { id: 5, name: "Lunges", type: "reps", target: 15, benchmark: 20, basePoints: 110 },
  { id: 6, name: "Wall Sit", type: "hold", target: 40, benchmark: 45, basePoints: 130 }
];
function startGame() {
  if (gameState.players.length === 0) return;

  gameState.status = "playing";

  gameState.players.forEach(player => {
    player.exercises = assignExercises();
    player.currentIndex = 0;
    player.score = 0;
    player.completed = 0;
  });

  function renderPlayers() {
  const grid = document.getElementById("playerGrid");
  grid.innerHTML = "";

  gameState.players.forEach(player => {

    const ex = player.exercises[player.currentIndex];

    const elapsed = player.startTime
      ? ((Date.now() - player.startTime) / 1000).toFixed(2)
      : "0.00";

    const card = document.createElement("div");
    card.className = "playerCard";

    card.innerHTML = `
      <h2>${player.name}</h2>
      <p>${player.avatar}</p>

      <h3>${ex ? ex.name : "DONE"}</h3>
      <h1>${ex ? ex.target : "🏁"}</h1>

      <p>${elapsed}s</p>

      <button onclick="completeExercise(${player.id})">
        I DID IT!
      </button>

      <p>${player.completed}/6 completed</p>
      <p>Score: ${player.score}</p>
    `;

    grid.appendChild(card);
  });
}
  function completeExercise(playerId) {
  const player = gameState.players.find(p => p.id === playerId);
  const ex = player.exercises[player.currentIndex];

  const timeTaken = (Date.now() - player.startTime) / 1000;

  let score = calculateScore(player, ex, timeTaken);

  player.score += score;
  player.completed++;
  player.currentIndex++;

  player.startTime = Date.now();

  updateLeaderboard();
  renderPlayers();

  if (player.completed === 6) {
    checkGameEnd();
  }
}
  function calculateScore(player, ex, time) {

  const difficultyMultiplier = player.multiplier;

  let speedMultiplier = ex.benchmark / time;

  speedMultiplier = Math.max(0.25, Math.min(1.5, speedMultiplier));

  let score = ex.basePoints * difficultyMultiplier * speedMultiplier;

  return Math.round(score);
}
  function updateLeaderboard() {
  gameState.leaderboard = [...gameState.players]
    .sort((a, b) => b.score - a.score);

  const board = document.getElementById("leaderboardList");
  board.innerHTML = "";

  gameState.leaderboard.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `${p.name} — ${p.score}`;
    board.appendChild(div);
  });
}
  function checkGameEnd() {
  const allDone = gameState.players.every(p => p.completed === 6);

  if (!allDone) return;

  gameState.status = "finished";

  alert("🏆 GAME COMPLETE!");
}
