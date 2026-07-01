/*
---------------------------------------------------
Superhero Academy Challenge
Version: 1.0.0-alpha.2
File: app.js
---------------------------------------------------
*/

// =====================
// GLOBAL STATE
// =====================

const AppState = {
  currentScreen: "home",
  players: [],
  gameStarted: false
};

// =====================
// SCREEN MANAGER
// =====================

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");

  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById("screen-" + screenId);

  if (target) {
    target.classList.add("active");
  }

  AppState.currentScreen = screenId;
}

// =====================
// INITIALIZATION
// =====================

function initApp() {
  console.log("Superhero Academy Challenge Loaded");

  setupEventListeners();

  showScreen("home");
}

// =====================
// EVENT LISTENERS
// =====================

function setupEventListeners() {
  document.getElementById("startGameBtn")
    .addEventListener("click", () => {
      showScreen("playerSetup");
    });

  document.getElementById("hallBtn")
    .addEventListener("click", () => {
      showScreen("hall");
    });

  document.getElementById("settingsBtn")
    .addEventListener("click", () => {
      showScreen("settings");
    });

  const backButtons = document.querySelectorAll(".backButton");

  backButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      showScreen("home");
    });
  });
}

// =====================
// START APP
// =====================

document.addEventListener("DOMContentLoaded", initApp);
