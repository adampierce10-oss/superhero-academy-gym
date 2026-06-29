const avatars = [
  "Lightning Hero",
  "Fire Hero",
  "Ice Hero",
  "Robot Hero",
  "Galaxy Hero",
  "Ninja Hero",
  "Speed Hero",
  "Shadow Hero"
];

const difficulties = {
  1: { name: "Sidekick", multiplier: 1 },
  1.5: { name: "Hero", multiplier: 1.5 },
  2: { name: "Superhero", multiplier: 2 },
  3: { name: "Legend", multiplier: 3 }
};

const SHEETS = {
  EXERCISES: "Exercises",
  SESSIONS: "Sessions",
  RESULTS: "Results"
};
function doGet(e) {
  return route(e);
}

function doPost(e) {
  return route(e);
}

function route(e) {
  const action = e.parameter.action;

  if (action === "getExercises") return getExercises();
  if (action === "saveSession") return saveSession(e);

  return json({ error: "Invalid action" });
}
function getExercises() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(SHEETS.EXERCISES);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  let data = [];

  for (let i = 1; i < rows.length; i++) {
    let obj = {};
    headers.forEach((h, idx) => obj[h] = rows[i][idx]);
    data.push(obj);
  }

  return json(data);
}
