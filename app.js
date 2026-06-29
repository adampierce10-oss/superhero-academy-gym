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
